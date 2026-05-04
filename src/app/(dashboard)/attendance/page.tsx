import { Suspense } from 'react'
import { calculateDailyTimesheet } from '@/features/attendance/actions'
import { DailyTimesheet } from '@/features/attendance/components/DailyTimesheet'
import { DatePicker } from '@/features/attendance/components/DatePicker'
import { CalendarDays } from 'lucide-react'

export const metadata = {
  title: 'Bảng chấm công | Quản lý Biển hiệu',
}

interface AttendancePageProps {
  searchParams: Promise<{ date?: string }>
}

export default async function AttendancePage({ searchParams }: AttendancePageProps) {
  const params = await searchParams
  const todayDate = new Date().toISOString().split('T')[0]
  const selectedDate = params.date || todayDate

  let timesheetRecords = []
  
  try {
      timesheetRecords = await calculateDailyTimesheet(selectedDate)
  } catch (error) {
      console.error("Lỗi khi lấy dữ liệu chấm công:", error)
  }

  return (
    <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 relative z-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Chấm công</h1>
          <p className="text-slate-500 mt-2 text-base">
            Kiểm tra lịch sử vào ra và thời gian làm việc.
          </p>
        </div>
        <Suspense fallback={
          <div className="bg-white/80 backdrop-blur border border-slate-200/60 shadow-sm px-4 py-2 rounded-xl flex items-center gap-3">
            <CalendarDays className="w-5 h-5 text-indigo-500" />
            <span className="font-semibold text-slate-700">{selectedDate}</span>
          </div>
        }>
          <DatePicker currentDate={selectedDate} />
        </Suspense>
      </header>

      <section className="bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100/80 bg-white/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 rounded-lg">
              <CalendarDays className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Bảng chấm công ngày</h2>
              <p className="text-sm text-slate-500 font-medium">Lịch sử quẹt thẻ thiết bị</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <Suspense fallback={<div className="h-48 bg-slate-100/50 rounded-xl animate-pulse" />}>
            <DailyTimesheet records={timesheetRecords} />
          </Suspense>
        </div>
      </section>
    </main>
  )
}
