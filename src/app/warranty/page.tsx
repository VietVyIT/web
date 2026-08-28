'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Search, ShieldCheck, AlertCircle, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function WarrantyPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    setError('')
    setResult(null)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      if (searchQuery.toUpperCase() === 'SN12345') {
        setResult({
          productName: 'iPhone 15 Pro Max 256GB',
          serial: 'SN12345',
          imei: '354312345678901',
          activationDate: '2025-10-15',
          expirationDate: '2026-10-15',
          status: 'active',
          history: [
            { date: '2026-01-10', note: 'Vệ sinh máy miễn phí' }
          ]
        })
      } else {
        setError('Không tìm thấy thông tin bảo hành cho Serial/IMEI này.')
      }
    }, 1000)
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-slate-500 mb-8 justify-center">
          <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-slate-900 font-medium">Tra cứu bảo hành</span>
        </div>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Tra Cứu Thông Tin Bảo Hành</h1>
          <p className="text-slate-600 max-w-lg mx-auto">
            Nhập số Serial hoặc IMEI của thiết bị để kiểm tra thời hạn bảo hành và lịch sử sửa chữa chính hãng.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-slate-200">
          <form onSubmit={handleSearch} className="flex gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Nhập Serial hoặc IMEI (vd: SN12345)..."
                className="pl-12 h-14 text-lg bg-slate-50 border-slate-200 focus:bg-white"
              />
            </div>
            <Button type="submit" size="lg" className="h-14 px-8 text-lg" disabled={loading}>
              {loading ? 'Đang tra cứu...' : 'Tra cứu'}
            </Button>
          </form>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{result.productName}</h3>
                  <p className="text-sm text-slate-500 mt-1">S/N: {result.serial} • IMEI: {result.imei}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${result.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {result.status === 'active' ? 'Còn bảo hành' : 'Hết bảo hành'}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">Ngày kích hoạt</p>
                  <p className="font-semibold text-slate-900">{new Date(result.activationDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">Ngày hết hạn</p>
                  <p className="font-semibold text-slate-900">{new Date(result.expirationDate).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-4">Lịch sử bảo hành / sửa chữa</h4>
                {result.history.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">Thiết bị chưa có lịch sử sửa chữa.</p>
                ) : (
                  <div className="space-y-4">
                    {result.history.map((record: any, index: number) => (
                      <div key={index} className="flex gap-4 p-4 border border-slate-100 rounded-xl">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Settings className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{record.note}</p>
                          <p className="text-sm text-slate-500 mt-1">{new Date(record.date).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
