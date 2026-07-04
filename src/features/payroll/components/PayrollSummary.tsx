'use client'

import { MonthlyAttendance, PayrollConfig } from '@/domain/payroll/entity'
import { CalculateSalaryUseCase } from '@/domain/payroll/use-cases/calculate-salary'
import { CalendarCheck, Clock, Banknote, TrendingUp } from 'lucide-react'

interface PayrollSummaryProps {
  attendance: MonthlyAttendance
  config: PayrollConfig
}

const calculateSalary = new CalculateSalaryUseCase()

export function PayrollSummary({ attendance, config }: PayrollSummaryProps) {
  const totalHours = Math.floor(attendance.totalMinutes / 60)
  const totalRemainingMins = attendance.totalMinutes % 60

  // Tính lương qua Use Case — logic nằm trong domain layer
  const { salary, label: salaryLabel } = calculateSalary.execute(attendance, config)

  const cards = [
    {
      title: 'Số ngày đi làm',
      value: `${attendance.totalWorkDays} ngày`,
      icon: CalendarCheck,
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      iconColor: 'text-emerald-500',
    },
    {
      title: 'Tổng giờ làm',
      value: totalHours > 0 ? `${totalHours}h ${totalRemainingMins}m` : `${totalRemainingMins}m`,
      icon: Clock,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      iconColor: 'text-indigo-500',
    },
    {
      title: 'Công thức tính',
      value: salaryLabel,
      icon: TrendingUp,
      color: 'amber',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      iconColor: 'text-amber-500',
    },
    {
      title: 'Lương ước tính',
      value: `${salary.toLocaleString('vi-VN')} ₫`,
      icon: Banknote,
      color: 'rose',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-purple-50',
      textColor: 'text-indigo-700',
      iconColor: 'text-indigo-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className={`${card.bgColor} rounded-xl p-4 border border-slate-100/60`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.title}</span>
              <Icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
            <p className={`text-xl font-bold ${card.textColor}`}>{card.value}</p>
          </div>
        )
      })}
    </div>
  )
}
