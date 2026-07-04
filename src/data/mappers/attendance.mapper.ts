// ─── Mapper: Attendance DB Row → Domain Entity ─────────────────────

import { RawAttendanceLog } from '@/domain/attendance/entity'

/** Chuyển đổi raw row từ Supabase join query → domain RawAttendanceLog */
export function toRawAttendanceLog(row: unknown): RawAttendanceLog {
  const r = row as {
    id: string
    employee_id: string
    employees?: { name?: string | null } | null
    scan_time: string
    status: string
  }
  return {
    id: r.id,
    employeeId: r.employee_id,
    employeeName: r.employees?.name || 'Không xác định',
    scanTime: r.scan_time,
    status: r.status as 'IN' | 'OUT',
  }
}
