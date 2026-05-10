import { LayoutDashboard, LogOut } from 'lucide-react'
import { SidebarNav } from '@/components/SidebarNav'
import { MobileSidebar } from '@/components/MobileSidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Premium Sidebar (Desktop) */}
      <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 hidden md:flex flex-col sticky top-0 h-screen shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 tracking-tight">Signage Mgt</h2>
          </div>
        </div>
        
        <SidebarNav />

        <div className="p-4 mt-auto">
          <div className="bg-slate-100/50 rounded-2xl p-4 flex items-center gap-3 border border-slate-200/50">
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
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Sidebar & Header */}
        <MobileSidebar />
        
        {/* Page Content */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] pointer-events-none mix-blend-overlay"></div>
          {children}
        </div>
      </div>
    </div>
  )
}
