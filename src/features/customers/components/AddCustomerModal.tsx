'use client'

// ─── Component: Add Customer Modal ──────────────────────────────────

import { useState, useTransition } from 'react'
import { Plus, X } from 'lucide-react'
import { CustomerForm } from './CustomerForm'
import { addCustomer } from '../actions'
import { CustomerFormData } from '@/domain/customers/entity'

export function AddCustomerModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: CustomerFormData) => {
    setError(null)
    startTransition(async () => {
      const result = await addCustomer(data)
      if (result.error) {
        setError(result.error)
      } else {
        setIsOpen(false)
      }
    })
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-indigo-200"
      >
        <Plus className="w-4 h-4" />
        Thêm khách hàng
      </button>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Content */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-800">Thêm khách hàng mới</h3>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <CustomerForm 
            onSubmit={handleSubmit} 
            onCancel={() => setIsOpen(false)} 
            isPending={isPending}
            error={error}
            submitLabel="Lưu khách hàng"
          />
        </div>
      </div>
    </>
  )
}
