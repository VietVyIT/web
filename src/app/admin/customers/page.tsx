'use client'

import { useState } from 'react'
import { Search, Mail, Phone, Lock, Unlock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ConfirmModal } from '@/components/ui/confirm-modal'

interface CustomerItem {
  id: string
  name: string
  email: string
  phone: string
  orders: number
  totalSpent: string
  joinDate: string
  status: 'active' | 'locked'
}

export default function AdminCustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const [customers, setCustomers] = useState<CustomerItem[]>([
    { id: '1', name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', phone: '0901234567', orders: 5, totalSpent: '124.950.000 ₫', joinDate: '12/01/2025', status: 'active' },
    { id: '2', name: 'Trần Thị B', email: 'tranthib@example.com', phone: '0912345678', orders: 2, totalSpent: '24.980.000 ₫', joinDate: '05/03/2026', status: 'active' },
    { id: '3', name: 'Lê Văn C', email: 'levanc@example.com', phone: '0923456789', orders: 1, totalSpent: '3.500.000 ₫', joinDate: '27/08/2026', status: 'active' },
    { id: '4', name: 'Phạm Thị D', email: 'phamthid@example.com', phone: '0934567890', orders: 8, totalSpent: '85.400.000 ₫', joinDate: '15/11/2024', status: 'locked' },
  ])

  // Confirm Modal state
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean
    title: string
    message: string
    type?: 'danger' | 'primary' | 'warning'
    action?: () => void
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'primary'
  })

  const handleToggleStatus = (customer: CustomerItem) => {
    const isLocking = customer.status === 'active'
    setConfirmConfig({
      isOpen: true,
      title: isLocking ? 'Xác nhận khóa tài khoản' : 'Xác nhận mở khóa tài khoản',
      message: isLocking 
        ? `Bạn có chắc chắn muốn khóa tài khoản của khách hàng "${customer.name}" (${customer.email}) không?`
        : `Bạn có chắc chắn muốn mở khóa lại cho khách hàng "${customer.name}" không?`,
      type: isLocking ? 'danger' : 'primary',
      action: () => {
        setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, status: isLocking ? 'locked' : 'active' } : c))
      }
    })
  }

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Quản lý Khách hàng</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 bg-slate-50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Tìm theo Tên, Email, SĐT..." 
              className="pl-9 bg-white" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-sm text-slate-600 font-medium">
                <th className="py-4 px-6">Khách hàng</th>
                <th className="py-4 px-6">Liên hệ</th>
                <th className="py-4 px-6 text-center">Số đơn hàng</th>
                <th className="py-4 px-6 font-medium">Tổng chi tiêu</th>
                <th className="py-4 px-6 text-center">Trạng thái</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{customer.name}</span>
                        <span className="text-xs text-slate-400">Tham gia: {customer.joinDate}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1 text-sm text-slate-600">
                      <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {customer.email}</div>
                      <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {customer.phone}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center font-medium text-slate-900">{customer.orders}</td>
                  <td className="py-4 px-6 font-bold text-blue-600">{customer.totalSpent}</td>
                  <td className="py-4 px-6 text-center">
                    {customer.status === 'active' 
                      ? <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Hoạt động</span>
                      : <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Bị khóa</span>}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`h-8 px-3 ${customer.status === 'active' ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'}`}
                      onClick={() => handleToggleStatus(customer)}
                    >
                      {customer.status === 'active' ? (
                        <><Lock className="w-3.5 h-3.5 mr-1" /> Khóa tài khoản</>
                      ) : (
                        <><Unlock className="w-3.5 h-3.5 mr-1" /> Mở khóa</>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal 
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
        onConfirm={() => {
          if (confirmConfig.action) confirmConfig.action()
          setConfirmConfig({ ...confirmConfig, isOpen: false })
        }}
        onCancel={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
      />
    </div>
  )
}
