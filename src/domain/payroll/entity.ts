// ─── Domain Entity: Payroll ────────────────────────────────────────

/** Loại hình tính lương */
export type SalaryType = 'daily' | 'hourly'

/** Thông tin chấm công 1 ngày */
export interface WorkDay {
  date: string                // '2026-05-01'
  firstCheckIn: string | null // ISO timestamp
  lastCheckOut: string | null
  totalMinutes: number        // Tổng phút làm việc trong ngày
  scanCount: number           // Số lần quét mặt
}

/** Tổng hợp chấm công cả tháng cho 1 nhân viên */
export interface MonthlyAttendance {
  employeeId: string
  employeeName: string
  year: number
  month: number             // 1-12
  workDays: WorkDay[]       // Chỉ chứa các ngày CÓ đi làm
  totalWorkDays: number     // Tổng số ngày đi làm
  totalMinutes: number      // Tổng số phút làm trong tháng
}

/** Cấu hình tính lương (quản lý tự nhập trên giao diện) */
export interface PayrollConfig {
  salaryType: SalaryType
  dailyRate: number          // VNĐ/ngày (dùng khi salaryType = 'daily')
  hourlyRate: number         // VNĐ/giờ (dùng khi salaryType = 'hourly')
}

/** Kết quả tính lương */
export interface SalaryResult {
  salary: number
  label: string
}

/** Raw log từ DB cho use case xử lý */
export interface RawPayrollLog {
  id: string
  scanTime: Date
  status: string
}
