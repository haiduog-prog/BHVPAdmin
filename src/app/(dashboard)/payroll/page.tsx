import { Suspense } from 'react'
import { getEmployees } from '@/features/employees/services'
import { getMonthlyAttendance } from '@/features/payroll/services'
import { PayrollDashboard } from '@/features/payroll/components/PayrollDashboard'
import { Banknote } from 'lucide-react'

export const metadata = {
  title: 'Bảng lương | Quản lý Biển hiệu',
}

interface PayrollPageProps {
  searchParams: Promise<{ employee?: string; year?: string; month?: string }>
}

export default async function PayrollPage({ searchParams }: PayrollPageProps) {
  const params = await searchParams
  const now = new Date()
  const year = params.year ? parseInt(params.year) : now.getFullYear()
  const month = params.month ? parseInt(params.month) : now.getMonth() + 1
  const selectedEmployeeId = params.employee || ''

  // Lấy danh sách nhân viên
  const employees = await getEmployees()

  // Lấy chấm công tháng (nếu đã chọn nhân viên)
  let attendance = null
  if (selectedEmployeeId) {
    try {
      attendance = await getMonthlyAttendance(selectedEmployeeId, year, month)
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu chấm công tháng:', error)
    }
  }

  return (
    <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 relative z-10">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-indigo-100 rounded-xl">
            <Banknote className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Bảng lương</h1>
          </div>
        </div>
        <p className="text-slate-500 text-base ml-14">Xem lịch chấm công tháng, tính ngày công và lương ước tính cho nhân viên.</p>
      </header>

      <Suspense fallback={<div className="h-96 bg-slate-100/50 rounded-2xl animate-pulse" />}>
        <PayrollDashboard
          employees={employees}
          attendance={attendance}
          selectedEmployeeId={selectedEmployeeId}
          year={year}
          month={month}
        />
      </Suspense>
    </main>
  )
}
