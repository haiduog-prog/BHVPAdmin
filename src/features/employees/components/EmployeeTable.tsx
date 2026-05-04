import { Employee } from '../types'
import { MoreHorizontal, User } from 'lucide-react'

interface EmployeeTableProps {
  employees: Employee[]
}

export function EmployeeTable({ employees }: EmployeeTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-200/60">
          <tr>
            <th className="px-6 py-4 font-semibold tracking-wider">Họ và tên</th>
            <th className="px-6 py-4 font-semibold tracking-wider">Chức vụ</th>
            <th className="px-6 py-4 font-semibold tracking-wider">Phòng ban</th>
            <th className="px-6 py-4 font-semibold tracking-wider">Trạng thái</th>
            <th className="px-6 py-4 font-semibold tracking-wider text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {employees.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-slate-500 bg-white/50">
                Chưa có dữ liệu nhân viên.
              </td>
            </tr>
          ) : (
            employees.map((employee) => (
              <tr key={employee.id} className="group hover:bg-slate-50/80 transition-all duration-200 bg-white/40">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-white shadow-sm group-hover:scale-105 transition-transform">
                      {employee.fullName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-slate-800">{employee.fullName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">{employee.role}</td>
                <td className="px-6 py-4 text-slate-500">{employee.department}</td>
                <td className="px-6 py-4">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    employee.isActive 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${employee.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                    {employee.isActive ? 'Đang làm việc' : 'Đã nghỉ'}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

