'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, CreditCard, MapPin, Ticket, Truck, QrCode, Copy, Check, X, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCartStore } from '@/store/cartStore'

interface Ward {
  code: number | string
  name: string
}

interface District {
  code: number | string
  name: string
  wards?: Ward[]
}

interface Province {
  code: number | string
  name: string
  districts?: District[]
}

// Fallback provinces dataset in case network API is blocked
const FALLBACK_PROVINCES: Province[] = [
  {
    code: '79',
    name: 'Thành phố Hồ Chí Minh',
    districts: [
      {
        code: '760',
        name: 'Quận 1',
        wards: [{ code: '26734', name: 'Phường Bến Nghé' }, { code: '26737', name: 'Phường Bến Thành' }, { code: '26740', name: 'Phường Tân Định' }]
      },
      {
        code: '769',
        name: 'Thành phố Thủ Đức',
        wards: [{ code: '26866', name: 'Phường Thảo Điền' }, { code: '26869', name: 'Phường An Phú' }, { code: '26872', name: 'Phường Linh Trung' }]
      },
      {
        code: '770',
        name: 'Quận 7',
        wards: [{ code: '27220', name: 'Phường Tân Phong' }, { code: '27223', name: 'Phường Phú Mỹ' }]
      }
    ]
  },
  {
    code: '01',
    name: 'Thành phố Hà Nội',
    districts: [
      {
        code: '001',
        name: 'Quận Ba Đình',
        wards: [{ code: '00001', name: 'Phường Phúc Xá' }, { code: '00004', name: 'Phường Trúc Bạch' }]
      },
      {
        code: '005',
        name: 'Quận Cầu Giấy',
        wards: [{ code: '00157', name: 'Phường Dịch Vọng' }, { code: '00160', name: 'Phường Dịch Vọng Hậu' }]
      }
    ]
  },
  {
    code: '48',
    name: 'Thành phố Đà Nẵng',
    districts: [
      {
        code: '490',
        name: 'Quận Hải Châu',
        wards: [{ code: '20239', name: 'Phường Hải Châu I' }, { code: '20242', name: 'Phường Hải Châu II' }]
      }
    ]
  }
]

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore()
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    provinceCode: '',
    provinceName: '',
    districtCode: '',
    districtName: '',
    wardCode: '',
    wardName: '',
    address: '',
    note: ''
  })

  // Administrative Divisions API States
  const [provinces, setProvinces] = useState<Province[]>(FALLBACK_PROVINCES)
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [loadingProvinces, setLoadingProvinces] = useState(true)

  const [paymentMethod, setPaymentMethod] = useState('vietqr')
  const [voucher, setVoucher] = useState('')
  const [discount, setDiscount] = useState(0)

  // QR Modal & Order status states
  const [showQrModal, setShowQrModal] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [orderCompleted, setOrderCompleted] = useState(false)
  const [orderId, setOrderId] = useState('')

  // Fetch official VN Provinces API
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch('https://provinces.open-api.vn/api/?depth=3')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setProvinces(data)
          }
        }
      } catch (e) {
        console.warn('Could not fetch open-api.vn, using fallback provinces:', e)
      } finally {
        setLoadingProvinces(false)
      }
    }
    fetchProvinces()
  }, [])

  // Handle Province change
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pCode = e.target.value
    const selectedP = provinces.find(p => p.code.toString() === pCode)
    setFormData(prev => ({
      ...prev,
      provinceCode: pCode,
      provinceName: selectedP ? selectedP.name : '',
      districtCode: '',
      districtName: '',
      wardCode: '',
      wardName: ''
    }))
    setDistricts(selectedP?.districts || [])
    setWards([])
  }

  // Handle District change
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dCode = e.target.value
    const selectedD = districts.find(d => d.code.toString() === dCode)
    setFormData(prev => ({
      ...prev,
      districtCode: dCode,
      districtName: selectedD ? selectedD.name : '',
      wardCode: '',
      wardName: ''
    }))
    setWards(selectedD?.wards || [])
  }

  // Handle Ward change
  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wCode = e.target.value
    const selectedW = wards.find(w => w.code.toString() === wCode)
    setFormData(prev => ({
      ...prev,
      wardCode: wCode,
      wardName: selectedW ? selectedW.name : ''
    }))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫'
  }

  const subtotal = getTotal()
  const shippingFee = subtotal > 5000000 || subtotal === 0 ? 0 : 30000
  const total = Math.max(0, subtotal + shippingFee - discount)

  // Bank Info provided by User
  const bankConfig = {
    bankId: 'MB',
    bankName: 'Ngân hàng MB Bank (Quân Đội)',
    accountNo: '0369375387',
    accountName: 'PHAN VIET VY'
  }

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault()
    if (voucher.trim().toUpperCase() === 'TECH10') {
      setDiscount(subtotal * 0.1)
    } else if (voucher.trim().toUpperCase() === 'VIP500') {
      setDiscount(500000)
    } else {
      alert('Mã giảm giá không hợp lệ (Thử: TECH10 hoặc VIP500)')
      setDiscount(0)
    }
  }

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) {
      alert('Giỏ hàng của bạn đang trống!')
      return
    }

    if (formData.phone.length > 10) {
      alert('Số điện thoại không được vượt quá 10 chữ số!')
      return
    }

    const generatedOrderId = 'DH' + Math.floor(100000 + Math.random() * 900000)
    setOrderId(generatedOrderId)

    if (paymentMethod === 'vietqr') {
      setShowQrModal(true)
    } else {
      setOrderCompleted(true)
      clearCart()
    }
  }

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2500)
  }

  const handleConfirmQrPaid = () => {
    setShowQrModal(false)
    setOrderCompleted(true)
    clearCart()
  }

  const qrImageUrl = `https://img.vietqr.io/image/${bankConfig.bankId}-${bankConfig.accountNo}-compact2.png?amount=${total}&addInfo=${orderId}&accountName=${encodeURIComponent(bankConfig.accountName)}`

  if (orderCompleted) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Đặt Hàng Thành Công!</h2>
            <p className="text-sm text-slate-500">Mã đơn hàng của bạn là <span className="font-bold text-blue-600">#{orderId}</span></p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl text-left text-sm space-y-2 border border-slate-100">
            <div className="flex justify-between"><span className="text-slate-500">Người nhận:</span> <span className="font-semibold text-slate-800">{formData.name || 'Khách hàng'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Số điện thoại:</span> <span className="font-semibold text-slate-800">{formData.phone}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Địa chỉ:</span> <span className="font-semibold text-slate-800 line-clamp-1">{formData.address}, {formData.wardName}, {formData.districtName}, {formData.provinceName}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Phương thức:</span> <span className="font-semibold text-blue-600">{paymentMethod === 'vietqr' ? 'Chuyển khoản VietQR' : 'COD (Thanh toán khi nhận)'}</span></div>
            <div className="flex justify-between border-t border-slate-200 pt-2"><span className="text-slate-500">Tổng tiền:</span> <span className="font-bold text-slate-900">{formatPrice(total)}</span></div>
          </div>
          <p className="text-xs text-slate-400">Cảm ơn bạn đã tin tưởng mua sắm tại TechStore. Đơn hàng đang được chuẩn bị và sẽ sớm giao tới bạn.</p>
          <Link href="/">
            <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
              Về Trang Chủ
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href="/cart" className="hover:text-blue-600 transition-colors">Giỏ hàng</Link>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Họ và tên *</label>
                    <Input required placeholder="Nhập họ và tên" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Số điện thoại (tối đa 10 số) *</label>
                    <Input 
                      required 
                      type="tel" 
                      maxLength={10} 
                      placeholder="VD: 0901234567" 
                      value={formData.phone} 
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '')
                        if (val.length <= 10) setFormData({...formData, phone: val})
                      }} 
                    />
                  </div>
                </div>

                {/* Administrative Units API selects */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Tỉnh/Thành phố *</label>
                    <select 
                      required 
                      value={formData.provinceCode}
                      onChange={handleProvinceChange}
                      className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">{loadingProvinces ? 'Đang tải Tỉnh/Thành...' : 'Chọn Tỉnh/Thành'}</option>
                      {provinces.map(p => (
                        <option key={p.code} value={p.code}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Quận/Huyện *</label>
                    <select 
                      required 
                      disabled={!formData.provinceCode}
                      value={formData.districtCode}
                      onChange={handleDistrictChange}
                      className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-slate-100"
                    >
                      <option value="">Chọn Quận/Huyện</option>
                      {districts.map(d => (
                        <option key={d.code} value={d.code}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Phường/Xã *</label>
                    <select 
                      required 
                      disabled={!formData.districtCode}
                      value={formData.wardCode}
                      onChange={handleWardChange}
                      className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-slate-100"
                    >
                      <option value="">Chọn Phường/Xã</option>
                      {wards.map(w => (
                        <option key={w.code} value={w.code}>{w.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Địa chỉ cụ thể *</label>
                  <Input required placeholder="Số nhà, tên đường..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Ghi chú (Tùy chọn)</label>
                  <Input placeholder="Ghi chú thêm về thời gian giao hoặc hướng dẫn giao..." value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} />
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
                  { 
                    id: 'vietqr', 
                    name: 'Chuyển khoản Ngân hàng qua VietQR (Tự động & Nhanh chóng)', 
                    icon: QrCode, 
                    badge: 'Khuyên dùng',
                    desc: `Chuyển tới STK ${bankConfig.accountNo} (${bankConfig.bankId}) - Chủ TK: ${bankConfig.accountName}`
                  },
                  { 
                    id: 'cod', 
                    name: 'Thanh toán khi nhận hàng (COD)', 
                    icon: Truck, 
                    desc: 'Thanh toán bằng tiền mặt cho shipper khi nhận được hàng'
                  },
                  { 
                    id: 'vnpay', 
                    name: 'Thanh toán Thẻ / VNPAY QR', 
                    icon: CreditCard, 
                    desc: 'Thanh toán trực tiếp qua cổng VNPAY'
                  }
                ].map(method => {
                  const Icon = method.icon
                  const isSelected = paymentMethod === method.id
                  return (
                    <label 
                      key={method.id} 
                      className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${isSelected ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-600/20' : 'border-slate-200 hover:border-blue-300 bg-white'}`}
                    >
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value={method.id}
                        checked={isSelected}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} />
                          <span className="font-semibold text-slate-900 text-sm md:text-base">{method.name}</span>
                          {method.badge && (
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                              {method.badge}
                            </span>
                          )}
                        </div>
                        {method.desc && (
                          <p className="text-xs text-slate-500 mt-1">{method.desc}</p>
                        )}
                      </div>
                    </label>
                  )
                })}
              </div>
            </section>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Tóm tắt đơn hàng ({items.reduce((s, i) => s + i.quantity, 0)})</h2>
              
              {items.length === 0 ? (
                <div className="py-8 text-center text-slate-500">
                  Giỏ hàng chưa có sản phẩm nào.
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto mb-6 pr-2 space-y-4 scroll-smooth">
                  {items.map(item => (
                    <div key={item.variantId} className="flex gap-3 items-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 relative border border-slate-100">
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] px-1.5 rounded-bl font-bold">{item.quantity}</div>
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
              )}

              {/* Voucher */}
              <div className="py-4 border-y border-slate-100 mb-4">
                <form onSubmit={handleApplyVoucher} className="flex gap-2">
                  <div className="relative flex-1">
                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      placeholder="Mã giảm giá (Thử: TECH10)" 
                      value={voucher}
                      onChange={e => setVoucher(e.target.value)}
                      className="pl-9 text-xs md:text-sm uppercase"
                    />
                  </div>
                  <Button type="submit" variant="outline" className="text-xs px-3">Áp dụng</Button>
                </form>
                {discount > 0 && (
                  <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Áp dụng mã giảm giá thành công!
                  </p>
                )}
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

              <Button form="checkout-form" type="submit" size="lg" className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20">
                {paymentMethod === 'vietqr' ? 'Thanh Toán Qua VietQR' : 'Tiến Hành Đặt Hàng'}
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* --- VIETQR PAYMENT MODAL --- */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative border border-slate-100 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Chuyển Khoản VietQR</h3>
                  <p className="text-xs text-slate-500">Mã đơn hàng: <span className="font-bold text-blue-600">#{orderId}</span></p>
                </div>
              </div>
              <button onClick={() => setShowQrModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR Image Box */}
            <div className="flex flex-col items-center justify-center bg-slate-50 p-6 rounded-2xl border border-slate-200 relative">
              <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-100">
                <img 
                  src={qrImageUrl} 
                  alt="VietQR Code" 
                  className="w-56 h-56 object-contain rounded-lg"
                />
              </div>
              <p className="text-xs text-slate-500 mt-3 text-center flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-green-600" /> Mở app ngân hàng (MB Bank, VCB, Techcombank...) quét mã QR
              </p>
            </div>

            {/* Account Info Details Card */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-sm">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500">Ngân hàng:</span>
                <span className="font-bold text-slate-900">{bankConfig.bankName}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500">Số tài khoản:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-600 text-base">{bankConfig.accountNo}</span>
                  <button 
                    onClick={() => handleCopy(bankConfig.accountNo, 'stk')}
                    className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-lg border border-slate-300 font-medium transition-colors"
                  >
                    {copiedField === 'stk' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedField === 'stk' ? 'Đã sao chép' : 'Sao chép'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500">Chủ tài khoản:</span>
                <span className="font-bold text-slate-900 uppercase">{bankConfig.accountName}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500">Số tiền:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-red-600 text-base">{formatPrice(total)}</span>
                  <button 
                    onClick={() => handleCopy(total.toString(), 'amount')}
                    className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-lg border border-slate-300 font-medium transition-colors"
                  >
                    {copiedField === 'amount' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedField === 'amount' ? 'Đã sao chép' : 'Sao chép'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Nội dung CK:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 bg-yellow-100 text-yellow-900 px-2 py-0.5 rounded">{orderId}</span>
                  <button 
                    onClick={() => handleCopy(orderId, 'content')}
                    className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-lg border border-slate-300 font-medium transition-colors"
                  >
                    {copiedField === 'content' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedField === 'content' ? 'Đã sao chép' : 'Sao chép'}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <Button 
                onClick={handleConfirmQrPaid}
                size="lg" 
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl h-12 font-semibold text-base shadow-lg shadow-green-600/20"
              >
                Tôi Đã Chuyển Khoản Thành Công
              </Button>
              <button 
                onClick={() => setShowQrModal(false)}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-700 py-1"
              >
                Đổi phương thức thanh toán khác
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
