// ─── Repository Interface: Customer ─────────────────────────────────

import { Customer, CustomerFormData } from './entity'

export interface ICustomerRepository {
  /** Lấy danh sách toàn bộ khách hàng */
  findAll(): Promise<Customer[]>

  /** Thêm khách hàng mới, trả về khách hàng đã tạo */
  create(data: CustomerFormData): Promise<Customer>

  /** Cập nhật thông tin khách hàng */
  update(id: string, data: CustomerFormData): Promise<Customer>

  /** Xoá khách hàng */
  delete(id: string): Promise<void>
}
