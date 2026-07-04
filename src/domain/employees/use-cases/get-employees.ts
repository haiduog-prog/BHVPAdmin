// ─── Use Case: Lấy danh sách nhân viên ─────────────────────────────

import { Employee } from '../entity'
import { IEmployeeRepository } from '../repository'

export class GetEmployeesUseCase {
  constructor(private readonly repo: IEmployeeRepository) {}

  async execute(): Promise<Employee[]> {
    return this.repo.findAll()
  }
}
