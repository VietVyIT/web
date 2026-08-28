'use client'

import * as React from 'react'
import { Drawer } from './ui/drawer'
import { useCartStore } from '@/store/cartStore'
import { ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'
import Image from 'next/image'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCartStore()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`Giỏ hàng (${getItemCount()})`}>
      <div className="flex flex-col h-full">
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-slate-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-slate-900">Giỏ hàng trống</h3>
              <p className="text-sm text-slate-500">Chưa có sản phẩm nào trong giỏ hàng của bạn.</p>
            </div>
            <Button onClick={onClose} className="mt-4">
              Tiếp tục mua sắm
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-4 p-3 bg-white border rounded-xl shadow-sm">
                  <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                    {/* Placeholder for real image */}
                    <Image src={item.image || 'https://placehold.co/100x100/png'} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-medium text-slate-900 line-clamp-1">{item.name}</h4>
                      <div className="text-sm text-slate-500 mt-0.5">
                        {item.color && <span>{item.color}</span>}
                        {item.color && item.memory && <span className="mx-1">•</span>}
                        {item.memory && <span>{item.memory}</span>}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-semibold text-blue-600">{formatPrice(item.price)}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.variantId, Math.max(1, item.quantity - 1))}
                          className="p-1 text-slate-500 hover:bg-slate-100 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="p-1 text-slate-500 hover:bg-slate-100 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="self-start p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t bg-slate-50 space-y-4">
              <div className="flex justify-between items-center text-slate-900 font-semibold text-lg">
                <span>Tổng tiền:</span>
                <span className="text-blue-600">{formatPrice(getTotal())}</span>
              </div>
              <Link href="/checkout" passHref legacyBehavior>
                <Button className="w-full h-12 text-base" onClick={onClose}>
                  Thanh toán ngay
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </Drawer>
  )
}
