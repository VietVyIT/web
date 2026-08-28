'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ChevronRight, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProductDetail {
  id: string
  name: string
  slug: string
  modelCode: string
  brand: string
  image?: string
  specs: Record<string, string> | null
  variants: Array<{ effectivePrice: number }>
}

export default function ComparePage() {
  const [products, setProducts] = useState<ProductDetail[]>([])
  const [loading, setLoading] = useState(true)

  // In a real app, you would fetch products based on IDs stored in localStorage or Context
  useEffect(() => {
    const fetchDemoProducts = async () => {
      try {
        const response = await fetch('/api/products')
        const payload = await response.json()
        setProducts(payload.slice(0, 2)) // Just take first two for demo
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchDemoProducts()
  }, [])

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id))
  }

  // Extract all unique spec keys from all products
  const allSpecKeys = Array.from(new Set(
    products.flatMap(p => p.specs ? Object.keys(p.specs) : [])
  ))

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-sm text-slate-500 mb-8 flex items-center">
        <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-slate-900 font-medium">So sánh sản phẩm</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-8">So sánh chi tiết thiết bị</h1>

      {loading ? (
        <div className="animate-pulse flex gap-6">
          <div className="flex-1 bg-slate-100 h-[600px] rounded-2xl"></div>
          <div className="flex-1 bg-slate-100 h-[600px] rounded-2xl"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-medium text-slate-900 mb-2">Chưa có sản phẩm nào để so sánh</h2>
          <p className="text-slate-500 mb-6">Vui lòng thêm sản phẩm vào danh sách so sánh từ trang chi tiết.</p>
          <Link href="/products">
            <Button>Tiếp tục mua sắm</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr>
                <th className="p-6 border-b border-r border-slate-200 w-64 bg-slate-50 align-top">
                  <div className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Tính năng</div>
                  <h3 className="text-lg font-bold text-slate-900">Thông số kỹ thuật</h3>
                </th>
                {products.map(product => {
                  const minPrice = product.variants ? Math.min(...product.variants.map(v => v.effectivePrice)) : 0
                  return (
                    <th key={product.id} className="p-6 border-b border-r border-slate-200 last:border-r-0 relative group min-w-[280px]">
                      <button 
                        onClick={() => removeProduct(product.id)}
                        className="absolute top-4 right-4 p-1.5 bg-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="aspect-square w-32 mx-auto mb-4 bg-slate-50 rounded-xl flex items-center justify-center p-2">
                         <img src={product.image || 'https://placehold.co/400x400/png'} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                      <Link href={`/products/${product.slug}`} className="hover:text-blue-600">
                        <h4 className="text-lg font-bold text-slate-900 line-clamp-2 text-center leading-tight mb-2">{product.name}</h4>
                      </Link>
                      <p className="text-center font-bold text-red-600 text-xl">{formatPrice(minPrice)}</p>
                    </th>
                  )
                })}
                {products.length < 3 && (
                  <th className="p-6 border-b border-slate-200 bg-slate-50/50 align-middle text-center min-w-[280px]">
                    <Button variant="outline" className="h-32 w-32 border-dashed flex flex-col gap-2 mx-auto">
                      <Plus className="w-6 h-6 text-slate-400" />
                      <span className="text-xs text-slate-500 font-medium">Thêm sản phẩm</span>
                    </Button>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {/* Specs Rows */}
              {allSpecKeys.map((key, index) => (
                <tr key={key} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="p-4 border-r border-slate-200 font-medium text-slate-700 capitalize w-64 border-b">
                    {key.replace(/_/g, ' ')}
                  </td>
                  {products.map(product => (
                    <td key={`${product.id}-${key}`} className="p-4 border-r border-slate-200 last:border-r-0 border-b text-slate-600">
                      {product.specs?.[key] || '-'}
                    </td>
                  ))}
                  {products.length < 3 && (
                    <td className="p-4 border-slate-200 bg-slate-50/50 border-b"></td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
