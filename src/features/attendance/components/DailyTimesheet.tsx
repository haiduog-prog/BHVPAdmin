'use client'

import { useState, Fragment } from 'react'
import { DailyTimesheetRecord } from '../types'
import { Clock, ChevronDown, ChevronUp, ScanFace, ArrowRightLeft } from 'lucide-react'

interface DailyTimesheetProps {
  records: DailyTimesheetRecord[]
}

export function DailyTimesheet({ records }: DailyTimesheetProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const formatTime = (isoString: string | null) => {
    if (!isoString) return '--:--'
    return new Date(isoString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  // Định dạng phút thành Xh Ym
  const formatDuration = (totalMinutes: number) => {
    if (totalMinutes <= 0) return '-'
    const hours = Math.floor(totalMinutes / 60)
    const mins = totalMinutes % 60
    if (hours === 0) return `${mins}m`
    return `${hours}h ${mins}m`
  }

  const toggleExpand = (employeeId: string) => {
    setExpandedRow(prev => prev === employeeId ? null : employeeId)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-200/60">
          <tr>
            <th className="px-6 py-4 font-semibold tracking-wider">Nhân viên</th>
            <th className="px-6 py-4 font-semibold tracking-wider">Giờ vào (Đầu tiên)</th>
            <th className="px-6 py-4 font-semibold tracking-wider">Giờ ra (Cuối cùng)</th>
            <th className="px-6 py-4 font-semibold tracking-wider">Tổng thời gian</th>
            <th className="px-6 py-4 font-semibold tracking-wider">Số lần quét</th>
            <th className="px-6 py-4 font-semibold tracking-wider text-right">Chi tiết</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {records.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-slate-500 bg-white/50">
                <div className="flex flex-col items-center justify-center">
                  <div className="p-3 bg-slate-100 rounded-full mb-3">
                    <Clock className="w-6 h-6 text-slate-400" />
                  </div>
                  <p>Không có dữ liệu chấm công ngày hôm nay.</p>
                </div>
              </td>
            </tr>
          ) : (
            records.map((record) => {
              const isExpanded = expandedRow === record.employeeId
              return (
                <Fragment key={record.employeeId}>
                  <tr className="group">
                    {/* Row chính */}
                    <td className="px-6 py-4 bg-white/40 group-hover:bg-slate-50/80 transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold border border-white shadow-sm group-hover:scale-105 transition-transform">
                        {record.fullName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-800">{record.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium bg-white/40 group-hover:bg-slate-50/80 transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${record.firstCheckIn ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                      {formatTime(record.firstCheckIn)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium bg-white/40 group-hover:bg-slate-50/80 transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${record.lastCheckOut ? 'bg-rose-500' : 'bg-slate-300'}`}></div>
                      {formatTime(record.lastCheckOut)}
                    </div>
                  </td>
                  <td className="px-6 py-4 bg-white/40 group-hover:bg-slate-50/80 transition-all duration-200">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-bold ${
                      record.totalMinutes > 0 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      <Clock className="w-4 h-4" />
                      {formatDuration(record.totalMinutes)}
                    </div>
                  </td>
                  <td className="px-6 py-4 bg-white/40 group-hover:bg-slate-50/80 transition-all duration-200">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium bg-indigo-50 text-indigo-700">
                      <ScanFace className="w-4 h-4" />
                      {record.scanLogs.length} lần
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right bg-white/40 group-hover:bg-slate-50/80 transition-all duration-200">
                    <button 
                      onClick={() => toggleExpand(record.employeeId)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isExpanded 
                          ? 'text-indigo-600 bg-indigo-50' 
                          : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </td>
                </tr>
                {isExpanded && (
                  <tr key={`detail-${record.employeeId}`}>
                    <td colSpan={6} className="p-0 border-b border-slate-200/60">
                      <div className="bg-slate-50/80 p-6 animate-in slide-in-from-top-2 duration-200 shadow-inner">
                        <div className="max-w-2xl">
                          <div className="flex items-center gap-2 mb-4">
                            <ArrowRightLeft className="w-4 h-4 text-indigo-500" />
                            <h4 className="font-semibold text-slate-800">
                              Lịch sử quét mặt của {record.fullName}
                            </h4>
                            <span className="text-xs text-slate-500 ml-auto bg-white px-2.5 py-1 rounded-full shadow-sm border border-slate-100">
                              Tổng: {record.scanLogs.length} lần quét
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {record.scanLogs.map((log, idx) => (
                              <div key={log.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                  {idx + 1}
                                </div>
                                <div className="flex-1">
                                  <span className="font-medium text-slate-800">
                                    {new Date(log.scanTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                                  </span>
                                </div>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                  log.status === 'IN' 
                                    ? 'bg-indigo-100 text-indigo-700' 
                                    : 'bg-rose-100 text-rose-700'
                                }`}>
                                  {log.status === 'IN' ? '⬇ Vào' : '⬆ Ra'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })
          )}
        </tbody>
      </table>


    </div>
  )
}
