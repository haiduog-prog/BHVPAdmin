'use client'

import { useState } from 'react'
import { WorkDay } from '../types'
import { Clock, X, ScanFace } from 'lucide-react'

interface MonthCalendarProps {
  year: number
  month: number
  workDays: WorkDay[]
}

export function MonthCalendar({ year, month, workDays }: MonthCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<WorkDay | null>(null)

  const workDayMap = new Map<string, WorkDay>()
  workDays.forEach(wd => workDayMap.set(wd.date, wd))

  const daysInMonth = new Date(year, month, 0).getDate()
  let startDow = (new Date(year, month - 1, 1).getDay() + 6) % 7

  const dayHeaders = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
  const today = new Date().toISOString().split('T')[0]

  const formatTime = (iso: string | null) => {
    if (!iso) return '--:--'
    return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  const formatDuration = (mins: number) => {
    if (mins <= 0) return '0m'
    const h = Math.floor(mins / 60)
    const m = mins % 60
    if (h === 0) return `${m}m`
    return `${h}h${m > 0 ? m + 'm' : ''}`
  }

  const cells: (number | null)[] = []
  for (let i = 0; i < startDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="grid grid-cols-7 gap-1.5">
        {dayHeaders.map((dh, i) => (
          <div key={dh} className={`text-center text-[10px] font-bold uppercase tracking-widest py-1.5 ${i >= 5 ? 'text-rose-400' : 'text-slate-400'}`}>
            {dh}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`e-${idx}`} className="h-[72px]" />

          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const wd = workDayMap.get(dateStr)
          const isToday = dateStr === today
          const isWeekend = idx % 7 >= 5
          const isSelected = selectedDay?.date === dateStr
          const isFuture = dateStr > today

          return (
            <button
              key={dateStr}
              onClick={() => wd && setSelectedDay(isSelected ? null : wd)}
              disabled={!wd}
              className={`h-[72px] rounded-xl px-1.5 py-1 flex flex-col items-center justify-start transition-all duration-200 relative overflow-hidden
                ${wd
                  ? isSelected
                    ? 'bg-gradient-to-b from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-200/50 scale-[1.03] z-10'
                    : 'bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100 hover:shadow-sm cursor-pointer border border-emerald-200/50'
                  : isFuture
                    ? 'bg-slate-50/40 text-slate-300 border border-dashed border-slate-200/30'
                    : isWeekend
                      ? 'bg-rose-50/30 text-rose-300 border border-rose-100/20'
                      : 'bg-slate-50/60 text-slate-350 border border-slate-100/40'
                }
                ${isToday && !isSelected ? 'ring-2 ring-indigo-400 ring-offset-1' : ''}
              `}
            >
              {/* Ngày */}
              <span className={`text-xs leading-none font-bold ${isSelected ? 'text-white' : ''}`}>{day}</span>

              {wd ? (
                <>
                  {/* Giờ vào */}
                  <span className={`text-[9px] leading-tight mt-1 font-semibold ${isSelected ? 'text-emerald-100' : 'text-indigo-500'}`}>
                    ↓{formatTime(wd.firstCheckIn)}
                  </span>
                  {/* Giờ ra */}
                  <span className={`text-[9px] leading-tight font-semibold ${isSelected ? 'text-emerald-100' : 'text-rose-400'}`}>
                    ↑{formatTime(wd.lastCheckOut)}
                  </span>
                  {/* Tổng */}
                  <span className={`text-[8px] leading-none mt-0.5 font-bold ${isSelected ? 'text-white/70' : 'text-emerald-500/70'}`}>
                    {formatDuration(wd.totalMinutes)}
                  </span>
                </>
              ) : (
                <span className="text-[8px] mt-2 text-slate-300">—</span>
              )}

              {/* Hôm nay badge */}
              {isToday && !isSelected && (
                <div className="absolute bottom-0 left-0 right-0 text-center text-[7px] font-bold text-indigo-500 bg-indigo-50 py-px">nay</div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded bg-emerald-50 border border-emerald-200/50" />
          <span className="text-[10px] text-slate-500">Đi làm</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded bg-slate-50 border border-slate-200/50" />
          <span className="text-[10px] text-slate-500">Nghỉ</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded bg-rose-50/50 border border-rose-100/50" />
          <span className="text-[10px] text-slate-500">Cuối tuần</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded ring-2 ring-indigo-400 ring-offset-1" />
          <span className="text-[10px] text-slate-500">Hôm nay</span>
        </div>
      </div>

      {/* Chi tiết ngày */}
      {selectedDay && (
        <div className="bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 text-white" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">
                  {new Date(selectedDay.date).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
                </h4>
              </div>
              <button onClick={() => setSelectedDay(null)} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-3 bg-white rounded-lg border border-indigo-100/60">
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Giờ vào</p>
                <p className="text-base font-extrabold text-indigo-700 tabular-nums mt-0.5">{formatTime(selectedDay.firstCheckIn)}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-rose-100/60">
                <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">Giờ ra</p>
                <p className="text-base font-extrabold text-rose-700 tabular-nums mt-0.5">{formatTime(selectedDay.lastCheckOut)}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-emerald-100/60">
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Thời gian</p>
                <p className="text-base font-extrabold text-emerald-700 mt-0.5">{formatDuration(selectedDay.totalMinutes)}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-purple-100/60 relative">
                <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Lần quét</p>
                <p className="text-base font-extrabold text-purple-700 mt-0.5">{selectedDay.scanCount}</p>
                <ScanFace className="w-4 h-4 text-purple-200 absolute bottom-2.5 right-2.5" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
