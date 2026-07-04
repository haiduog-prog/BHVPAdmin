// ─── Mapper: Customer DB Row → Domain Entity ─────────────────────────

import { Customer } from '@/domain/customers/entity'

export function toCustomerEntity(row: unknown): Customer {
  const r = row as {
    id: string
    name?: string | null
    phone?: string | null
    tax_code?: string | null
    address?: string | null
    company_name?: string | null
    created_at?: string | null
  }
  return {
    id: r.id,
    name: r.name || 'Không xác định',
    phone: r.phone || '',
    taxCode: r.tax_code || '',
    address: r.address || '',
    companyName: r.company_name || '',
    createdAt: r.created_at || new Date().toISOString(),
  }
}
