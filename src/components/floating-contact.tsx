'use client'

import React from 'react'
import { MessageCircle, Phone } from 'lucide-react'

export function FloatingContact() {
  return (
    <div className="fixed right-4 bottom-24 md:bottom-12 z-50 flex flex-col gap-3">
      {/* Zalo Button */}
      <a
        href="https://zalo.me/0123456789" // Example Zalo link
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-12 h-12 bg-[#0068FF] text-white rounded-full shadow-lg hover:scale-110 hover:shadow-[#0068FF]/50 transition-all duration-300 animate-bounce"
        aria-label="Liên hệ qua Zalo"
      >
        <span className="font-bold text-xl">Z</span>
        {/* Tooltip */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 text-white text-sm whitespace-nowrap rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat qua Zalo
        </span>
      </a>

      {/* Messenger Button */}
      <a
        href="https://m.me/techstore" // Example Messenger link
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-[#00c6ff] to-[#0072ff] text-white rounded-full shadow-lg hover:scale-110 hover:shadow-blue-500/50 transition-all duration-300"
        aria-label="Liên hệ qua Messenger"
      >
        <MessageCircle className="w-6 h-6" />
        {/* Tooltip */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 text-white text-sm whitespace-nowrap rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat qua Messenger
        </span>
      </a>
      
      {/* Phone Button */}
      <a
        href="tel:0123456789"
        className="group relative flex items-center justify-center w-12 h-12 bg-emerald-500 text-white rounded-full shadow-lg hover:scale-110 hover:shadow-emerald-500/50 transition-all duration-300"
        aria-label="Gọi điện thoại"
      >
        <Phone className="w-5 h-5" />
        {/* Tooltip */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 text-white text-sm whitespace-nowrap rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          0123.456.789
        </span>
      </a>
    </div>
  )
}
