'use server'

// ─── Server Actions: Customer ───────────────────────────────────────

import { container } from '@/di/container'
import { CustomerFormData } from '@/domain/customers/entity'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function addCustomer(data: CustomerFormData) {
  const useCase = container.addCustomerUseCase()
  const result = await useCase.execute(data)

  if (result.success) {
    revalidateTag('customers')
    revalidatePath('/customers')
  }

  return result
}

export async function updateCustomer(id: string, data: CustomerFormData) {
  const useCase = container.updateCustomerUseCase()
  const result = await useCase.execute(id, data)

  if (result.success) {
    revalidateTag('customers')
    revalidatePath('/customers')
  }

  return result
}

export async function deleteCustomer(id: string) {
  const useCase = container.deleteCustomerUseCase()
  const result = await useCase.execute(id)

  if (result.success) {
    revalidateTag('customers')
    revalidatePath('/customers')
  }

  return result
}
