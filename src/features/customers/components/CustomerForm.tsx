'use client'

// ─── Component: Customer Form ────────────────────────────────────────

import { useState } from 'react'
import { CustomerFormData } from '@/domain/customers/entity'

interface CustomerFormProps {
  initialData?: CustomerFormData
  onSubmit: (data: CustomerFormData) => Promise<void>
  onCancel: () => void
  isPending: boolean
  error: string | null
  submitLabel: string
}

export function CustomerForm({
  initialData,
  onSubmit,
  onCancel,
  isPending,
  error,
  submitLabel
}: CustomerFormProps) {
  const [formData, setFormData] = useState<CustomerFormData>({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    taxCode: initialData?.taxCode || '',
    address: initialData?.address || '',
    companyName: initialData?.companyName || ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">
          Họ và tên khách hàng
        </label>
        <input 
          type="text" 
          name="name" 
          id="name" 
          required 
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="Nhập họ và tên khách hàng..."
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1">
          Số điện thoại
        </label>
        <input 
          type="tel" 
          name="phone" 
          id="phone" 
          required 
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="Nhập số điện thoại..."
        />
      </div>

      <div>
        <label htmlFor="taxCode" className="block text-sm font-semibold text-slate-700 mb-1">
          Mã số thuế
        </label>
        <input 
          type="text" 
          name="taxCode" 
          id="taxCode" 
          required 
          value={formData.taxCode}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="Nhập mã số thuế..."
        />
      </div>

      <div>
        <label htmlFor="companyName" className="block text-sm font-semibold text-slate-700 mb-1">
          Tên công ty
        </label>
        <input 
          type="text" 
          name="companyName" 
          id="companyName" 
          required 
          value={formData.companyName}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="Nhập tên công ty đầy đủ..."
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-semibold text-slate-700 mb-1">
          Địa chỉ
        </label>
        <input 
          type="text" 
          name="address" 
          id="address" 
          required 
          value={formData.address}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="Nhập địa chỉ nhận hàng/công ty..."
        />
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
          {isPending ? 'Đang xử lý...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
