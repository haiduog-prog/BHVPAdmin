'use client'

import { Users, CreditCard, ShoppingBag, CalendarDays, Banknote, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function SidebarNav() {
  const pathname = usePathname()

  const links = [
    {
      name: 'Nhân viên',
      href: '/employees',
      icon: Users,
    },
    {
      name: 'Chấm công',
      href: '/attendance',
      icon: CalendarDays,
    },
    {
      name: 'Bảng lương',
      href: '/payroll',
      icon: Banknote,
    },
    {
      name: 'Khách hàng',
      href: '/customers',
      icon: Briefcase,
    },
    {
      name: 'Đơn hàng',
      href: '#',
      icon: ShoppingBag,
    },
    {
      name: 'Thu chi',
      href: '#',
      icon: CreditCard,
    },
  ]

  return (
    <nav className="mt-4 px-4 flex-1 space-y-1.5">
      <div className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 mt-4">
        Quản lý
      </div>
      {links.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
        const Icon = link.icon

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
              isActive
                ? 'text-indigo-700 bg-indigo-50/80'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Icon
              className={`w-5 h-5 transition-transform ${
                isActive
                  ? 'text-indigo-600 group-hover:scale-110'
                  : 'text-slate-400 group-hover:text-slate-600'
              }`}
            />
            {link.name}
          </Link>
        )
      })}
    </nav>
  )
}
