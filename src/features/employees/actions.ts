'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { revalidateTag } from 'next/cache'

export async function addEmployee(formData: FormData) {
  const name = formData.get('name') as string
  const role = formData.get('role') as string
  const department = formData.get('department') as string

  if (!name || !role || !department) {
    return { error: 'Vui lòng điền đầy đủ thông tin.' }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('employees')
    .insert([
      {
        name,
        role,
        department,
        is_active: true
        // face_vector will be left null
      }
    ])

  if (error) {
    console.error('Lỗi khi thêm nhân viên:', error)
    return { error: error.message }
  }

  revalidateTag('employees') // Xoá cache danh sách nhân viên
  revalidatePath('/employees')
  return { success: true }
}
