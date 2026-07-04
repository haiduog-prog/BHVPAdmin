// ─── Use Case: Lấy danh sách khách hàng ──────────────────────────────

import { Customer } from '../entity'
import { ICustomerRepository } from '../repository'

export class GetCustomersUseCase {
  constructor(private readonly repo: ICustomerRepository) {}

  async execute(): Promise<Customer[]> {
    return this.repo.findAll()
  }
}
