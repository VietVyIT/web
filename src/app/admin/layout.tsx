import { Metadata } from 'next'
import Link from 'next/link'
import { Home, Package, ShoppingCart, Users, Tag, Settings, LogOut, Search, Bell } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Dashboard - TechStore',
  description: 'Quản trị hệ thống TechStore'
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Link href="/admin" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            TechStore Admin
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            <li>
              <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                <Home className="w-5 h-5" /> Tổng quan
              </Link>
            </li>
            <li>
              <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                <Package className="w-5 h-5" /> Sản phẩm
              </Link>
            </li>
            <li>
              <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                <ShoppingCart className="w-5 h-5" /> Đơn hàng
              </Link>
            </li>
            <li>
              <Link href="/admin/vouchers" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                <Tag className="w-5 h-5" /> Khuyến mãi
              </Link>
            </li>
            <li>
              <Link href="/admin/customers" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                <Users className="w-5 h-5" /> Khách hàng
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white transition-colors">
            <LogOut className="w-5 h-5" /> Thoát về Cửa hàng
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2 w-96">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input type="text" placeholder="Tìm kiếm đơn hàng, sản phẩm..." className="bg-transparent border-none focus:outline-none text-sm w-full" />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                A
              </div>
              <span className="text-sm font-medium text-slate-700">Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
