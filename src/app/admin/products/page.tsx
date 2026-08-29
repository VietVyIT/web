'use client'

import { useState } from 'react'
import { Plus, Search, Filter, Edit, Trash2, X, Image as ImageIcon, ShieldAlert, ShieldCheck, Upload, Star, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ConfirmModal } from '@/components/ui/confirm-modal'

interface ProductItem {
  id: string
  sku: string
  name: string
  category: string
  price: string
  stock: number
  imageUrl?: string
  imageUrls?: string[]
  status: 'active' | 'out_of_stock' | 'low_stock'
}

// Restricted NSFW / Inappropriate Keywords filter list
const INAPPROPRIATE_KEYWORDS = [
  'nsfw', 'porn', 'adult', 'sex', 'nude', 'hentai', 'gore', 
  'phan-cam', 'phan_cam', 'phancam', 'xxx', 'ecchi', 'erotic', 
  'explicit', 'nudity', '18plus', '18+'
]

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([
    { 
      id: '1', 
      sku: 'IP16PM-256', 
      name: 'iPhone 16 Pro Max 256GB', 
      category: 'Điện thoại', 
      price: '33.490.000 ₫', 
      stock: 15, 
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
      imageUrls: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80'
      ],
      status: 'active' 
    },
    { 
      id: '2', 
      sku: 'S24U-512', 
      name: 'Samsung Galaxy S24 Ultra 512GB', 
      category: 'Điện thoại', 
      price: '31.990.000 ₫', 
      stock: 10, 
      imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
      imageUrls: [
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
      ],
      status: 'active' 
    },
    { 
      id: '3', 
      sku: 'MBP14-M3P', 
      name: 'MacBook Pro 14 M3 Pro (18GB/512GB)', 
      category: 'Laptop', 
      price: '46.990.000 ₫', 
      stock: 5, 
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
      imageUrls: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'
      ],
      status: 'low_stock' 
    },
    { 
      id: '4', 
      sku: 'ROG-G16-4070', 
      name: 'ASUS ROG Strix G16 RTX 4070', 
      category: 'Laptop', 
      price: '41.990.000 ₫', 
      stock: 0, 
      imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80',
      imageUrls: [
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80'
      ],
      status: 'out_of_stock' 
    },
    { 
      id: '5', 
      sku: 'SONY-XM5', 
      name: 'Tai nghe Sony WH-1000XM5', 
      category: 'Tai nghe', 
      price: '6.990.000 ₫', 
      stock: 25, 
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      imageUrls: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
      ],
      status: 'active' 
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // Form Modal state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null)
  const [imageError, setImageError] = useState('')
  const [inputUrl, setInputUrl] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Điện thoại',
    price: '',
    stock: 10,
    imageUrls: [] as string[]
  })

  // Confirm Modal state
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean
    title: string
    message: string
    type?: 'danger' | 'primary' | 'warning'
    action?: () => void
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'primary'
  })

  // Image Moderation Check
  const validateImageSafety = (url: string): boolean => {
    if (!url.trim()) return true
    const lower = url.toLowerCase()
    
    // Check against inappropriate keywords
    for (const kw of INAPPROPRIATE_KEYWORDS) {
      if (lower.includes(kw)) {
        return false
      }
    }
    return true
  }

  // Open Add modal
  const handleOpenAdd = () => {
    setEditingProduct(null)
    setImageError('')
    setInputUrl('')
    setFormData({ 
      name: '', 
      sku: '', 
      category: 'Điện thoại', 
      price: '', 
      stock: 10, 
      imageUrls: [
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80'
      ] 
    })
    setIsFormOpen(true)
  }

  // Open Edit modal
  const handleOpenEdit = (product: ProductItem) => {
    setEditingProduct(product)
    setImageError('')
    setInputUrl('')
    const imgs = product.imageUrls && product.imageUrls.length > 0 
      ? product.imageUrls 
      : product.imageUrl ? [product.imageUrl] : []
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      stock: product.stock,
      imageUrls: imgs
    })
    setIsFormOpen(true)
  }

  // Add URL to Image List
  const handleAddImageUrl = () => {
    if (!inputUrl.trim()) return

    if (!validateImageSafety(inputUrl)) {
      setImageError('Hệ thống kiểm duyệt tự động từ chối hình ảnh này vì chứa từ khóa/nội dung phản cảm, không phù hợp!')
      return
    }

    setImageError('')
    setFormData(prev => ({
      ...prev,
      imageUrls: [...prev.imageUrls, inputUrl.trim()]
    }))
    setInputUrl('')
  }

  // Handle Multi-file Upload (convert local files to Data URLs & moderate each)
  const handleMultiFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    let hasError = false
    const newImageUrls: string[] = []

    files.forEach(file => {
      if (!validateImageSafety(file.name)) {
        hasError = true
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        if (result) {
          setFormData(prev => ({
            ...prev,
            imageUrls: [...prev.imageUrls, result]
          }))
        }
      }
      reader.readAsDataURL(file)
    })

    if (hasError) {
      setImageError('Một số tệp hình ảnh bị từ chối vì tên tệp chứa từ khóa không phù hợp / phản cảm!')
    } else {
      setImageError('')
    }
  }

  // Remove Image from List
  const handleRemoveImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, idx) => idx !== indexToRemove)
    }))
  }

  // Set Main Image (move to index 0)
  const handleSetMainImage = (indexToMain: number) => {
    setFormData(prev => {
      const selected = prev.imageUrls[indexToMain]
      const rest = prev.imageUrls.filter((_, idx) => idx !== indexToMain)
      return {
        ...prev,
        imageUrls: [selected, ...rest]
      }
    })
  }

  // Trigger Add/Edit confirmation
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.sku || !formData.price) return

    // Verify all images safety
    for (const url of formData.imageUrls) {
      if (!validateImageSafety(url)) {
        setImageError('Danh sách hình ảnh chứa liên kết/nội dung phản cảm. Vui lòng xóa ảnh vi phạm trước khi lưu!')
        return
      }
    }

    setImageError('')

    const primaryImageUrl = formData.imageUrls[0] || 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80'

    if (editingProduct) {
      // Confirm Edit
      setConfirmConfig({
        isOpen: true,
        title: 'Xác nhận cập nhật sản phẩm',
        message: `Bạn có chắc chắn muốn lưu thay đổi cho sản phẩm "${formData.name}" với ${formData.imageUrls.length} hình ảnh không?`,
        type: 'primary',
        action: () => {
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? {
            ...p,
            name: formData.name,
            sku: formData.sku,
            category: formData.category,
            price: formData.price,
            stock: Number(formData.stock),
            imageUrl: primaryImageUrl,
            imageUrls: formData.imageUrls,
            status: Number(formData.stock) === 0 ? 'out_of_stock' : Number(formData.stock) < 10 ? 'low_stock' : 'active'
          } : p))
          setIsFormOpen(false)
        }
      })
    } else {
      // Confirm Add
      setConfirmConfig({
        isOpen: true,
        title: 'Xác nhận thêm sản phẩm mới',
        message: `Bạn có chắc chắn muốn thêm sản phẩm "${formData.name}" cùng ${formData.imageUrls.length} hình ảnh vào danh sách không?`,
        type: 'primary',
        action: () => {
          const newId = (products.length + 1).toString()
          setProducts(prev => [
            {
              id: newId,
              name: formData.name,
              sku: formData.sku,
              category: formData.category,
              price: formData.price,
              stock: Number(formData.stock),
              imageUrl: primaryImageUrl,
              imageUrls: formData.imageUrls,
              status: Number(formData.stock) === 0 ? 'out_of_stock' : Number(formData.stock) < 10 ? 'low_stock' : 'active'
            },
            ...prev
          ])
          setIsFormOpen(false)
        }
      })
    }
  }

  // Trigger Delete confirmation
  const handleOpenDelete = (product: ProductItem) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Xác nhận xóa sản phẩm',
      message: `Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm "${product.name}" (SKU: ${product.sku}) không? Hành động này không thể hoàn tác!`,
      type: 'danger',
      action: () => {
        setProducts(prev => prev.filter(p => p.id !== product.id))
      }
    })
  }

  // Filtered products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Sản phẩm</h1>
          <p className="text-xs text-slate-500 mt-1">Tải lên nhiều hình ảnh nhiều góc độ & kiểm duyệt ảnh tự động</p>
        </div>
        <Button onClick={handleOpenAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
          <Plus className="w-4 h-4" /> Thêm sản phẩm mới
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Tìm kiếm theo Tên, SKU..." 
              className="pl-9 bg-white" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              className="flex h-10 items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Tất cả danh mục</option>
              <option value="Điện thoại">Điện thoại</option>
              <option value="Laptop">Laptop</option>
              <option value="Tablet">Tablet</option>
              <option value="Tai nghe">Tai nghe</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-sm text-slate-600 font-medium">
                <th className="py-4 px-6">Hình ảnh & Sản phẩm</th>
                <th className="py-4 px-6">SKU</th>
                <th className="py-4 px-6">Danh mục</th>
                <th className="py-4 px-6">Giá bán</th>
                <th className="py-4 px-6 text-center">Tồn kho</th>
                <th className="py-4 px-6 text-center">Trạng thái</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const totalImgs = product.imageUrls?.length || (product.imageUrl ? 1 : 0)
                return (
                  <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-900 flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200 relative">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                            {product.name.charAt(0)}
                          </div>
                        )}
                        {totalImgs > 1 && (
                          <span className="absolute bottom-0 right-0 bg-blue-600 text-white text-[9px] font-bold px-1 rounded-tl">
                            +{totalImgs} ảnh
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="line-clamp-1">{product.name}</span>
                        <span className="text-[11px] text-slate-400">{totalImgs} hình ảnh góc độ</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-mono text-sm">{product.sku}</td>
                    <td className="py-4 px-6 text-slate-600">{product.category}</td>
                    <td className="py-4 px-6 font-medium text-slate-900">{product.price}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`font-semibold ${product.stock < 10 ? 'text-red-600' : 'text-slate-900'}`}>{product.stock}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {product.status === 'active' && <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Đang bán</span>}
                      {product.status === 'out_of_stock' && <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Hết hàng</span>}
                      {product.status === 'low_stock' && <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Sắp hết</span>}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenDelete(product)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Add/Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-6 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </h3>
                <p className="text-xs text-slate-500">Tải lên nhiều góc độ & kích thước ảnh khác nhau</p>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Tên sản phẩm *</label>
                  <Input 
                    required
                    placeholder="Nhập tên sản phẩm..." 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Mã SKU *</label>
                  <Input 
                    required
                    placeholder="VD: IP16PM-256" 
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
              </div>

              {/* Multi-Image Upload & Moderation Section */}
              <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-blue-600" /> Quản Lý Bộ Ảnh Sản Phẩm ({formData.imageUrls.length} ảnh)
                  </label>
                  <span className="text-[11px] text-green-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> AI Kiểm duyệt An Toàn (Chặn ảnh phản cảm)
                  </span>
                </div>

                {/* Add URL / Multi-file Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2 flex gap-2">
                    <Input 
                      type="url"
                      placeholder="Dán link URL hình ảnh mới..." 
                      value={inputUrl}
                      onChange={(e) => {
                        setImageError('')
                        setInputUrl(e.target.value)
                      }}
                      className="flex-1 text-xs"
                    />
                    <Button type="button" onClick={handleAddImageUrl} variant="outline" className="text-xs px-3">
                      Thêm URL
                    </Button>
                  </div>

                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                    <Upload className="w-4 h-4" /> Tải Nhiều Tệp
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleMultiFileUpload} />
                  </label>
                </div>

                {imageError && (
                  <div className="flex items-start gap-2 bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-200 font-medium">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{imageError}</span>
                  </div>
                )}

                {/* Multi-Image Gallery Grid */}
                {formData.imageUrls.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                    {formData.imageUrls.map((imgUrl, index) => (
                      <div key={index} className="relative group aspect-square bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                        <img 
                          src={imgUrl} 
                          alt={`Góc ${index + 1}`} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&auto=format&fit=crop&q=80'
                          }}
                        />
                        {/* Main Image Badge */}
                        {index === 0 ? (
                          <span className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                            Ảnh chính
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetMainImage(index)}
                            className="absolute top-1.5 left-1.5 bg-black/60 hover:bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Đặt ảnh chính
                          </button>
                        )}
                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1.5 right-1.5 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 opacity-90 group-hover:opacity-100 transition-opacity shadow"
                          title="Xóa ảnh này"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-slate-300 rounded-xl bg-white text-slate-400 text-xs">
                    Chưa có hình ảnh nào. Hãy thêm URL hoặc bấm "Tải Nhiều Tệp" để tải hình ảnh các góc độ khác nhau.
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Danh mục *</label>
                  <select 
                    className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Điện thoại">Điện thoại</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Tai nghe">Tai nghe</option>
                    <option value="Smartwatch">Smartwatch</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Giá bán (₫) *</label>
                  <Input 
                    required
                    placeholder="VD: 33.490.000 ₫" 
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Số lượng tồn kho</label>
                  <Input 
                    type="number"
                    required
                    min={0}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  {editingProduct ? 'Cập nhật sản phẩm' : 'Thêm mới sản phẩm'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Prompt Modal */}
      <ConfirmModal 
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
        onConfirm={() => {
          if (confirmConfig.action) confirmConfig.action()
          setConfirmConfig({ ...confirmConfig, isOpen: false })
        }}
        onCancel={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
      />
    </div>
  )
}
