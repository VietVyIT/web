'use client'

import { useState } from 'react'
import { Plus, Search, Filter, Edit, Trash2, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AdminProductsPage() {
  const [products] = useState([
    { id: '1', sku: 'IP15PM-256-TI', name: 'iPhone 15 Pro Max 256GB', category: 'Điện thoại', price: '34.990.000 ₫', stock: 45, status: 'active' },
    { id: '2', sku: 'MBA-M3-16-512', name: 'MacBook Air M3 2024 16GB/512GB', category: 'Laptop', price: '32.990.000 ₫', stock: 12, status: 'active' },
    { id: '3', sku: 'SS-S24U-512', name: 'Samsung Galaxy S24 Ultra 512GB', category: 'Điện thoại', price: '37.490.000 ₫', stock: 0, status: 'out_of_stock' },
    { id: '4', sku: 'AP-PRO-2', name: 'AirPods Pro 2', category: 'Tai nghe', price: '5.990.000 ₫', stock: 120, status: 'active' },
    { id: '5', sku: 'AW-S9-45', name: 'Apple Watch Series 9 45mm', category: 'Smartwatch', price: '10.490.000 ₫', stock: 5, status: 'low_stock' },
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Quản lý Sản phẩm</h1>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Thêm sản phẩm mới
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Tìm kiếm theo Tên, SKU..." className="pl-9 bg-white" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select className="flex h-10 items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option value="">Tất cả danh mục</option>
              <option value="phone">Điện thoại</option>
              <option value="laptop">Laptop</option>
            </select>
            <Button variant="outline" className="flex items-center gap-2 bg-white">
              <Filter className="w-4 h-4" /> Lọc
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-sm text-slate-600 font-medium">
                <th className="py-4 px-6">
                  <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="py-4 px-6">Sản phẩm</th>
                <th className="py-4 px-6">SKU</th>
                <th className="py-4 px-6">Danh mục</th>
                <th className="py-4 px-6">Giá bán</th>
                <th className="py-4 px-6 text-center">Tồn kho</th>
                <th className="py-4 px-6 text-center">Trạng thái</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-900 flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                    {product.name}
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-mono text-sm">{product.sku}</td>
                  <td className="py-4 px-6 text-slate-600">{product.category}</td>
                  <td className="py-4 px-6 font-medium text-slate-900">{product.price}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`font-semibold ${product.stock < 10 ? 'text-red-600' : 'text-slate-900'}`}>{product.stock}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {product.status === 'active' && <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Đang bán</span>}
                    {product.status === 'out_of_stock' && <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Hết hàng</span>}
                    {product.status === 'low_stock' && <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Sắp hết</span>}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Chỉnh sửa">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-white text-sm">
          <p className="text-slate-500">Hiển thị <span className="font-medium text-slate-900">1-5</span> trong số <span className="font-medium text-slate-900">120</span> sản phẩm</p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Trước</Button>
            <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-200">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <span className="px-2 py-1 text-slate-400">...</span>
            <Button variant="outline" size="sm">Tiếp</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
