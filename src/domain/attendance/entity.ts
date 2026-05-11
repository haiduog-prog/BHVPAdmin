// ─── Domain Entity: Attendance ─────────────────────────────────────
// Các model liên quan đến chấm công

export interface AttendanceLog {
  id: string
  employeeId: string
  timestamp: string
  type: 'check_in' | 'check_out'
}

/** Một lần quét mặt cụ thể trong ngày */
export interface ScanLog {
  id: string
  scanTime: string
  status: 'IN' | 'OUT'
}

/** Bản ghi chấm công tổng hợp theo ngày cho 1 nhân viên */
export interface DailyTimesheetRecord {
  employeeId: string
  fullName: string
  date: string
  firstCheckIn: string | null
  lastCheckOut: string | null
  totalMinutes: number
  scanLogs: ScanLog[]
}

/** Raw log từ DB — dùng nội bộ cho use case xử lý */
export interface RawAttendanceLog {
  id: string
  employeeId: string
  employeeName: string
  scanTime: string
  status: 'IN' | 'OUT'
}
