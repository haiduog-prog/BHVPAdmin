'use client'

import { useState, useTransition } from 'react'
import { addEmployee } from '../actions'

export function EmployeeForm({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await addEmployee(formData)
      if (result.error) {
        setError(result.error)
      } else {
        onSuccess()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Họ và tên</label>
        <input 
          type="text" 
          name="name" 
          id="name" 
          required 
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="Nhập họ và tên..."
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">Chức vụ / Vị trí</label>
        <input 
          type="text" 
          name="role" 
          id="role" 
          required 
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="VD: Thợ chính, Thiết kế..."
        />
      </div>

      <div>
        <label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-1">Phòng ban</label>
        <select 
          name="department" 
          id="department" 
          required 
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        >
          <option value="">Chọn phòng ban</option>
          <option value="Kinh doanh">Kinh doanh</option>
          <option value="Thiết kế">Thiết kế</option>
          <option value="Thi công">Thi công</option>
          <option value="Kế toán">Kế toán</option>
          <option value="Khác">Khác</option>
        </select>
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
        <button 
          type="button" 
          onClick={onCancel}
          disabled={isPending}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50"
        >
          Hủy
        </button>
        <button 
          type="submit" 
          disabled={isPending}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isPending ? 'Đang lưu...' : 'Lưu nhân viên'}
        </button>
      </div>
    </form>
  )
}
