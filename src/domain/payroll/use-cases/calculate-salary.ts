// ─── Use Case: Tính lương ───────────────────────────────────────────
// Logic tính lương trích từ PayrollSummary component → pure domain logic

import { MonthlyAttendance, PayrollConfig, SalaryResult } from '../entity'

export class CalculateSalaryUseCase {
  /**
   * Tính lương ước tính dựa trên chấm công và cấu hình.
   * Pure function — không cần repository, chỉ cần input data.
   */
  execute(attendance: MonthlyAttendance, config: PayrollConfig): SalaryResult {
    if (config.salaryType === 'daily') {
      const salary = attendance.totalWorkDays * config.dailyRate
      const label = `${attendance.totalWorkDays} ngày × ${config.dailyRate.toLocaleString('vi-VN')} ₫`
      return { salary, label }
    }

    // Tính theo giờ: làm tròn đến 0.5h
    const totalHoursDecimal = attendance.totalMinutes / 60
    const roundedHours = Math.round(totalHoursDecimal * 2) / 2
    const salary = roundedHours * config.hourlyRate
    const label = `${roundedHours}h × ${config.hourlyRate.toLocaleString('vi-VN')} ₫`

    return { salary, label }
  }
}
