'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Smartphone, Laptop, Tablet, Headphones, Watch, Zap, ChevronRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Types based on the previous schema and api design
interface ProductItem {
  id: string
  name: string
  slug: string
  modelCode: string
  brand: string
  avgRating: number
  image?: string
  variants: Array<{ effectivePrice: number, listedPrice?: number }>
}

export default function HomePage() {
  const [items, setItems] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)

  // Demo countdown for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return { hours: 24, minutes: 0, seconds: 0 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        const payload = await response.json()
        setItems(payload.slice(0, 8))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const categories = [
    { name: 'Điện thoại', icon: Smartphone, color: 'bg-blue-100 text-blue-600', href: '/products?category=dien-thoai' },
    { name: 'Laptop', icon: Laptop, color: 'bg-indigo-100 text-indigo-600', href: '/products?category=laptop' },
    { name: 'Tablet', icon: Tablet, color: 'bg-purple-100 text-purple-600', href: '/products?category=tablet' },
    { name: 'Tai nghe', icon: Headphones, color: 'bg-pink-100 text-pink-600', href: '/products?category=tai-nghe' },
    { name: 'Smartwatch', icon: Watch, color: 'bg-rose-100 text-rose-600', href: '/products?category=smartwatch' },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫'
  }

  return (
    <div className="w-full">
      {/* Hero Banner Section */}
      <section className="bg-slate-900 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-indigo-900/50 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 text-white">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Khai Phá Kỷ Nguyên <br className="hidden md:block"/> Công Nghệ Mới
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-lg">
              Sở hữu ngay những thiết bị công nghệ hàng đầu với ưu đãi độc quyền. Giao hàng tốc hành, bảo hành chính hãng.
            </p>
            <div className="flex gap-4 pt-4">
              <Link href="/products">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold h-12 px-8">
                  Mua Ngay
                </Button>
              </Link>
              <Link href="/products?sort=new">
                <Button variant="outline" size="lg" className="border-slate-500 text-white hover:bg-white/10 h-12 px-8">
                  Hàng Mới Về
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative h-64 md:h-[400px] w-full flex items-center justify-center">
            {/* Placeholder for Hero Image */}
            <div className="relative w-full max-w-md aspect-square rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl absolute inset-0 m-auto animate-pulse"></div>
            <img src="https://placehold.co/600x400/png?text=Premium+Tech+Devices" alt="Hero" className="relative z-10 w-full object-contain transform hover:scale-105 transition-transform duration-700" />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        
        {/* Categories Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Danh Mục Sản Phẩm</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <Link key={i} href={cat.href} className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all group">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${cat.color} group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-8 h-8" />
                </div>
                <span className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Flash Sale Section */}
        <section className="bg-gradient-to-r from-red-500 to-rose-600 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 relative z-10 gap-4">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-300 fill-yellow-300 animate-pulse" />
              <h2 className="text-3xl font-bold italic tracking-wider">FLASH SALE</h2>
            </div>
            <div className="flex items-center gap-3 font-mono text-xl">
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
              <span>:</span>
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <span>:</span>
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg font-bold text-yellow-300">{String(timeLeft.seconds).padStart(2, '0')}</div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/10 rounded-2xl p-4 h-72 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
              {items.slice(0, 4).map((item) => {
                const minPrice = Math.min(...item.variants.map((v) => v.effectivePrice))
                return (
                  <Link href={`/products/${item.slug}`} key={item.id} className="bg-white rounded-2xl p-4 text-slate-900 group hover:-translate-y-1 transition-transform">
                    <div className="aspect-square relative mb-4 rounded-xl overflow-hidden bg-slate-50">
                      <img src={item.image || 'https://placehold.co/400x400/png'} alt={item.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        -15%
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{item.brand}</p>
                      <h3 className="font-semibold line-clamp-2 min-h-[3rem] group-hover:text-blue-600 transition-colors">{item.name}</h3>
                      <div className="pt-2">
                        <p className="font-bold text-red-600 text-lg">{formatPrice(minPrice)}</p>
                        <p className="text-sm text-slate-400 line-through">{formatPrice(minPrice * 1.15)}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>

        {/* Best Sellers Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Sản Phẩm Bán Chạy</h2>
            <Link href="/products?sort=popular" className="flex items-center text-blue-600 font-medium hover:text-blue-700">
              Xem tất cả <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
          
          {loading ? (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-slate-100 rounded-2xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-500">Chưa có sản phẩm nào. Vui lòng thêm sản phẩm từ Admin Dashboard.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {items.map((item) => {
                const minPrice = Math.min(...item.variants.map((v) => v.effectivePrice))
                return (
                  <Link href={`/products/${item.slug}`} key={item.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group flex flex-col h-full">
                    <div className="aspect-square relative mb-4 rounded-xl overflow-hidden bg-slate-50">
                      <img src={item.image || 'https://placehold.co/400x400/png'} alt={item.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">{item.brand}</p>
                      <h3 className="font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors flex-1">{item.name}</h3>
                      <div className="flex items-center gap-1 mt-2 mb-3">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-slate-700">{item.avgRating.toFixed(1)}</span>
                        <span className="text-xs text-slate-400">(128)</span>
                      </div>
                      <div className="mt-auto">
                        <p className="font-bold text-blue-600 text-lg">{formatPrice(minPrice)}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
