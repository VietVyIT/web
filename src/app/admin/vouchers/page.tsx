'use client'

import { Plus, Search, MoreVertical, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AdminVouchersPage() {
  const vouchers = [
    { id: '1', code: 'TECH10', type: 'Phần trăm', value: '10%', minOrder: '1.000.000 ₫', usage: '45/100', status: 'active', expires: '31/12/2026' },
    { id: '2', code: 'FREESHIP', type: 'Phí ship', value: '30.000 ₫', minOrder: '500.000 ₫', usage: '120/500', status: 'active', expires: '30/09/2026' },
    { id: '3', code: 'NEWUSER500', type: 'Cố định', value: '500.000 ₫', minOrder: '10.000.000 ₫', usage: '5/50', status: 'active', expires: '15/10/2026' },
    { id: '4', code: 'SUMMER2026', type: 'Phần trăm', value: '15%', minOrder: '5.000.000 ₫', usage: '200/200', status: 'expired', expires: '31/08/2026' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Quản lý Khuyến mãi</h1>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tạo mã giảm giá
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 bg-slate-50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Tìm mã khuyến mãi..." className="pl-9 bg-white" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-sm text-slate-600 font-medium">
                <th className="py-4 px-6">Mã giảm giá</th>
                <th className="py-4 px-6">Loại giảm</th>
                <th className="py-4 px-6">Mức giảm</th>
                <th className="py-4 px-6">Đơn tối thiểu</th>
                <th className="py-4 px-6 text-center">Đã dùng/Tổng</th>
                <th className="py-4 px-6 text-center">Hạn sử dụng</th>
                <th className="py-4 px-6 text-center">Trạng thái</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((voucher) => (
                <tr key={voucher.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-bold text-blue-600">{voucher.code}</td>
                  <td className="py-4 px-6 text-slate-600">{voucher.type}</td>
                  <td className="py-4 px-6 font-medium text-slate-900">{voucher.value}</td>
                  <td className="py-4 px-6 text-slate-600">{voucher.minOrder}</td>
                  <td className="py-4 px-6 text-center font-medium text-slate-700">{voucher.usage}</td>
                  <td className="py-4 px-6 text-center text-slate-600">{voucher.expires}</td>
                  <td className="py-4 px-6 text-center">
                    {voucher.status === 'active' 
                      ? <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Đang chạy</span>
                      : <span className="px-2.5 py-1 bg-slate-200 text-slate-600 rounded-full text-xs font-medium">Đã kết thúc</span>}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
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
