// ─── Use Case: Xoá khách hàng ───────────────────────────────────────

import { ICustomerRepository } from '../repository'

export interface DeleteCustomerResult {
  success: boolean
  error?: string
}

export class DeleteCustomerUseCase {
  constructor(private readonly repo: ICustomerRepository) {}

  async execute(id: string): Promise<DeleteCustomerResult> {
    if (!id) {
      return { success: false, error: 'Thiếu mã khách hàng (ID).' }
    }

    try {
      await this.repo.delete(id)
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi không xác định khi xoá khách hàng.'
      return { success: false, error: message }
    }
  }
}
