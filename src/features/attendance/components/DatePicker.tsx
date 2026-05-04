'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

export function DatePicker({ currentDate }: { currentDate: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const changeDate = (newDate: string) => {
    router.push(`/attendance?date=${newDate}`)
  }

  // Chuyển sang ngày trước / ngày sau
  const shiftDay = (offset: number) => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + offset)
    changeDate(d.toISOString().split('T')[0])
  }

  // Kiểm tra xem có phải hôm nay không
  const today = new Date().toISOString().split('T')[0]
  const isToday = currentDate === today

  // Format ngày hiển thị dạng "Thứ X, DD/MM/YYYY"
  const displayDate = new Date(currentDate).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  return (
    <div className="flex items-center gap-2">
      {/* Nút lùi ngày */}
      <button
        onClick={() => shiftDay(-1)}
        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        title="Ngày trước"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Khung chọn ngày */}
      <div className="bg-white/80 backdrop-blur border border-slate-200/60 shadow-sm px-4 py-2 rounded-xl flex items-center gap-3 relative">
        <CalendarDays className="w-5 h-5 text-indigo-500" />
        <input
          type="date"
          value={currentDate}
          max={today}
          onChange={(e) => changeDate(e.target.value)}
          className="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer text-sm [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
        />
      </div>

      {/* Nút tiến ngày */}
      <button
        onClick={() => shiftDay(1)}
        disabled={isToday}
        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        title="Ngày sau"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Nút "Hôm nay" nhanh */}
      {!isToday && (
        <button
          onClick={() => changeDate(today)}
          className="ml-1 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
        >
          Hôm nay
        </button>
      )}
    </div>
  )
}
