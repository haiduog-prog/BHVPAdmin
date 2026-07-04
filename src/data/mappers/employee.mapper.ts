// ─── Mapper: Employee DB Row → Domain Entity ───────────────────────

import { Employee } from '@/domain/employees/entity'

/** Chuyển đổi raw row từ Supabase → domain Employee entity */
export function toEmployeeEntity(row: any): Employee {
  return {
    id: row.id,
    fullName: row.name || row.full_name || 'Không xác định',
    role: row.role || 'Nhân viên',
    department: row.department || 'Chung',
    isActive: row.is_active ?? true,
    createdAt: row.created_at,
  }
}
