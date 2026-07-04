// ─── Use Case: Cập nhật thông tin khách hàng ─────────────────────────

import { Customer, CustomerFormData } from '../entity'
import { ICustomerRepository } from '../repository'

export interface UpdateCustomerResult {
  success: boolean
  error?: string
  customer?: Customer
}

export class UpdateCustomerUseCase {
  constructor(private readonly repo: ICustomerRepository) {}

  async execute(id: string, data: CustomerFormData): Promise<UpdateCustomerResult> {
    if (!id) {
      return { success: false, error: 'Thiếu mã khách hàng (ID).' }
    }
    
    // Validation: Tất cả các trường bắt buộc phải điền đầy đủ
    if (!data.name || !data.name.trim()) {
      return { success: false, error: 'Vui lòng nhập họ và tên khách hàng.' }
    }
    if (!data.phone || !data.phone.trim()) {
      return { success: false, error: 'Vui lòng nhập số điện thoại.' }
    }
    if (!data.taxCode || !data.taxCode.trim()) {
      return { success: false, error: 'Vui lòng nhập mã số thuế.' }
    }
    if (!data.address || !data.address.trim()) {
      return { success: false, error: 'Vui lòng nhập địa chỉ.' }
    }
    if (!data.companyName || !data.companyName.trim()) {
      return { success: false, error: 'Vui lòng nhập tên công ty.' }
    }

    try {
      const customer = await this.repo.update(id, {
        name: data.name.trim(),
        phone: data.phone.trim(),
        taxCode: data.taxCode.trim(),
        address: data.address.trim(),
        companyName: data.companyName.trim(),
      })
      return { success: true, customer }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi không xác định khi cập nhật thông tin khách hàng.'
      return { success: false, error: message }
    }
  }
}
