'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User, Package, MapPin, Settings, LogOut, ChevronRight } from 'lucide-react'
import { readUser, type SessionUser } from '@/lib/client-auth'
import { Button } from '@/components/ui/button'

export default function AccountPage() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    const sessionUser = readUser()
    if (!sessionUser) {
      window.location.href = '/login'
    } else {
      setUser(sessionUser)
    }
  }, [])

  if (!user) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Đang tải...</div>

  const tabs = [
    { id: 'profile', label: 'Thông tin tài khoản', icon: User },
    { id: 'orders', label: 'Quản lý đơn hàng', icon: Package },
    { id: 'address', label: 'Sổ địa chỉ', icon: MapPin },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ]

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-slate-900 font-medium">Tài khoản của tôi</span>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl">
                  {user.fullName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-slate-500">Xin chào,</p>
                  <p className="font-bold text-slate-900 truncate">{user.fullName}</p>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
                <button
                  onClick={() => {
                    localStorage.removeItem('session')
                    window.location.href = '/'
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-sm font-medium mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  Đăng xuất
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm min-h-[500px]">
              
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Thông tin tài khoản</h2>
                  <div className="max-w-lg space-y-6">
                    <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
                      <div className="text-slate-500 font-medium">Họ và tên</div>
                      <div className="col-span-2 text-slate-900">{user.fullName}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
                      <div className="text-slate-500 font-medium">Email</div>
                      <div className="col-span-2 text-slate-900">{user.email}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
                      <div className="text-slate-500 font-medium">Số điện thoại</div>
                      <div className="col-span-2 text-slate-900">0987654321</div>
                    </div>
                    <Button variant="outline">Cập nhật thông tin</Button>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Lịch sử đơn hàng</h2>
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-500">Bạn chưa có đơn hàng nào.</p>
                    <Link href="/products">
                      <Button className="mt-4">Mua sắm ngay</Button>
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === 'address' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Sổ địa chỉ</h2>
                    <Button size="sm">Thêm địa chỉ mới</Button>
                  </div>
                  <div className="border border-slate-200 rounded-xl p-4">
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900">{user.fullName}</span>
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Mặc định</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-1">0987654321</p>
                        <p className="text-sm text-slate-600">123 Đường Công Nghệ, Phường Đổi Mới, Quận Sáng Tạo, TP. Hồ Chí Minh</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-blue-600">Sửa</Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Cài đặt</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-4 border-b border-slate-100">
                      <div>
                        <p className="font-medium text-slate-900">Nhận thông báo qua Email</p>
                        <p className="text-sm text-slate-500">Cập nhật về đơn hàng, khuyến mãi, sản phẩm mới</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="py-4">
                      <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">Đổi mật khẩu</Button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
