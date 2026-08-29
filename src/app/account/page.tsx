'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User, Package, MapPin, Settings, LogOut, ChevronRight, Camera } from 'lucide-react'
import { readUser, updateUserSession, type SessionUser } from '@/lib/client-auth'
import { Button } from '@/components/ui/button'

export default function AccountPage() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false)

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
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-blue-100 border border-slate-200 flex items-center justify-center font-bold text-xl text-blue-600 flex-shrink-0">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    user.fullName.charAt(0)
                  )}
                </div>
                <div className="min-w-0">
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
                  <div className="flex flex-col md:flex-row gap-8 items-start mb-8 pb-8 border-b border-slate-100">
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-3xl font-bold text-slate-400 group">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                        ) : (
                          user.fullName.charAt(0)
                        )}
                        <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer">
                          <Camera className="w-6 h-6 mb-1" />
                          <span className="text-[10px] uppercase font-bold">Thay ảnh</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const reader = new FileReader()
                                reader.onload = (event) => {
                                  const result = event.target?.result as string
                                  if (result) {
                                    updateUserSession({ avatarUrl: result })
                                    setUser(prev => prev ? { ...prev, avatarUrl: result } : null)
                                  }
                                }
                                reader.readAsDataURL(file)
                              }
                            }}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-slate-500 text-center max-w-[120px]">Định dạng JPEG, PNG, JPG. Tối đa 2MB.</p>
                    </div>

                    <div className="flex-1 w-full space-y-6">
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
                      <Button variant="outline" onClick={() => setShowUpdateConfirm(true)}>Cập nhật thông tin</Button>
                      
                      {showUpdateConfirm && (
                        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Xác nhận cập nhật</h3>
                            <p className="text-slate-600 mb-6 text-sm">Bạn có chắc chắn muốn cập nhật và lưu lại các thay đổi về thông tin tài khoản không?</p>
                            <div className="flex items-center justify-end gap-3">
                              <Button variant="outline" onClick={() => setShowUpdateConfirm(false)}>Hủy bỏ</Button>
                              <Button onClick={() => {
                                setShowUpdateConfirm(false)
                                alert('Đã lưu thông tin cập nhật thành công!')
                              }}>Đồng ý lưu</Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
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
