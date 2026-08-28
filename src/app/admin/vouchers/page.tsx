'use client'

import { useState } from 'react'
import { Plus, Search, Edit, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ConfirmModal } from '@/components/ui/confirm-modal'

interface VoucherItem {
  id: string
  code: string
  type: string
  value: string
  minOrder: string
  usage: string
  status: 'active' | 'expired'
  expires: string
}

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<VoucherItem[]>([
    { id: '1', code: 'TECH10', type: 'Phần trăm', value: '10%', minOrder: '1.000.000 ₫', usage: '45/100', status: 'active', expires: '31/12/2026' },
    { id: '2', code: 'FREESHIP', type: 'Phí ship', value: '30.000 ₫', minOrder: '500.000 ₫', usage: '120/500', status: 'active', expires: '30/09/2026' },
    { id: '3', code: 'NEWUSER500', type: 'Cố định', value: '500.000 ₫', minOrder: '10.000.000 ₫', usage: '5/50', status: 'active', expires: '15/10/2026' },
    { id: '4', code: 'SUMMER2026', type: 'Phần trăm', value: '15%', minOrder: '5.000.000 ₫', usage: '200/200', status: 'expired', expires: '31/08/2026' },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingVoucher, setEditingVoucher] = useState<VoucherItem | null>(null)
  const [formData, setFormData] = useState({
    code: '',
    type: 'Phần trăm',
    value: '',
    minOrder: '',
    usage: '0/100',
    expires: '31/12/2026'
  })

  // Confirm modal state
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

  const handleOpenAdd = () => {
    setEditingVoucher(null)
    setFormData({ code: '', type: 'Phần trăm', value: '', minOrder: '1.000.000 ₫', usage: '0/100', expires: '31/12/2026' })
    setIsFormOpen(true)
  }

  const handleOpenEdit = (v: VoucherItem) => {
    setEditingVoucher(v)
    setFormData({
      code: v.code,
      type: v.type,
      value: v.value,
      minOrder: v.minOrder,
      usage: v.usage,
      expires: v.expires
    })
    setIsFormOpen(true)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.code || !formData.value) return

    if (editingVoucher) {
      setConfirmConfig({
        isOpen: true,
        title: 'Xác nhận cập nhật Voucher',
        message: `Bạn có chắc chắn muốn sửa thông tin mã giảm giá "${formData.code}" không?`,
        type: 'primary',
        action: () => {
          setVouchers(prev => prev.map(v => v.id === editingVoucher.id ? {
            ...v,
            code: formData.code.toUpperCase(),
            type: formData.type,
            value: formData.value,
            minOrder: formData.minOrder,
            expires: formData.expires
          } : v))
          setIsFormOpen(false)
        }
      })
    } else {
      setConfirmConfig({
        isOpen: true,
        title: 'Xác nhận tạo Voucher mới',
        message: `Bạn có chắc chắn muốn tạo mã giảm giá mới "${formData.code.toUpperCase()}" không?`,
        type: 'primary',
        action: () => {
          setVouchers(prev => [
            {
              id: (prev.length + 1).toString(),
              code: formData.code.toUpperCase(),
              type: formData.type,
              value: formData.value,
              minOrder: formData.minOrder,
              usage: '0/100',
              status: 'active',
              expires: formData.expires
            },
            ...prev
          ])
          setIsFormOpen(false)
        }
      })
    }
  }

  const handleOpenDelete = (v: VoucherItem) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Xác nhận xóa Voucher',
      message: `Bạn có chắc chắn muốn xóa mã giảm giá "${v.code}" không?`,
      type: 'danger',
      action: () => {
        setVouchers(prev => prev.filter(item => item.id !== v.id))
      }
    })
  }

  const filteredVouchers = vouchers.filter(v => v.code.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Quản lý Khuyến mãi</h1>
        <Button onClick={handleOpenAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tạo mã giảm giá
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 bg-slate-50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Tìm mã khuyến mãi..." 
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
              {filteredVouchers.map((voucher) => (
                <tr key={voucher.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-bold text-blue-600 font-mono">{voucher.code}</td>
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
                      <button onClick={() => handleOpenEdit(voucher)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleOpenDelete(voucher)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Add/Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingVoucher ? 'Sửa mã giảm giá' : 'Tạo mã giảm giá mới'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Mã Voucher (Code)</label>
                <Input 
                  required
                  placeholder="VD: TECH10" 
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Loại giảm</label>
                  <select 
                    className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="Phần trăm">Phần trăm (%)</option>
                    <option value="Cố định">Cố định (₫)</option>
                    <option value="Phí ship">Miễn phí ship</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Mức giảm</label>
                  <Input 
                    required
                    placeholder="VD: 10% hoặc 100.000 ₫" 
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Đơn tối thiểu (₫)</label>
                <Input 
                  required
                  placeholder="VD: 1.000.000 ₫" 
                  value={formData.minOrder}
                  onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Hạn sử dụng</label>
                <Input 
                  required
                  placeholder="VD: 31/12/2026" 
                  value={formData.expires}
                  onChange={(e) => setFormData({ ...formData, expires: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Hủy (NO)
                </Button>
                <Button type="submit">
                  {editingVoucher ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

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
