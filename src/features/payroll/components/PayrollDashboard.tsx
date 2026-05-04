'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, Clock, CalendarDays } from 'lucide-react'
import { MonthlyAttendance, PayrollConfig, SalaryType } from '../types'
import { Employee } from '@/features/employees/types'
import { MonthCalendar } from './MonthCalendar'
import { PayrollSummary } from './PayrollSummary'

interface PayrollDashboardProps {
  employees: Employee[]
  attendance: MonthlyAttendance | null
  selectedEmployeeId: string
  year: number
  month: number
}

export function PayrollDashboard({
  employees,
  attendance,
  selectedEmployeeId,
  year,
  month,
}: PayrollDashboardProps) {
  const router = useRouter()

  // Config lương (state local, quản lý tự nhập)
  const [config, setConfig] = useState<PayrollConfig>({
    salaryType: 'daily',
    dailyRate: 300000,
    hourlyRate: 40000,
  })

  // Chuyển tháng
  const navigateMonth = (offset: number) => {
    let newMonth = month + offset
    let newYear = year
    if (newMonth > 12) { newMonth = 1; newYear++ }
    if (newMonth < 1) { newMonth = 12; newYear-- }
    router.push(`/payroll?employee=${selectedEmployeeId}&year=${newYear}&month=${newMonth}`)
  }

  // Chọn nhân viên
  const selectEmployee = (empId: string) => {
    router.push(`/payroll?employee=${empId}&year=${year}&month=${month}`)
  }

  // Tên tháng tiếng Việt
  const monthName = `Tháng ${month} / ${year}`

  return (
    <div className="space-y-6">
      {/* Thanh điều khiển */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/50 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
          {/* Chọn nhân viên */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Chọn nhân viên</label>
            <select
              value={selectedEmployeeId}
              onChange={(e) => selectEmployee(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            >
              <option value="">-- Chọn nhân viên --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.fullName} — {emp.role}</option>
              ))}
            </select>
          </div>

          {/* Loại tính lương */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Loại tính lương</label>
            <div className="flex rounded-xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setConfig(c => ({ ...c, salaryType: 'daily' }))}
                className={`px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 ${
                  config.salaryType === 'daily'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                Theo ngày
              </button>
              <button
                onClick={() => setConfig(c => ({ ...c, salaryType: 'hourly' }))}
                className={`px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 ${
                  config.salaryType === 'hourly'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Clock className="w-4 h-4" />
                Theo giờ
              </button>
            </div>
          </div>

          {/* Đơn giá */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {config.salaryType === 'daily' ? 'Đơn giá / ngày' : 'Đơn giá / giờ'}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={(config.salaryType === 'daily' ? config.dailyRate : config.hourlyRate).toLocaleString('vi-VN')}
                onChange={(e) => {
                  // Loại bỏ ký tự không phải số, chuyển về number
                  const raw = e.target.value.replace(/\D/g, '')
                  const val = Number(raw) || 0
                  if (config.salaryType === 'daily') {
                    setConfig(c => ({ ...c, dailyRate: val }))
                  } else {
                    setConfig(c => ({ ...c, hourlyRate: val }))
                  }
                }}
                className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors tabular-nums text-right"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">₫</span>
            </div>
          </div>

          {/* Điều hướng tháng */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Tháng</label>
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl min-w-[140px] text-center">
                {monthName}
              </div>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      {!selectedEmployeeId ? (
        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/50 shadow-sm p-12 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <CalendarDays className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Chọn nhân viên để bắt đầu</h3>
            <p className="text-slate-500 text-sm">Vui lòng chọn nhân viên ở thanh công cụ phía trên để xem lịch chấm công và tính lương.</p>
          </div>
        </div>
      ) : attendance ? (
        <div className="space-y-6">
          {/* Tổng kết lương */}
          <PayrollSummary attendance={attendance} config={config} />

          {/* Lịch tháng */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/50 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Lịch chấm công — {attendance.employeeName}
            </h3>
            <MonthCalendar
              year={year}
              month={month}
              workDays={attendance.workDays}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/50 shadow-sm p-12 text-center">
          <p className="text-slate-500">Không có dữ liệu chấm công cho nhân viên này trong tháng {month}/{year}.</p>
        </div>
      )}
    </div>
  )
}
