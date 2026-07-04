// ─── Mapper: Payroll DB Row → Domain Entity ────────────────────────

import { RawPayrollLog } from '@/domain/payroll/entity'

/** Chuyển đổi raw attendance_logs row → RawPayrollLog cho use case */
export function toRawPayrollLog(row: any): RawPayrollLog {
  return {
    id: row.id,
    scanTime: new Date(row.scan_time),
    status: row.status,
  }
}
