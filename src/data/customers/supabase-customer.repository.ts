// ─── Supabase Repository Implementation: Customer ────────────────────

import { createAdminClient } from '@/lib/supabase/admin'
import { ICustomerRepository } from '@/domain/customers/repository'
import { Customer, CustomerFormData } from '@/domain/customers/entity'
import { toCustomerEntity } from '@/data/mappers/customer.mapper'
import { unstable_cache } from 'next/cache'

// In-memory mock database for local development fallback
let mockCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Nguyễn Văn A',
    phone: '0912345678',
    taxCode: '0102030405',
    address: '123 Đường Láng, Đống Đa, Hà Nội',
    companyName: 'Công ty TNHH Thiết Kế & Quảng Cáo A',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cust-2',
    name: 'Trần Thị B',
    phone: '0987654321',
    taxCode: '0908070605',
    address: '456 Điện Biên Phủ, Quận 3, TP. HCM',
    companyName: 'Công ty Cổ phần Cơ khí In ấn B',
    createdAt: new Date().toISOString(),
  }
]

export class SupabaseCustomerRepository implements ICustomerRepository {
  private isFallback(): boolean {
    return process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url'
  }

  async findAll(): Promise<Customer[]> {
    if (this.isFallback()) {
      return [...mockCustomers].sort((a, b) => a.name.localeCompare(b.name))
    }

    // Cache ở repository level - 60 giây, revalidate bằng tag 'customers'
    const cachedFetch = unstable_cache(
      async () => this.fetchFromSupabase(),
      ['customers-list'],
      {
        tags: ['customers'],
        revalidate: 60,
      }
    )
    return cachedFetch()
  }

  async create(data: CustomerFormData): Promise<Customer> {
    if (this.isFallback()) {
      const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        name: data.name,
        phone: data.phone,
        taxCode: data.taxCode,
        address: data.address,
        companyName: data.companyName,
        createdAt: new Date().toISOString()
      }
      mockCustomers.push(newCustomer)
      return newCustomer
    }

    const supabase = createAdminClient()

    const { data: created, error } = await supabase
      .from('customers')
      .insert([
        {
          name: data.name,
          phone: data.phone,
          tax_code: data.taxCode,
          address: data.address,
          company_name: data.companyName,
        },
      ])
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return toCustomerEntity(created)
  }

  async update(id: string, data: CustomerFormData): Promise<Customer> {
    if (this.isFallback()) {
      const index = mockCustomers.findIndex(c => c.id === id)
      if (index === -1) {
        throw new Error('Không tìm thấy khách hàng cần cập nhật.')
      }
      const updatedCustomer: Customer = {
        ...mockCustomers[index],
        name: data.name,
        phone: data.phone,
        taxCode: data.taxCode,
        address: data.address,
        companyName: data.companyName,
      }
      mockCustomers[index] = updatedCustomer
      return updatedCustomer
    }

    const supabase = createAdminClient()

    const { data: updated, error } = await supabase
      .from('customers')
      .update({
        name: data.name,
        phone: data.phone,
        tax_code: data.taxCode,
        address: data.address,
        company_name: data.companyName,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return toCustomerEntity(updated)
  }

  async delete(id: string): Promise<void> {
    if (this.isFallback()) {
      const index = mockCustomers.findIndex(c => c.id === id)
      if (index === -1) {
        throw new Error('Không tìm thấy khách hàng cần xoá.')
      }
      mockCustomers = mockCustomers.filter(c => c.id !== id)
      return
    }

    const supabase = createAdminClient()

    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }
  }

  // ─── Private: raw Supabase query ──────────────────────────────────

  private async fetchFromSupabase(): Promise<Customer[]> {
    try {
      const supabase = createAdminClient()

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name', { ascending: true })

      if (error) {
        console.warn('Supabase warning (Customers):', error.message || JSON.stringify(error))
        return []
      }

      return (data || []).map(toCustomerEntity)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.warn('Supabase client error (Customers):', message)
      return []
    }
  }
}
