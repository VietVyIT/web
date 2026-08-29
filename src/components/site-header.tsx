'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { clearSession, readUser, type SessionUser } from '@/lib/client-auth'
import { Search, ShoppingBag, User as UserIcon, Menu, LogOut, X } from 'lucide-react'
import { Button } from './ui/button'
import { useCartStore } from '@/store/cartStore'
import { CartDrawer } from './cart-drawer'
import { Input } from './ui/input'

interface SearchResultItem {
  id: string
  name: string
  slug: string
  brand: string
  image?: string
  variants: Array<{ effectivePrice: number }>
}

export function SiteHeader() {
  const router = useRouter()
  const [user, setUser] = useState<SessionUser | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchResultItem[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const cartItemCount = useCartStore((state) => state.getItemCount())

  useEffect(() => {
    const updateUser = () => setUser(readUser())
    updateUser()
    
    window.addEventListener('auth-change', updateUser)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('auth-change', updateUser)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Fetch live suggestions on query change
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(searchQuery.trim())}`)
        if (res.ok) {
          const data = await res.json()
          setSuggestions(data.slice(0, 5))
          setShowSuggestions(true)
        }
      } catch (e) {
        console.error(e)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setShowSuggestions(false)
    setIsMobileSearchOpen(false)
    router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  return (
    <>
      <header className={`sticky top-0 z-40 w-full transition-all duration-200 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b shadow-sm' : 'bg-white border-b'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 h-16 gap-4">
          
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <button className="lg:hidden p-2 -ml-2 text-slate-600">
              <Menu className="w-6 h-6" />
            </button>
            <Link 
              href="/" 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              TechStore
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8 relative">
            <form onSubmit={handleSearchSubmit} className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors cursor-pointer" onClick={handleSearchSubmit} />
              <Input 
                type="text" 
                placeholder="Tìm kiếm điện thoại, laptop, phụ kiện..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
                className="w-full pl-10 bg-slate-100 border-transparent focus:bg-white rounded-full transition-all h-11"
              />
            </form>

            {/* Autocomplete Suggestions Popup */}
            {showSuggestions && suggestions.length > 0 && (
              <div 
                onMouseDown={(e) => e.preventDefault()}
                className="absolute top-12 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <p className="text-xs font-semibold text-slate-400 px-3 py-1.5 uppercase tracking-wider">Gợi ý sản phẩm</p>
                <div className="space-y-1">
                  {suggestions.map((item) => {
                    const lowPrice = item.variants && item.variants.length > 0 
                      ? Math.min(...item.variants.map(v => v.effectivePrice))
                      : 0
                    return (
                      <div
                        key={item.id}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          setShowSuggestions(false)
                          setIsMobileSearchOpen(false)
                          router.push(`/products/${item.slug}`)
                        }}
                        className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group"
                      >
                        <img 
                          src={item.image || 'https://placehold.co/100x100'} 
                          alt={item.name} 
                          className="w-10 h-10 object-cover rounded-lg bg-slate-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{item.name}</p>
                          <p className="text-xs text-blue-600 font-bold">{new Intl.NumberFormat('vi-VN').format(lowPrice)} ₫</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <button 
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              <Search className="w-5 h-5" />
            </button>

            <div className="hidden md:flex items-center gap-6 mr-2 text-sm font-medium text-slate-600">
              <Link href="/products" className="hover:text-blue-600 transition-colors">Sản phẩm</Link>
              <Link href="/warranty" className="hover:text-blue-600 transition-colors">Tra cứu bảo hành</Link>
            </div>

            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

            {user ? (
              <div className="relative group flex items-center">
                <Link href="/account" className="flex items-center gap-2 hover:text-blue-600 transition-colors bg-slate-100 hover:bg-slate-200 py-1.5 px-3 rounded-full cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm overflow-hidden border border-blue-200 flex-shrink-0">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      user.fullName.charAt(0)
                    )}
                  </div>
                  <span className="text-xs font-semibold max-w-[80px] sm:max-w-[120px] truncate">{user.fullName}</span>
                </Link>

                {/* Dropdown Menu */}
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden translate-y-2 group-hover:translate-y-0">
                  <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                    <p className="font-bold text-slate-900 truncate">{user.fullName}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    {user.role === 'ADMIN' && (
                      <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-xl transition-colors">
                        Trang Quản trị Admin
                      </Link>
                    )}
                    <Link href="/account" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 font-medium hover:bg-slate-50 rounded-xl transition-colors">
                      Tài khoản của tôi
                    </Link>
                    <Link href="/account?tab=orders" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 font-medium hover:bg-slate-50 rounded-xl transition-colors">
                      Đơn hàng mua
                    </Link>
                  </div>
                  <div className="p-2 border-t border-slate-100">
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors"
                      onClick={() => {
                        clearSession()
                        setUser(null)
                        window.location.href = '/'
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Đăng nhập</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="rounded-full hidden sm:flex">Đăng ký</Button>
                </Link>
              </div>
            )}

            <button 
              className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors group"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-5 h-5 group-hover:text-blue-600 transition-colors" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Overlay Input */}
        {isMobileSearchOpen && (
          <div className="lg:hidden p-3 bg-slate-50 border-t border-slate-200 animate-in slide-in-from-top-2">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  autoFocus
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 bg-white h-10"
                />
              </div>
              <Button type="submit" size="sm">Tìm</Button>
              <button 
                type="button" 
                onClick={() => setIsMobileSearchOpen(false)}
                className="p-2 text-slate-500 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </header>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
