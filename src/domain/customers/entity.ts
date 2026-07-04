// ─── Domain Entity: Customer ────────────────────────────────────────

export interface Customer {
  id: string
  name: string
  phone: string
  taxCode: string
  address: string
  companyName: string
  createdAt: string
}

export type CustomerFormData = Omit<Customer, 'id' | 'createdAt'>
