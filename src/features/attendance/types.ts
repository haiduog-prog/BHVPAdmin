export interface AttendanceLog {
  id: string
  employeeId: string
  timestamp: string
  type: 'check_in' | 'check_out'
}

// Một lần quét mặt cụ thể trong ngày
export interface ScanLog {
  id: string
  scanTime: string
  status: 'IN' | 'OUT'
}

export interface DailyTimesheetRecord {
  employeeId: string
  fullName: string
  date: string
  firstCheckIn: string | null
  lastCheckOut: string | null
  totalMinutes: number
  scanLogs: ScanLog[]
}
