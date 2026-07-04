// ─── Supabase Repository: Employee ─────────────────────────────────

import { createAdminClient } from '@/lib/supabase/admin'
import { IEmployeeRepository } from '@/domain/employees/repository'
import { Employee, EmployeeFormData } from '@/domain/employees/entity'
import { toEmployeeEntity } from '@/data/mappers/employee.mapper'
import { unstable_cache } from 'next/cache'

export class SupabaseEmployeeRepository implements IEmployeeRepository {
  async findAll(): Promise<Employee[]> {
    // Cache ở repository level — 60 giây, revalidate bằng tag
    const cachedFetch = unstable_cache(
      async () => this.fetchFromSupabase(),
      ['employees-list'],
      {
        tags: ['employees'],
        revalidate: 60,
      }
    )
    return cachedFetch()
  }

  async create(data: EmployeeFormData): Promise<Employee> {
    const supabase = createAdminClient()

    const { data: created, error } = await supabase
      .from('employees')
      .insert([
        {
          name: data.name,
          role: data.role,
          department: data.department,
          is_active: true,
        },
      ])
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return toEmployeeEntity(created)
  }

  // ─── Private: raw Supabase query ──────────────────────────────────

  private async fetchFromSupabase(): Promise<Employee[]> {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
        return []
      }

      const supabase = createAdminClient()

      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name', { ascending: true })

      if (error) {
        console.warn('Supabase warning (Employees):', error.message || JSON.stringify(error))
        return []
      }

      return (data || []).map(toEmployeeEntity)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.warn('Supabase client error (Employees):', message)
      return []
    }
  }
}
