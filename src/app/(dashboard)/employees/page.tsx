import { Suspense } from 'react'
import { getEmployees } from '@/features/employees/services'
import { EmployeeTable } from '@/features/employees/components/EmployeeTable'
import { AddEmployeeModal } from '@/features/employees/components/AddEmployeeModal'
import { Users } from 'lucide-react'

export const metadata = {
  title: 'Danh sách nhân viên | Quản lý Biển hiệu',
}

export default async function EmployeesPage() {
  let employees = []
  
  try {
      employees = await getEmployees()
  } catch (error) {
      console.error("Lỗi khi lấy danh sách nhân viên:", error)
  }

  return (
    <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 relative z-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Nhân viên</h1>
          <p className="text-slate-500 mt-2 text-base">Quản lý danh sách và thông tin nhân sự công ty.</p>
        </div>
        <div className="flex-shrink-0">
          <AddEmployeeModal />
        </div>
      </header>

      <section className="bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100/80 bg-white/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 rounded-lg">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Danh sách nhân viên</h2>
              <p className="text-sm text-slate-500 font-medium">Toàn bộ nhân sự công ty</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <Suspense fallback={<div className="h-64 bg-slate-100/50 rounded-xl animate-pulse" />}>
            <EmployeeTable employees={employees} />
          </Suspense>
        </div>
      </section>
    </main>
  )
}
