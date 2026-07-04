// ─── Dependency Injection Container ────────────────────────────────
// Tập trung wiring: Repository → Use Case
// Nếu cần swap Supabase → Prisma/Firebase, chỉ sửa file này.

import { SupabaseEmployeeRepository } from '@/data/employees/supabase-employee.repository'
import { SupabaseAttendanceRepository } from '@/data/attendance/supabase-attendance.repository'
import { SupabasePayrollRepository } from '@/data/payroll/supabase-payroll.repository'
import { SupabaseCustomerRepository } from '@/data/customers/supabase-customer.repository'

import { GetEmployeesUseCase } from '@/domain/employees/use-cases/get-employees'
import { AddEmployeeUseCase } from '@/domain/employees/use-cases/add-employee'
import { GetDailyTimesheetUseCase } from '@/domain/attendance/use-cases/get-daily-timesheet'
import { GetMonthlyAttendanceUseCase } from '@/domain/payroll/use-cases/get-monthly-attendance'
import { CalculateSalaryUseCase } from '@/domain/payroll/use-cases/calculate-salary'
import { GetCustomersUseCase } from '@/domain/customers/use-cases/get-customers'
import { AddCustomerUseCase } from '@/domain/customers/use-cases/add-customer'
import { UpdateCustomerUseCase } from '@/domain/customers/use-cases/update-customer'
import { DeleteCustomerUseCase } from '@/domain/customers/use-cases/delete-customer'

// ─── Factory Functions ──────────────────────────────────────────────

function createEmployeeRepository() {
  return new SupabaseEmployeeRepository()
}

function createAttendanceRepository() {
  return new SupabaseAttendanceRepository()
}

function createPayrollRepository() {
  return new SupabasePayrollRepository()
}

function createCustomerRepository() {
  return new SupabaseCustomerRepository()
}

// ─── Use Case Factories ─────────────────────────────────────────────

export const container = {
  // Employees
  getEmployeesUseCase: () => new GetEmployeesUseCase(createEmployeeRepository()),
  addEmployeeUseCase: () => new AddEmployeeUseCase(createEmployeeRepository()),

  // Attendance
  getDailyTimesheetUseCase: () => new GetDailyTimesheetUseCase(createAttendanceRepository()),

  // Payroll
  getMonthlyAttendanceUseCase: () => new GetMonthlyAttendanceUseCase(createPayrollRepository()),
  calculateSalaryUseCase: () => new CalculateSalaryUseCase(),

  // Customers
  getCustomersUseCase: () => new GetCustomersUseCase(createCustomerRepository()),
  addCustomerUseCase: () => new AddCustomerUseCase(createCustomerRepository()),
  updateCustomerUseCase: () => new UpdateCustomerUseCase(createCustomerRepository()),
  deleteCustomerUseCase: () => new DeleteCustomerUseCase(createCustomerRepository()),
} as const
