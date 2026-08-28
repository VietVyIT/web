import Link from 'next/link'
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 border-b border-slate-800 pb-12">
        
        {/* Brand & About */}
        <div className="space-y-4">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent inline-block mb-2">
            TechStore
          </Link>
          <p className="text-sm leading-relaxed text-slate-400">
            Nền tảng mua sắm thiết bị công nghệ hàng đầu, cam kết chính hãng, giá tốt nhất và dịch vụ bảo hành chuyên nghiệp.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-6">Sản phẩm</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/products?category=dien-thoai" className="hover:text-blue-400 transition-colors">Điện thoại di động</Link></li>
            <li><Link href="/products?category=laptop" className="hover:text-blue-400 transition-colors">Laptop & Macbook</Link></li>
            <li><Link href="/products?category=tablet" className="hover:text-blue-400 transition-colors">Máy tính bảng</Link></li>
            <li><Link href="/products?category=phu-kien" className="hover:text-blue-400 transition-colors">Phụ kiện công nghệ</Link></li>
            <li><Link href="/products?category=am-thanh" className="hover:text-blue-400 transition-colors">Thiết bị âm thanh</Link></li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="text-white font-semibold mb-6">Hỗ trợ khách hàng</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/warranty" className="hover:text-blue-400 transition-colors">Tra cứu bảo hành</Link></li>
            <li><Link href="#" className="hover:text-blue-400 transition-colors">Chính sách đổi trả</Link></li>
            <li><Link href="#" className="hover:text-blue-400 transition-colors">Hướng dẫn mua trả góp</Link></li>
            <li><Link href="#" className="hover:text-blue-400 transition-colors">Chính sách vận chuyển</Link></li>
            <li><Link href="#" className="hover:text-blue-400 transition-colors">Câu hỏi thường gặp (FAQ)</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-semibold mb-6">Liên hệ</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>123 Đường Công Nghệ, Phường Đổi Mới, Quận Sáng Tạo, TP. Hồ Chí Minh</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <span>1900 1234 (Miễn phí cuộc gọi)</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <span>support@techstore.vn</span>
            </li>
          </ul>
        </div>

      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <p>© 2026 TechStore. Tất cả các quyền được bảo lưu.</p>
        <div className="flex gap-4">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6 opacity-60 hover:opacity-100 transition-opacity" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-6 opacity-60 hover:opacity-100 transition-opacity" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-60 hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </footer>
  )
}
