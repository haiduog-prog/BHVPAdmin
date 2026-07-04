// ─── Mapper: Employee DB Row → Domain Entity ───────────────────────

import { Employee } from '@/domain/employees/entity'

/** Chuyển đổi raw row từ Supabase → domain Employee entity */
export function toEmployeeEntity(row: unknown): Employee {
  const r = row as {
    id: string
    name?: string | null
    full_name?: string | null
    role?: string | null
    department?: string | null
    is_active?: boolean | null
    created_at: string
  }
  return {
    id: r.id,
    fullName: r.name || r.full_name || 'Không xác định',
    role: r.role || 'Nhân viên',
    department: r.department || 'Chung',
    isActive: r.is_active ?? true,
    createdAt: r.created_at,
  }
}
