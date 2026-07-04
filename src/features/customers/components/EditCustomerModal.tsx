'use client'

// ─── Component: Edit Customer Modal ─────────────────────────────────

import { useState, useTransition } from 'react'
import { X } from 'lucide-react'
import { CustomerForm } from './CustomerForm'
import { updateCustomer } from '../actions'
import { Customer, CustomerFormData } from '@/domain/customers/entity'

interface EditCustomerModalProps {
  customer: Customer
  isOpen: boolean
  onClose: () => void
}

export function EditCustomerModal({ customer, isOpen, onClose }: EditCustomerModalProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [prevCustomer, setPrevCustomer] = useState<Customer>(customer)
  if (customer.id !== prevCustomer.id) {
    setPrevCustomer(customer)
    setError(null)
  }

  const handleSubmit = async (data: CustomerFormData) => {
    setError(null)
    startTransition(async () => {
      const result = await updateCustomer(customer.id, data)
      if (result.error) {
        setError(result.error)
      } else {
        onClose()
      }
    })
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-800">Chỉnh sửa khách hàng</h3>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <CustomerForm 
            initialData={{
              name: customer.name,
              phone: customer.phone,
              taxCode: customer.taxCode,
              address: customer.address,
              companyName: customer.companyName
            }}
            onSubmit={handleSubmit} 
            onCancel={onClose} 
            isPending={isPending}
            error={error}
            submitLabel="Cập nhật"
          />
        </div>
      </div>
    </>
  )
}
