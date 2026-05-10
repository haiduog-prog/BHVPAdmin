import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-neon-blue)] opacity-5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10">
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-[var(--color-neon-blue)] bg-[var(--color-neon-blue)]/10 text-[var(--color-neon-blue)] text-sm font-semibold tracking-wider uppercase">
            Hệ thống quản trị v2.0
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight mb-4 text-white">
            Biển Hiệu <span className="neon-text">Văn Phong</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Giải pháp quản lý nhân sự, chấm công và điều hành công việc chuyên nghiệp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Chấm công */}
          <div className="glass-panel p-8 rounded-2xl animate-fade-up delay-100 group hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:border-[var(--color-neon-blue)]/50 transition-colors">
              <svg className="w-6 h-6 text-[var(--color-neon-blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 font-display">Chấm Công Kiosk</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Hệ thống nhận diện khuôn mặt offline-first cho thiết bị Android.
            </p>
            <Link href="/attendance" className="mt-auto block text-center w-full py-2.5 rounded-lg border border-white/10 text-white hover:neon-border hover:text-[var(--color-neon-blue)] transition-all font-medium text-sm">
              Mở Kiosk
            </Link>
          </div>

          {/* Card 2: Nhân sự */}
          <div className="glass-panel p-8 rounded-2xl animate-fade-up delay-200 group hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:border-[#ff00ea]/50 transition-colors">
              <svg className="w-6 h-6 text-[#ff00ea]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 font-display">Quản Lý Nhân Sự</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Tra cứu hồ sơ, lịch làm việc và quản lý thông tin nhân viên toàn diện.
            </p>
            <Link href="/employees" className="mt-auto block text-center w-full py-2.5 rounded-lg border border-white/10 text-white hover:border-[#ff00ea] hover:text-[#ff00ea] hover:shadow-[0_0_10px_rgba(255,0,234,0.3)] transition-all font-medium text-sm">
              Xem Danh Sách
            </Link>
          </div>

          {/* Card 3: Thống kê */}
          <div className="glass-panel p-8 rounded-2xl animate-fade-up delay-300 group hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:border-emerald-400/50 transition-colors">
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 font-display">Báo Cáo Tổng Hợp</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Xem báo cáo hiệu suất, đơn hàng và theo dõi thu chi (Tính năng đang phát triển).
            </p>
            <button className="mt-auto w-full py-2.5 rounded-lg bg-white/5 text-slate-500 cursor-not-allowed font-medium text-sm">
              Sắp ra mắt
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
