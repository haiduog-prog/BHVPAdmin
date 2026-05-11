// ─── Use Case: Tổng hợp chấm công tháng ────────────────────────────
// Di chuyển logic nhóm log theo ngày từ payroll/services.ts cũ

import { MonthlyAttendance, WorkDay, RawPayrollLog } from '../entity'
import { IPayrollRepository } from '../repository'

export class GetMonthlyAttendanceUseCase {
  constructor(private readonly repo: IPayrollRepository) {}

  async execute(
    employeeId: string,
    year: number,
    month: number
  ): Promise<MonthlyAttendance> {
    // Tính khoảng thời gian đầu tháng → cuối tháng
    const startDate = `${year}-${String(month).padStart(2, '0')}-01T00:00:00.000Z`
    const lastDay = new Date(year, month, 0).getDate()
    const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}T23:59:59.999Z`

    // Fetch data qua repository
    const [employeeName, logs] = await Promise.all([
      this.repo.findEmployeeName(employeeId),
      this.repo.findLogsByEmployee(employeeId, startDate, endDate),
    ])

    // Business logic: nhóm log theo ngày
    const workDays = this.buildWorkDays(logs)
    const totalMinutes = workDays.reduce((sum, wd) => sum + wd.totalMinutes, 0)

    return {
      employeeId,
      employeeName,
      year,
      month,
      workDays,
      totalWorkDays: workDays.length,
      totalMinutes,
    }
  }

  // ─── Logic tính toán thuần ─────────────────────────────────────────

  private buildWorkDays(logs: RawPayrollLog[]): WorkDay[] {
    // Nhóm log theo ngày
    const dayMap = new Map<string, { scans: Date[]; statuses: string[] }>()

    logs.forEach((log) => {
      const dateKey = log.scanTime.toISOString().split('T')[0]

      if (!dayMap.has(dateKey)) {
        dayMap.set(dateKey, { scans: [], statuses: [] })
      }
      dayMap.get(dateKey)!.scans.push(log.scanTime)
      dayMap.get(dateKey)!.statuses.push(log.status)
    })

    // Tạo danh sách WorkDay
    const workDays: WorkDay[] = []

    dayMap.forEach((dayData, dateKey) => {
      const sortedScans = dayData.scans.sort((a, b) => a.getTime() - b.getTime())
      const firstScan = sortedScans[0]
      const lastScan = sortedScans[sortedScans.length - 1]

      let dayMinutes = 0
      if (sortedScans.length > 1) {
        dayMinutes = Math.round((lastScan.getTime() - firstScan.getTime()) / 60000)
      }

      workDays.push({
        date: dateKey,
        firstCheckIn: firstScan.toISOString(),
        lastCheckOut: sortedScans.length > 1 ? lastScan.toISOString() : null,
        totalMinutes: dayMinutes,
        scanCount: sortedScans.length,
      })
    })

    // Sắp xếp theo ngày
    workDays.sort((a, b) => a.date.localeCompare(b.date))

    return workDays
  }
}
