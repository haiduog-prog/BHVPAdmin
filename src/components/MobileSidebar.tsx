'use client'

import { useState, useEffect } from 'react'
import { LayoutDashboard, Menu, X, LogOut } from 'lucide-react'
import { SidebarNav } from './SidebarNav'
import { usePathname } from 'next/navigation'

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Đóng menu khi người dùng bấm vào 1 link
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setIsOpen(false)
  }

  // Chặn cuộn trang web khi mở menu
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Mobile Header */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6 md:hidden sticky top-0 z-20 shadow-sm">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3">
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
          <span className="text-slate-800 font-bold">Signage Mgt</span>
        </div>
        
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 -mr-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-72 bg-white/95 backdrop-blur-xl border-l border-slate-200/60 z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200/60">
          <span className="font-bold text-slate-800">Menu</span>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 -mr-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2">
          <SidebarNav />
        </div>

        <div className="p-4 border-t border-slate-200/60 bg-slate-50/50">
          <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-slate-200/50 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">Admin User</p>
              <p className="text-xs text-slate-500 truncate">admin@signage.com</p>
            </div>
            <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
