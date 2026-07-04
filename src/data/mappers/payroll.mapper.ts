// ─── Mapper: Payroll DB Row → Domain Entity ────────────────────────

import { RawPayrollLog } from '@/domain/payroll/entity'

/** Chuyển đổi raw attendance_logs row → RawPayrollLog cho use case */
export function toRawPayrollLog(row: unknown): RawPayrollLog {
  const r = row as {
    id: string
    scan_time: string
    status: string
  }
  return {
    id: r.id,
    scanTime: new Date(r.scan_time),
    status: r.status as 'IN' | 'OUT',
  }
}
