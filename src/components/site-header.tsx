'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { clearSession, readUser, type SessionUser } from '@/lib/client-auth'
import { Search, ShoppingBag, User as UserIcon, Menu, LogOut } from 'lucide-react'
import { Button } from './ui/button'
import { useCartStore } from '@/store/cartStore'
import { CartDrawer } from './cart-drawer'
import { Input } from './ui/input'

export function SiteHeader() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const cartItemCount = useCartStore((state) => state.getItemCount())

  useEffect(() => {
    setUser(readUser())
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header className={`sticky top-0 z-40 w-full transition-all duration-200 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b shadow-sm' : 'bg-white border-b'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 h-16 gap-4">
          
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <button className="lg:hidden p-2 -ml-2 text-slate-600">
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TechStore
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8 relative">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <Input 
                type="text" 
                placeholder="Tìm kiếm điện thoại, laptop, phụ kiện..." 
                className="w-full pl-10 bg-slate-100 border-transparent focus:bg-white rounded-full transition-all h-11"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <button className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full">
              <Search className="w-5 h-5" />
            </button>

            <div className="hidden md:flex items-center gap-6 mr-2 text-sm font-medium text-slate-600">
              <Link href="/products" className="hover:text-blue-600 transition-colors">Sản phẩm</Link>
              <Link href="/warranty" className="hover:text-blue-600 transition-colors">Tra cứu bảo hành</Link>
            </div>

            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/account" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="text-sm font-medium max-w-[100px] truncate">{user.fullName}</span>
                </Link>
                <button
                  type="button"
                  className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  onClick={() => {
                    clearSession()
                    setUser(null)
                    window.location.href = '/'
                  }}
                  title="Đăng xuất"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="hidden lg:flex">Đăng nhập</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="rounded-full">Đăng ký</Button>
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
      </header>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
