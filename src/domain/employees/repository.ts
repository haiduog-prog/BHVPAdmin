// ─── Repository Interface: Employee ────────────────────────────────
// Định nghĩa contract cho data access — implementation ở tầng Data

import { Employee, EmployeeFormData } from './entity'

export interface IEmployeeRepository {
  /** Lấy danh sách toàn bộ nhân viên */
  findAll(): Promise<Employee[]>

  /** Thêm nhân viên mới, trả về employee đã tạo */
  create(data: EmployeeFormData): Promise<Employee>
}
