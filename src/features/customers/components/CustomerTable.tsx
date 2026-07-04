'use client'

// ─── Component: Customer Table ───────────────────────────────────────

import { useState, useTransition } from 'react'
import { Customer } from '@/domain/customers/entity'
import { Search, Edit, Trash2, Building, Phone, FileText, MapPin } from 'lucide-react'
import { deleteCustomer } from '../actions'
import { EditCustomerModal } from './EditCustomerModal'

interface CustomerTableProps {
  customers: Customer[]
}

export function CustomerTable({ customers }: CustomerTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [isPending, startTransition] = useTransition()

  // Filter khách hàng theo search query ở client
  const filteredCustomers = customers.filter(customer => {
    const q = searchQuery.toLowerCase()
    return (
      customer.name.toLowerCase().includes(q) ||
      customer.phone.includes(q) ||
      customer.taxCode.toLowerCase().includes(q) ||
      customer.companyName.toLowerCase().includes(q) ||
      customer.address.toLowerCase().includes(q)
    )
  })

  // Thao tác xoá khách hàng
  const handleDelete = (customer: Customer) => {
    if (window.confirm(`Bạn có chắc chắn muốn xoá khách hàng "${customer.name}"?`)) {
      startTransition(async () => {
        const result = await deleteCustomer(customer.id)
        if (result.error) {
          alert(`Lỗi: ${result.error}`)
        }
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4.5 w-4.5 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm theo tên, SĐT, MST, công ty..."
          className="block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
        />
      </div>

      {/* Table container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/60 bg-white/40 backdrop-blur-md shadow-sm">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-200/60">
            <tr>
              <th className="px-6 py-4 font-semibold tracking-wider">Khách hàng / Công ty</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Liên hệ (SĐT)</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Mã số thuế</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Địa chỉ</th>
              <th className="px-6 py-4 font-semibold tracking-wider text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 bg-white/50">
                  {searchQuery ? 'Không tìm thấy khách hàng nào khớp với tìm kiếm.' : 'Chưa có dữ liệu khách hàng.'}
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
                <tr key={customer.id} className="group hover:bg-slate-50/80 transition-all duration-200 bg-white/40">
                  {/* Name & Company */}
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 w-9 h-9 rounded-xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center font-bold border border-white shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate">{customer.name}</p>
                        <span className="inline-flex items-center gap-1 mt-0.5 text-xs text-slate-500 font-medium max-w-xs truncate">
                          <Building className="w-3 h-3 text-slate-400" />
                          {customer.companyName}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-slate-600 font-semibold">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {customer.phone}
                    </span>
                  </td>

                  {/* Tax Code */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      {customer.taxCode}
                    </span>
                  </td>

                  {/* Address */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-slate-500 max-w-xs truncate" title={customer.address}>
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      {customer.address}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => setEditingCustomer(customer)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(customer)}
                        disabled={isPending}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Xoá"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal (render only when editingCustomer is not null) */}
      {editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          isOpen={true}
          onClose={() => setEditingCustomer(null)}
        />
      )}
    </div>
  )
}
