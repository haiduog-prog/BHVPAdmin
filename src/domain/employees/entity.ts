// ─── Domain Entity: Employee ───────────────────────────────────────
// Pure domain model — không phụ thuộc vào bất kỳ framework/DB nào

export interface Employee {
  id: string
  fullName: string
  role: string
  department: string
  isActive: boolean
  createdAt: string
}

export interface EmployeeFormData {
  name: string
  role: string
  department: string
}
