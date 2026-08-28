'use client'

import { Search, Mail, Phone, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AdminCustomersPage() {
  const customers = [
    { id: '1', name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', phone: '0901234567', orders: 5, totalSpent: '124.950.000 ₫', joinDate: '12/01/2025' },
    { id: '2', name: 'Trần Thị B', email: 'tranthib@example.com', phone: '0912345678', orders: 2, totalSpent: '24.980.000 ₫', joinDate: '05/03/2026' },
    { id: '3', name: 'Lê Văn C', email: 'levanc@example.com', phone: '0923456789', orders: 1, totalSpent: '3.500.000 ₫', joinDate: '27/08/2026' },
    { id: '4', name: 'Phạm Thị D', email: 'phamthid@example.com', phone: '0934567890', orders: 8, totalSpent: '85.400.000 ₫', joinDate: '15/11/2024' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Quản lý Khách hàng</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 bg-slate-50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Tìm theo Tên, Email, SĐT..." className="pl-9 bg-white" />
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
                <th className="py-4 px-6">Ngày tham gia</th>
                <th className="py-4 px-6 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900">{customer.name}</span>
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
                  <td className="py-4 px-6 text-slate-600">{customer.joinDate}</td>
                  <td className="py-4 px-6 text-right">
                    <Button variant="outline" size="sm" className="h-8 px-2 text-blue-600 hover:bg-blue-50 border-blue-200">
                      <Eye className="w-4 h-4 mr-1" /> Xem LS
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
