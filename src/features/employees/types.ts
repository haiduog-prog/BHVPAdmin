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
