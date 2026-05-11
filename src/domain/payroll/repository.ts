// ─── Repository Interface: Payroll ─────────────────────────────────

import { RawPayrollLog } from './entity'

export interface IPayrollRepository {
  /** Lấy tên nhân viên theo ID */
  findEmployeeName(employeeId: string): Promise<string>

  /** Lấy raw attendance logs của 1 nhân viên trong khoảng thời gian */
  findLogsByEmployee(
    employeeId: string,
    startISO: string,
    endISO: string
  ): Promise<RawPayrollLog[]>
}
