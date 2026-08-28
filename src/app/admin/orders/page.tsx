'use client'

import { useState } from 'react'
import { Search, Filter, Eye, Edit, Truck, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState('all')

  const orders = [
    { id: '#ORD-001', customer: 'Nguyễn Văn A', phone: '0901234567', date: '28/08/2026 14:30', total: '24.990.000 ₫', payment: 'COD', status: 'pending' },
    { id: '#ORD-002', customer: 'Trần Thị B', phone: '0912345678', date: '28/08/2026 10:15', total: '12.490.000 ₫', payment: 'VNPAY', status: 'packing' },
    { id: '#ORD-003', customer: 'Lê Văn C', phone: '0923456789', date: '27/08/2026 16:45', total: '3.500.000 ₫', payment: 'VietQR', status: 'shipping' },
    { id: '#ORD-004', customer: 'Phạm Thị D', phone: '0934567890', date: '27/08/2026 09:20', total: '8.990.000 ₫', payment: 'MoMo', status: 'delivered' },
    { id: '#ORD-005', customer: 'Hoàng Văn E', phone: '0945678901', date: '26/08/2026 11:10', total: '45.000.000 ₫', payment: 'COD', status: 'cancelled' },
  ]

  const tabs = [
    { id: 'all', name: 'Tất cả đơn' },
    { id: 'pending', name: 'Chờ duyệt' },
    { id: 'packing', name: 'Đang đóng gói' },
    { id: 'shipping', name: 'Đang giao hàng' },
    { id: 'delivered', name: 'Đã giao' },
    { id: 'cancelled', name: 'Đã hủy' },
  ]

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">Chờ duyệt</span>
      case 'packing': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Đang đóng gói</span>
      case 'shipping': return <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">Đang giao</span>
      case 'delivered': return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">Đã giao</span>
      case 'cancelled': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">Đã hủy</span>
      default: return null
    }
  }

  const filteredOrders = activeTab === 'all' ? orders : orders.filter(o => o.status === activeTab)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Quản lý Đơn hàng</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-white' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Tìm kiếm theo Mã ĐH, Tên KH, SĐT..." className="pl-9" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" /> Bộ lọc nâng cao
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-sm text-slate-600 font-medium">
                <th className="py-4 px-6">Mã ĐH</th>
                <th className="py-4 px-6">Khách hàng</th>
                <th className="py-4 px-6">Ngày đặt</th>
                <th className="py-4 px-6">Thanh toán</th>
                <th className="py-4 px-6">Tổng tiền</th>
                <th className="py-4 px-6 text-center">Trạng thái</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Không có đơn hàng nào trong trạng thái này.
                  </td>
                </tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">{order.id}</td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-slate-900">{order.customer}</p>
                    <p className="text-sm text-slate-500">{order.phone}</p>
                  </td>
                  <td className="py-4 px-6 text-slate-600">{order.date}</td>
                  <td className="py-4 px-6 text-slate-600">
                    <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium border border-slate-200">{order.payment}</span>
                  </td>
                  <td className="py-4 px-6 font-bold text-red-600">{order.total}</td>
                  <td className="py-4 px-6 text-center">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="h-8 px-2 text-blue-600 hover:bg-blue-50 border-blue-200">
                        <Eye className="w-4 h-4 mr-1" /> Chi tiết
                      </Button>
                      
                      {/* Action buttons based on status */}
                      {order.status === 'pending' && (
                        <Button size="sm" className="h-8 px-3 bg-blue-600 hover:bg-blue-700">Duyệt</Button>
                      )}
                      {order.status === 'packing' && (
                        <Button size="sm" className="h-8 px-3 bg-indigo-600 hover:bg-indigo-700">
                           <Truck className="w-4 h-4 mr-1" /> Giao hàng
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-white text-sm">
          <p className="text-slate-500">Hiển thị <span className="font-medium text-slate-900">1-{filteredOrders.length}</span> trong số <span className="font-medium text-slate-900">{filteredOrders.length}</span> đơn hàng</p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Trước</Button>
            <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-200">1</Button>
            <Button variant="outline" size="sm">Tiếp</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
