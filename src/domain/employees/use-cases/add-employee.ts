// ─── Use Case: Thêm nhân viên mới ──────────────────────────────────

import { Employee, EmployeeFormData } from '../entity'
import { IEmployeeRepository } from '../repository'

export interface AddEmployeeResult {
  success: boolean
  error?: string
  employee?: Employee
}

export class AddEmployeeUseCase {
  constructor(private readonly repo: IEmployeeRepository) {}

  async execute(data: EmployeeFormData): Promise<AddEmployeeResult> {
    // Validation — business rule thuộc domain
    if (!data.name || !data.name.trim()) {
      return { success: false, error: 'Vui lòng nhập họ và tên.' }
    }
    if (!data.role || !data.role.trim()) {
      return { success: false, error: 'Vui lòng nhập chức vụ.' }
    }
    if (!data.department || !data.department.trim()) {
      return { success: false, error: 'Vui lòng chọn phòng ban.' }
    }

    try {
      const employee = await this.repo.create({
        name: data.name.trim(),
        role: data.role.trim(),
        department: data.department.trim(),
      })
      return { success: true, employee }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi không xác định khi thêm nhân viên.'
      return { success: false, error: message }
    }
  }
}
