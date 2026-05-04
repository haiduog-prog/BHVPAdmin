import { createAdminClient } from '@/lib/supabase/admin'
import { unstable_cache } from 'next/cache'
import { Employee } from './types'

// Hàm gốc fetch dữ liệu nhân viên từ Supabase (dùng admin client, không cần cookies)
async function fetchEmployees(): Promise<Employee[]> {
  try {
    // Fallback if env vars are placeholders
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

    return (data || []).map(emp => ({
      id: emp.id,
      fullName: emp.name || emp.full_name || 'Không xác định',
      role: emp.role || 'Nhân viên',
      department: emp.department || 'Chung',
      isActive: emp.is_active ?? true,
      createdAt: emp.created_at
    }))
  } catch (err: any) {
    console.warn('Supabase client error (Employees):', err?.message || 'Unknown error')
    return []
  }
}

// Cache danh sách nhân viên - 60 giây, tự xoá khi revalidateTag('employees') được gọi
export const getEmployees = unstable_cache(
  fetchEmployees,
  ['employees-list'],
  {
    tags: ['employees'],
    revalidate: 60,
  }
)
