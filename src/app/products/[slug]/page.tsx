'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { ChevronRight, Minus, Plus, ShoppingCart, Star, ShieldCheck, Truck, RotateCcw, Heart, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cartStore'
import { readToken } from '@/lib/client-auth'
import { cn } from '@/lib/utils'

interface ProductDetail {
  id: string
  name: string
  slug: string
  modelCode: string
  description: string | null
  specs: Record<string, string> | null
  brand: string
  category: string
  image?: string
  variants: Array<{
    id: string
    sku: string
    color: string | null
    memory: string | null
    listedPrice: number
    salePrice: number | null
    stock: number
  }>
  reviews: Array<{
    id: string
    rating: number
    comment: string | null
    author: string
    createdAt: string
  }>
}

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  
  // Selection state
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedMemory, setSelectedMemory] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'reviews'>('specs')

  const { addItem } = useCartStore()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.slug}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
          
          // Auto-select first available options
          if (data.variants && data.variants.length > 0) {
            const firstVariant = data.variants[0]
            if (firstVariant.color) setSelectedColor(firstVariant.color)
            if (firstVariant.memory) setSelectedMemory(firstVariant.memory)
          }
        } else {
          setMessage('Không thể tải sản phẩm.')
        }
      } catch (error) {
        setMessage('Lỗi khi tải dữ liệu.')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [params.slug])

  // Extract unique colors and memories
  const colors = useMemo(() => {
    if (!product) return []
    return Array.from(new Set(product.variants.map(v => v.color).filter(Boolean))) as string[]
  }, [product])

  const memories = useMemo(() => {
    if (!product) return []
    return Array.from(new Set(product.variants.map(v => v.memory).filter(Boolean))) as string[]
  }, [product])

  // Find active variant based on selection
  const activeVariant = useMemo(() => {
    if (!product) return null
    return product.variants.find(
      v => (v.color === selectedColor || (!v.color && !selectedColor)) && 
           (v.memory === selectedMemory || (!v.memory && !selectedMemory))
    ) || product.variants[0]
  }, [product, selectedColor, selectedMemory])

  const effectivePrice = activeVariant?.salePrice ?? activeVariant?.listedPrice ?? 0
  const listedPrice = activeVariant?.listedPrice ?? 0
  const discountPct = listedPrice > effectivePrice ? Math.round(((listedPrice - effectivePrice) / listedPrice) * 100) : 0

  const handleAddToCart = () => {
    if (!activeVariant) return
    
    addItem({
      variantId: activeVariant.id,
      productId: product!.id,
      name: product!.name,
      slug: product!.slug,
      image: product!.image || 'https://placehold.co/400x400/png',
      price: Number(effectivePrice),
      color: activeVariant.color || undefined,
      memory: activeVariant.memory || undefined,
      quantity: quantity
    })
    
    // In a real app, we might want to trigger a toast here or open the drawer
    setMessage('Đã thêm vào giỏ hàng!')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/checkout')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫'
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-slate-100 rounded-2xl h-[500px] animate-pulse"></div>
          <div className="space-y-6">
            <div className="bg-slate-100 rounded-lg h-10 w-3/4 animate-pulse"></div>
            <div className="bg-slate-100 rounded-lg h-8 w-1/2 animate-pulse"></div>
            <div className="bg-slate-100 rounded-lg h-32 animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Không tìm thấy sản phẩm</h2>
        <p className="text-slate-500 mb-6">{message}</p>
        <Link href="/products">
          <Button>Quay lại danh sách</Button>
        </Link>
      </div>
    )
  }

  const avgRating = product.reviews.length > 0 
    ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length 
    : 0

  return (
    <div className="bg-slate-50 py-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href={`/products?category=${product.category}`} className="hover:text-blue-600 capitalize">{product.category}</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-slate-900 font-medium truncate">{product.name}</span>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100">
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Left: Images */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden group">
                <img 
                  src={product.image || 'https://placehold.co/800x800/png'} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 origin-center cursor-zoom-in"
                />
                {discountPct > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full text-sm">
                    Giảm {discountPct}%
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:border-blue-500 overflow-hidden">
                    <img src={product.image || 'https://placehold.co/100x100/png'} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Info */}
            <div className="flex flex-col">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">{product.brand}</span>
                  <div className="flex items-center gap-4">
                    <button className="text-slate-400 hover:text-red-500 transition-colors"><Heart className="w-5 h-5" /></button>
                    <button className="text-slate-400 hover:text-blue-500 transition-colors"><Share2 className="w-5 h-5" /></button>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-3">{product.name}</h1>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-slate-900">{avgRating.toFixed(1)}</span>
                    <span>({product.reviews.length} đánh giá)</span>
                  </div>
                  <span>|</span>
                  <span>Model: <span className="font-medium">{product.modelCode}</span></span>
                  <span>|</span>
                  <span className="text-green-600 font-medium">Còn {activeVariant?.stock || 0} sản phẩm</span>
                </div>
              </div>

              <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-4xl font-bold text-red-600">{formatPrice(Number(effectivePrice))}</span>
                  {discountPct > 0 && (
                    <span className="text-lg text-slate-400 line-through mb-1">{formatPrice(Number(listedPrice))}</span>
                  )}
                </div>
              </div>

              {/* Variants */}
              <div className="space-y-6 mb-8">
                {memories.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 mb-3">Tùy chọn cấu hình</h3>
                    <div className="flex flex-wrap gap-3">
                      {memories.map(mem => (
                        <button
                          key={mem}
                          onClick={() => setSelectedMemory(mem)}
                          className={cn(
                            "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                            selectedMemory === mem 
                              ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600" 
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                          )}
                        >
                          {mem}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {colors.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 mb-3">Tùy chọn màu sắc</h3>
                    <div className="flex flex-wrap gap-3">
                      {colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={cn(
                            "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                            selectedColor === color 
                              ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600" 
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                          )}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 mt-auto mb-8">
                <div className="flex items-center border border-slate-200 rounded-lg bg-white p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="flex-1 h-12 text-blue-600 border-blue-600 hover:bg-blue-50"
                  onClick={handleAddToCart}
                  disabled={!activeVariant || activeVariant.stock < 1}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Thêm vào giỏ
                </Button>
                <Button 
                  size="lg" 
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
                  onClick={handleBuyNow}
                  disabled={!activeVariant || activeVariant.stock < 1}
                >
                  Mua ngay
                </Button>
              </div>

              {message && <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-2 mb-4">{message}</div>}

              {/* Perks */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-600">Bảo hành 12 tháng</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-600">Miễn phí giao hàng</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-600">Đổi trả trong 30 ngày</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div className="mt-8 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100">
          <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
            <button 
              className={cn("px-6 py-4 font-medium text-sm border-b-2 whitespace-nowrap transition-colors", activeTab === 'specs' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900")}
              onClick={() => setActiveTab('specs')}
            >
              Thông số kỹ thuật
            </button>
            <button 
              className={cn("px-6 py-4 font-medium text-sm border-b-2 whitespace-nowrap transition-colors", activeTab === 'desc' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900")}
              onClick={() => setActiveTab('desc')}
            >
              Đặc điểm nổi bật
            </button>
            <button 
              className={cn("px-6 py-4 font-medium text-sm border-b-2 whitespace-nowrap transition-colors", activeTab === 'reviews' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900")}
              onClick={() => setActiveTab('reviews')}
            >
              Đánh giá ({product.reviews.length})
            </button>
          </div>

          <div className="min-h-[300px]">
            {activeTab === 'specs' && (
              <div className="max-w-3xl">
                {!product.specs || Object.keys(product.specs).length === 0 ? (
                  <p className="text-slate-500">Đang cập nhật thông số kỹ thuật.</p>
                ) : (
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    {Object.entries(product.specs).map(([key, value], index) => (
                      <div key={key} className={cn("grid grid-cols-3 p-4", index % 2 === 0 ? "bg-slate-50" : "bg-white")}>
                        <div className="font-medium text-slate-600 capitalize">{key.replace(/_/g, ' ')}</div>
                        <div className="col-span-2 text-slate-900">{String(value)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'desc' && (
              <div className="prose prose-slate max-w-none">
                <p>{product.description || 'Đang cập nhật mô tả.'}</p>
                {/* Simulated rich content */}
                <div className="mt-8 bg-slate-100 rounded-2xl p-8 flex items-center justify-center h-64 text-slate-400">
                  <span className="flex items-center gap-2"><Star className="w-5 h-5"/> Hình ảnh minh họa tính năng nổi bật</span>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {product.reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-500 mb-4">Chưa có đánh giá nào cho sản phẩm này.</p>
                    <Button variant="outline">Viết đánh giá đầu tiên</Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {product.reviews.map(review => (
                      <div key={review.id} className="border-b border-slate-100 pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                              {review.author.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{review.author}</p>
                              <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={cn("w-4 h-4", i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300")} />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-700 ml-13 pl-13">{review.comment || 'Người dùng không để lại bình luận.'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
