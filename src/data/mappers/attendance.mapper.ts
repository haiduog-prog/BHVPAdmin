// ─── Mapper: Attendance DB Row → Domain Entity ─────────────────────

import { RawAttendanceLog } from '@/domain/attendance/entity'

/** Chuyển đổi raw row từ Supabase join query → domain RawAttendanceLog */
export function toRawAttendanceLog(row: any): RawAttendanceLog {
  return {
    id: row.id,
    employeeId: row.employee_id,
    employeeName: row.employees?.name || 'Không xác định',
    scanTime: row.scan_time,
    status: row.status as 'IN' | 'OUT',
  }
}
