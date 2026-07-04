// ─── Use Case: Thêm khách hàng mới ──────────────────────────────────

import { Customer, CustomerFormData } from '../entity'
import { ICustomerRepository } from '../repository'

export interface AddCustomerResult {
  success: boolean
  error?: string
  customer?: Customer
}

export class AddCustomerUseCase {
  constructor(private readonly repo: ICustomerRepository) {}

  async execute(data: CustomerFormData): Promise<AddCustomerResult> {
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
      const customer = await this.repo.create({
        name: data.name.trim(),
        phone: data.phone.trim(),
        taxCode: data.taxCode.trim(),
        address: data.address.trim(),
        companyName: data.companyName.trim(),
      })
      return { success: true, customer }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi không xác định khi thêm khách hàng.'
      return { success: false, error: message }
    }
  }
}
