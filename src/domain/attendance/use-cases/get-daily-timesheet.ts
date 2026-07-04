// ─── Use Case: Tính bảng chấm công ngày ────────────────────────────
// Di chuyển toàn bộ business logic tính toán từ attendance/actions.ts cũ

import { DailyTimesheetRecord, RawAttendanceLog, ScanLog } from '../entity'
import { IAttendanceRepository } from '../repository'

export class GetDailyTimesheetUseCase {
  constructor(private readonly repo: IAttendanceRepository) {}

  async execute(date: string): Promise<DailyTimesheetRecord[]> {
    const startOfDay = `${date}T00:00:00.000Z`
    const endOfDay = `${date}T23:59:59.999Z`

    const logs = await this.repo.findLogsByDateRange(startOfDay, endOfDay)

    return this.buildTimesheetRecords(logs, date)
  }

  // ─── Logic tính toán thuần — dễ unit test ─────────────────────────

  private buildTimesheetRecords(
    logs: RawAttendanceLog[],
    date: string
  ): DailyTimesheetRecord[] {
    const timesheetMap = new Map<string, DailyTimesheetRecord>()

    logs.forEach((log) => {
      const empId = log.employeeId
      if (!timesheetMap.has(empId)) {
        timesheetMap.set(empId, {
          employeeId: empId,
          fullName: log.employeeName,
          date: date,
          firstCheckIn: null,
          lastCheckOut: null,
          totalMinutes: 0,
          scanLogs: [],
        })
      }

      const record = timesheetMap.get(empId)!
      const logTime = new Date(log.scanTime)

      // Lưu chi tiết từng lần quét
      record.scanLogs.push({
        id: log.id,
        scanTime: log.scanTime,
        status: log.status,
      })

      // Xác định lần quét sớm nhất (Giờ vào)
      if (!record.firstCheckIn || logTime < new Date(record.firstCheckIn)) {
        record.firstCheckIn = log.scanTime
      }

      // Xác định lần quét muộn nhất (Giờ ra)
      if (!record.lastCheckOut || logTime > new Date(record.lastCheckOut)) {
        record.lastCheckOut = log.scanTime
      }
    })

    // Tính tổng số phút làm việc theo từng cặp IN-OUT
    Array.from(timesheetMap.values()).forEach((record) => {
      record.scanLogs.sort(
        (a, b) => new Date(a.scanTime).getTime() - new Date(b.scanTime).getTime()
      )

      let totalMinutes = 0
      let lastInTime: Date | null = null

      record.scanLogs.forEach((log) => {
        if (log.status === 'IN') {
          lastInTime = new Date(log.scanTime)
        } else if (log.status === 'OUT' && lastInTime) {
          const outTime = new Date(log.scanTime)
          const diffMs = outTime.getTime() - lastInTime.getTime()
          if (diffMs > 0) {
            totalMinutes += diffMs / 60000
          }
          lastInTime = null // Reset để đợi lượt IN tiếp theo
        }
      })

      record.totalMinutes = Math.round(totalMinutes)
    })

    return Array.from(timesheetMap.values())
  }
}
