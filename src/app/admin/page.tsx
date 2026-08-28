'use client'

import { DollarSign, ShoppingBag, Users, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'

export default function AdminDashboardPage() {
  
  const stats = [
    { title: 'Tổng doanh thu', value: '124.500.000 ₫', trend: '+15.3%', isUp: true, icon: DollarSign, color: 'bg-blue-100 text-blue-600' },
    { title: 'Đơn hàng mới', value: '342', trend: '+4.2%', isUp: true, icon: ShoppingBag, color: 'bg-emerald-100 text-emerald-600' },
    { title: 'Khách hàng', value: '1,234', trend: '-2.1%', isUp: false, icon: Users, color: 'bg-purple-100 text-purple-600' },
    { title: 'Cảnh báo tồn kho', value: '12', trend: 'Sản phẩm sắp hết', isUp: false, icon: AlertTriangle, color: 'bg-amber-100 text-amber-600' },
  ]

  const recentOrders = [
    { id: '#ORD-001', customer: 'Nguyễn Văn A', date: '28/08/2026', total: '24.990.000 ₫', status: 'pending' },
    { id: '#ORD-002', customer: 'Trần Thị B', date: '28/08/2026', total: '12.490.000 ₫', status: 'completed' },
    { id: '#ORD-003', customer: 'Lê Văn C', date: '27/08/2026', total: '3.500.000 ₫', status: 'shipping' },
    { id: '#ORD-004', customer: 'Phạm Thị D', date: '27/08/2026', total: '8.990.000 ₫', status: 'completed' },
    { id: '#ORD-005', customer: 'Hoàng Văn E', date: '26/08/2026', total: '45.000.000 ₫', status: 'cancelled' },
  ]

  const topProducts = [
    { name: 'iPhone 15 Pro Max 256GB', sales: 124, revenue: '3.472.000.000 ₫' },
    { name: 'MacBook Air M3 2024', sales: 86, revenue: '2.407.140.000 ₫' },
    { name: 'Samsung Galaxy S24 Ultra', sales: 75, revenue: '2.399.250.000 ₫' },
    { name: 'AirPods Pro 2', sales: 210, revenue: '1.257.900.000 ₫' },
  ]

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Chờ duyệt</span>
      case 'shipping': return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Đang giao</span>
      case 'completed': return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Đã giao</span>
      case 'cancelled': return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Đã hủy</span>
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Tổng quan hệ thống</h1>
        <div className="flex gap-2">
          <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
            <option>Hôm nay</option>
            <option>7 ngày qua</option>
            <option>30 ngày qua</option>
            <option>Năm nay</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.isUp ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">Đơn hàng gần đây</h2>
            <button className="text-sm text-blue-600 font-medium hover:text-blue-700">Xem tất cả</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  <th className="pb-3 font-medium">Mã ĐH</th>
                  <th className="pb-3 font-medium">Khách hàng</th>
                  <th className="pb-3 font-medium">Ngày đặt</th>
                  <th className="pb-3 font-medium">Tổng tiền</th>
                  <th className="pb-3 font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, idx) => (
                  <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-4 font-medium text-slate-900">{order.id}</td>
                    <td className="py-4 text-slate-600">{order.customer}</td>
                    <td className="py-4 text-slate-600">{order.date}</td>
                    <td className="py-4 font-medium text-slate-900">{order.total}</td>
                    <td className="py-4">{getStatusBadge(order.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">Sản phẩm bán chạy</h2>
          </div>
          <div className="space-y-6">
            {topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                  #{idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate mb-1">{product.name}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">{product.sales} đã bán</span>
                    <span className="font-semibold text-blue-600">{product.revenue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
