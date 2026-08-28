'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Filter, Grid3X3, List as ListIcon, Search, ChevronDown, SlidersHorizontal, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface ProductItem {
  id: string
  name: string
  slug: string
  modelCode: string
  brand: string
  category: string
  avgRating: number
  image?: string
  variants: Array<{ effectivePrice: number; stock: number }>
}

export default function ProductsPage() {
  const [items, setItems] = useState<ProductItem[]>([])
  const [keyword, setKeyword] = useState('')
  const [sort, setSort] = useState('newest')
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Filters
  const [brandFilter, setBrandFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [priceRange, setPriceRange] = useState<[string, string]>(['', ''])
  
  // Mobile Filter Drawer
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const searchParams = useSearchParams()

  const loadProducts = async (currentKeyword?: string, currentCategory?: string) => {
    setLoading(true)
    const params = new URLSearchParams()
    const queryTerm = currentKeyword !== undefined ? currentKeyword : keyword
    const catTerm = currentCategory !== undefined ? currentCategory : categoryFilter

    if (queryTerm) params.set('q', queryTerm)
    if (catTerm) params.set('category', catTerm)
    if (sort) params.set('sort', sort)
    if (priceRange[0]) params.set('minPrice', priceRange[0])
    if (priceRange[1]) params.set('maxPrice', priceRange[1])

    try {
      const response = await fetch(`/api/products?${params.toString()}`)
      if (response.ok) {
        const payload = await response.json()
        setItems(payload)
      } else {
        setItems([])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const qParam = searchParams.get('q') || ''
    const catParam = searchParams.get('category') || ''
    const sortParam = searchParams.get('sort') || 'newest'
    
    setKeyword(qParam)
    setCategoryFilter(catParam)
    setSort(sortParam)

    loadProducts(qParam, catParam)
  }, [searchParams])

  const brands = useMemo(() => Array.from(new Set(items.map((i) => i.brand))), [items])
  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items])

  const filteredItems = items.filter((item) => {
    if (brandFilter && item.brand !== brandFilter) return false
    if (categoryFilter && item.category !== categoryFilter) return false
    return true
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫'
  }

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    loadProducts()
  }

  const Sidebar = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5" /> Bộ lọc tìm kiếm
        </h3>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tên sản phẩm..."
              className="pl-9"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input 
              type="number"
              placeholder="Giá từ"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([e.target.value, priceRange[1]])}
            />
            <Input 
              type="number"
              placeholder="Đến"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
            />
          </div>
          <Button type="submit" className="w-full">Áp dụng giá</Button>
        </form>
      </div>

      <div>
        <h4 className="font-medium text-slate-900 mb-3">Thương hiệu</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="brand" 
              checked={brandFilter === ''} 
              onChange={() => setBrandFilter('')}
              className="rounded-full text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-600">Tất cả</span>
          </label>
          {brands.map(brand => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="brand" 
                checked={brandFilter === brand} 
                onChange={() => setBrandFilter(brand)}
                className="rounded-full text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-600">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-slate-900 mb-3">Danh mục</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="category" 
              checked={categoryFilter === ''} 
              onChange={() => setCategoryFilter('')}
              className="rounded-full text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-600">Tất cả</span>
          </label>
          {categories.map(cat => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="category" 
                checked={categoryFilter === cat} 
                onChange={() => setCategoryFilter(cat)}
                className="rounded-full text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-600">{cat}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="text-sm text-slate-500 mb-8">
        <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900 font-medium">Sản phẩm</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Mobile Filter Trigger */}
        <div className="lg:hidden flex items-center justify-between mb-4">
          <Button variant="outline" onClick={() => setIsFilterOpen(true)}>
            <SlidersHorizontal className="w-4 h-4 mr-2" /> Bộ lọc
          </Button>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <Sidebar />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500">
              Hiển thị <strong className="text-slate-900">{filteredItems.length}</strong> sản phẩm
            </p>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={cn("p-1.5 rounded-md transition-colors", viewMode === 'grid' ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-900")}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={cn("p-1.5 rounded-md transition-colors", viewMode === 'list' ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-900")}
                >
                  <ListIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="relative w-full sm:w-48">
                <select 
                  value={sort} 
                  onChange={(e) => { setSort(e.target.value); loadProducts() }}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price_asc">Giá tăng dần</option>
                  <option value="price_desc">Giá giảm dần</option>
                  <option value="rating_desc">Đánh giá cao</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Product Grid/List */}
          {loading ? (
            <div className={cn("grid gap-6", viewMode === 'grid' ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4" : "grid-cols-1")}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-100"></div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">Không tìm thấy sản phẩm</h3>
              <p className="text-slate-500 mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              <Button variant="outline" className="mt-4" onClick={() => {
                setBrandFilter(''); setCategoryFilter(''); setKeyword(''); setPriceRange(['', '']); loadProducts();
              }}>
                Xóa bộ lọc
              </Button>
            </div>
          ) : (
            <div className={cn(
              "grid gap-6",
              viewMode === 'grid' ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
            )}>
              {filteredItems.map(item => {
                const lowPrice = Math.min(...item.variants.map((v) => v.effectivePrice))
                return (
                  <Link 
                    href={`/products/${item.slug}`} 
                    key={item.id} 
                    className={cn(
                      "bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group flex",
                      viewMode === 'grid' ? "flex-col h-full" : "flex-row gap-6 items-center"
                    )}
                  >
                    <div className={cn(
                      "relative rounded-xl overflow-hidden bg-slate-50 flex-shrink-0",
                      viewMode === 'grid' ? "aspect-square w-full mb-4" : "w-40 h-40"
                    )}>
                      <img src={item.image || 'https://placehold.co/400x400/png'} alt={item.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">{item.brand}</p>
                      <h3 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                      <div className="flex items-center gap-1 mt-2 mb-3">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-slate-700">{item.avgRating.toFixed(1)}</span>
                      </div>
                      <div className={cn("mt-auto", viewMode === 'list' && "flex items-center justify-between")}>
                        <p className="font-bold text-blue-600 text-lg">{formatPrice(lowPrice)}</p>
                        {viewMode === 'list' && (
                           <Button size="sm">Xem chi tiết</Button>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsFilterOpen(false)}></div>
          <div className="relative w-[80%] max-w-sm bg-white h-full overflow-y-auto p-6">
            <button onClick={() => setIsFilterOpen(false)} className="absolute top-4 right-4 text-slate-500">
              Đóng
            </button>
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  )
}
