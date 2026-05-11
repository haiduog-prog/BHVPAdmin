// ─── Dependency Injection Container ────────────────────────────────
// Tập trung wiring: Repository → Use Case
// Nếu cần swap Supabase → Prisma/Firebase, chỉ sửa file này.

import { SupabaseEmployeeRepository } from '@/data/employees/supabase-employee.repository'
import { SupabaseAttendanceRepository } from '@/data/attendance/supabase-attendance.repository'
import { SupabasePayrollRepository } from '@/data/payroll/supabase-payroll.repository'

import { GetEmployeesUseCase } from '@/domain/employees/use-cases/get-employees'
import { AddEmployeeUseCase } from '@/domain/employees/use-cases/add-employee'
import { GetDailyTimesheetUseCase } from '@/domain/attendance/use-cases/get-daily-timesheet'
import { GetMonthlyAttendanceUseCase } from '@/domain/payroll/use-cases/get-monthly-attendance'
import { CalculateSalaryUseCase } from '@/domain/payroll/use-cases/calculate-salary'

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
} as const
