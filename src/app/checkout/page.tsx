'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, CreditCard, MapPin, Ticket, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCartStore } from '@/store/cartStore'

export default function CheckoutPage() {
  const { items, getTotal } = useCartStore()
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    address: '',
    note: ''
  })

  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [voucher, setVoucher] = useState('')
  const [discount, setDiscount] = useState(0)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫'
  }

  const subtotal = getTotal()
  const shippingFee = subtotal > 5000000 ? 0 : 30000
  const total = subtotal + shippingFee - discount

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault()
    // Demo voucher logic
    if (voucher.toUpperCase() === 'TECH10') {
      setDiscount(subtotal * 0.1)
    } else {
      alert('Mã giảm giá không hợp lệ')
      setDiscount(0)
    }
  }

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    // Here we would validate and send to API
    alert('Đặt hàng thành công!')
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href="/cart" className="hover:text-blue-600">Giỏ hàng</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-slate-900 font-medium">Thanh toán</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-8">Thanh toán đơn hàng</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Delivery Info */}
            <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" /> Thông tin giao hàng
              </h2>
              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Họ và tên *</label>
                    <Input required placeholder="Nhập họ và tên" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Số điện thoại *</label>
                    <Input required type="tel" placeholder="Nhập số điện thoại" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Tỉnh/Thành phố *</label>
                    <select required className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600">
                      <option value="">Chọn Tỉnh/Thành</option>
                      <option value="hcm">Hồ Chí Minh</option>
                      <option value="hn">Hà Nội</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Quận/Huyện *</label>
                    <select required className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600">
                      <option value="">Chọn Quận/Huyện</option>
                      <option value="q1">Quận 1</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Phường/Xã *</label>
                    <select required className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600">
                      <option value="">Chọn Phường/Xã</option>
                      <option value="bn">Bến Nghé</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Địa chỉ cụ thể *</label>
                  <Input required placeholder="Số nhà, tên đường..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Ghi chú (Tùy chọn)</label>
                  <Input placeholder="Ghi chú thêm về đơn hàng..." value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} />
                </div>
              </form>
            </section>

            {/* Payment Methods */}
            <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" /> Phương thức thanh toán
              </h2>
              <div className="space-y-3">
                {[
                  { id: 'cod', name: 'Thanh toán khi nhận hàng (COD)' },
                  { id: 'vietqr', name: 'Chuyển khoản VietQR' },
                  { id: 'vnpay', name: 'Thanh toán VNPAY' },
                  { id: 'momo', name: 'Thanh toán MoMo' }
                ].map(method => (
                  <label key={method.id} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === method.id ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300'}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium text-slate-700">{method.name}</span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Tóm tắt đơn hàng</h2>
              
              <div className="max-h-[300px] overflow-y-auto mb-6 pr-2 space-y-4">
                {items.map(item => (
                  <div key={item.variantId} className="flex gap-3 items-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                      <div className="absolute top-0 right-0 bg-slate-500 text-white text-[10px] px-1.5 rounded-bl font-bold">{item.quantity}</div>
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-slate-900 line-clamp-2">{item.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">{item.color} {item.memory ? `- ${item.memory}` : ''}</p>
                    </div>
                    <div className="font-semibold text-slate-900 text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Voucher */}
              <div className="py-4 border-y border-slate-100 mb-4">
                <form onSubmit={handleApplyVoucher} className="flex gap-2">
                  <div className="relative flex-1">
                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      placeholder="Mã giảm giá (vd: TECH10)" 
                      value={voucher}
                      onChange={e => setVoucher(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button type="submit" variant="outline">Áp dụng</Button>
                </form>
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Tạm tính</span>
                  <span className="font-medium text-slate-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Phí giao hàng</span>
                  <span className="font-medium text-slate-900">{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Giảm giá</span>
                    <span className="font-medium">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Tổng thanh toán</span>
                  <span className="text-2xl font-bold text-blue-600">{formatPrice(total)}</span>
                </div>
              </div>

              <Button form="checkout-form" type="submit" size="lg" className="w-full h-12 text-base">
                Tiến hành đặt hàng
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
