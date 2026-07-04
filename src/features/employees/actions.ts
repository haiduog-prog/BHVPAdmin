'use server'

// ─── Server Actions: Employee (Thin wrapper) ───────────────────────
// Chỉ chịu trách nhiệm: parse FormData → gọi Use Case → revalidate cache

import { container } from '@/di/container'
import { revalidatePath } from 'next/cache'
import { revalidateTag } from 'next/cache'

export async function addEmployee(formData: FormData) {
  const name = formData.get('name') as string
  const role = formData.get('role') as string
  const department = formData.get('department') as string

  const useCase = container.addEmployeeUseCase()
  const result = await useCase.execute({ name, role, department })

  if (result.success) {
    revalidateTag('employees', { expire: 0 }) // Xoá cache danh sách nhân viên
    revalidatePath('/employees')
  }

  return result.success
    ? { success: true }
    : { error: result.error || 'Lỗi không xác định' }
}
