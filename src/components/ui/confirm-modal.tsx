'use client'

import React from 'react'
import { AlertTriangle, HelpCircle, CheckCircle, X } from 'lucide-react'
import { Button } from './button'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'primary' | 'warning'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Xác nhận (YES)',
  cancelText = 'Hủy bỏ (NO)',
  type = 'primary',
  onConfirm,
  onCancel
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative space-y-4">
        
        {/* Close Button */}
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full flex-shrink-0 ${
            type === 'danger' ? 'bg-red-100 text-red-600' :
            type === 'warning' ? 'bg-amber-100 text-amber-600' :
            'bg-blue-100 text-blue-600'
          }`}>
            {type === 'danger' && <AlertTriangle className="w-6 h-6" />}
            {type === 'warning' && <HelpCircle className="w-6 h-6" />}
            {type === 'primary' && <CheckCircle className="w-6 h-6" />}
          </div>

          <div className="space-y-1 pr-6">
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="px-5 border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            {cancelText}
          </Button>
          <Button 
            variant={type === 'danger' ? 'danger' : 'default'}
            onClick={onConfirm}
            className="px-5 font-semibold"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
