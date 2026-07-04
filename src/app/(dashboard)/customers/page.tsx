import { Suspense } from 'react'
import { container } from '@/di/container'
import { CustomerTable } from '@/features/customers/components/CustomerTable'
import { AddCustomerModal } from '@/features/customers/components/AddCustomerModal'
import { Briefcase } from 'lucide-react'
import { Customer } from '@/domain/customers/entity'

export const metadata = {
  title: 'Danh sách khách hàng | Quản lý Biển hiệu',
}

// Next.js: force dynamic rendering because we want to fetch the latest customer data
export const dynamic = 'force-dynamic'

export default async function CustomersPage() {
  let customers: Customer[] = []
  
  try {
    const useCase = container.getCustomersUseCase()
    customers = await useCase.execute()
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khách hàng:", error)
  }

  return (
    <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 relative z-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Khách hàng</h1>
          <p className="text-slate-500 mt-2 text-base">Quản lý thông tin khách hàng công ty phục vụ cho các đơn hàng.</p>
        </div>
        <div className="flex-shrink-0">
          <AddCustomerModal />
        </div>
      </header>

      <section className="bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100/80 bg-white/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 rounded-lg">
              <Briefcase className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Danh sách khách hàng</h2>
              <p className="text-sm text-slate-500 font-medium">Toàn bộ khách hàng trong hệ thống</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <Suspense fallback={<div className="h-64 bg-slate-100/50 rounded-xl animate-pulse" />}>
            <CustomerTable customers={customers} />
          </Suspense>
        </div>
      </section>
    </main>
  )
}
