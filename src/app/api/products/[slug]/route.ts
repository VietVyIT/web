import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MOCK_PRODUCT_DETAILS: Record<string, any> = {
  'iphone-16-pro-max-256gb': {
    id: 'p1',
    name: 'iPhone 16 Pro Max 256GB',
    slug: 'iphone-16-pro-max-256gb',
    modelCode: 'IP16PM-256',
    description: 'iPhone 16 Pro Max 256GB với chip A18 Pro tiến trình 3nm siêu mạnh mẽ, màn hình 6.9 inch Super Retina XDR ProMotion 120Hz, vỏ Titan sa mạc đẳng cấp. Hệ thống camera 48MP Fusion nâng cấp quay video 4K 120fps Dolby Vision đỉnh cao.',
    specs: { 'màn_hình': '6.9 inch Super Retina XDR OLED 120Hz', 'chip': 'Apple A18 Pro 6-core', 'ram': '8 GB', 'bộ_nhớ': '256 GB', 'camera': 'Chính 48 MP & Phụ 48 MP, 12 MP', 'pin': '4685 mAh, Sạc nhanh 30W' },
    brand: 'Apple',
    category: 'Điện thoại',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'v1', sku: 'IP16PM-256-DESERT', color: 'Titan Sa Mạc', memory: '256GB', listedPrice: 34990000, salePrice: 33490000, stock: 15 },
      { id: 'v2', sku: 'IP16PM-256-NATURAL', color: 'Titan Tự Nhiên', memory: '256GB', listedPrice: 34990000, salePrice: 33490000, stock: 20 }
    ],
    reviews: [
      { id: 'r1', rating: 5, comment: 'Máy tuyệt đẹp, titan sa mạc cực kỳ sang trọng, camera chụp đêm siêu nét!', author: 'Nguyễn Văn Anh', createdAt: new Date().toISOString() }
    ]
  },
  'samsung-galaxy-s24-ultra-512gb': {
    id: 'p2',
    name: 'Samsung Galaxy S24 Ultra 512GB',
    slug: 'samsung-galaxy-s24-ultra-512gb',
    modelCode: 'SM-S928B',
    description: 'Samsung Galaxy S24 Ultra sở hữu quyền năng Galaxy AI vượt trội, camera 200MP zoom 100x đỉnh cao đồ họa, khung viền Titan siêu bền bỉ và bút S-Pen tích hợp.',
    specs: { 'màn_hình': '6.8 inch Dynamic AMOLED 2X 120Hz', 'chip': 'Snapdragon 8 Gen 3 for Galaxy', 'ram': '12 GB', 'bộ_nhớ': '512 GB', 'camera': '200 MP + 50 MP + 12 MP + 10 MP', 'pin': '5000 mAh, Sạc 45W' },
    brand: 'Samsung',
    category: 'Điện thoại',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'v3', sku: 'S24U-512-GREY', color: 'Titan Xám', memory: '512GB', listedPrice: 37490000, salePrice: 31990000, stock: 10 }
    ],
    reviews: []
  },
  'macbook-pro-14-m3-pro-18gb-512gb': {
    id: 'p5',
    name: 'MacBook Pro 14 M3 Pro (18GB/512GB)',
    slug: 'macbook-pro-14-m3-pro-18gb-512gb',
    modelCode: 'MRX33',
    description: 'MacBook Pro 14 M3 Pro trang bị màn hình Liquid Retina XDR 120Hz siêu việt, chip M3 Pro 11-core CPU và 14-core GPU mang đến hiệu năng đồ họa lập trình mạnh mẽ cùng vỏ nhôm Space Black.',
    specs: { 'màn_hình': '14.2 inch Liquid Retina XDR 120Hz', 'chip': 'Apple M3 Pro 11-core', 'ram': '18 GB Unified Memory', 'bộ_nhớ': '512 GB SSD', 'pin': '70Wh, Thời lượng pin 18h' },
    brand: 'Apple',
    category: 'Laptop',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'v6', sku: 'MBP14-M3P-BLACK', color: 'Space Black', memory: '18GB/512GB', listedPrice: 49990000, salePrice: 46990000, stock: 5 }
    ],
    reviews: []
  },
  'samsung-galaxy-watch-7-44mm': {
    id: 'p14',
    name: 'Samsung Galaxy Watch 7 44mm BT',
    slug: 'samsung-galaxy-watch-7-44mm',
    modelCode: 'SM-L310',
    description: 'Samsung Galaxy Watch 7 44mm trang bị cảm biến BioActive tiên tiến nhất, vi xử lý 3nm siêu mượt, tính năng Galaxy AI phân tích giấc ngủ và theo dõi thể thao chuyên nghiệp.',
    specs: { 'màn_hình': '1.5 inch Super AMOLED Sapphire', 'chip': 'Exynos W1000 3nm 5-core', 'ram': '2 GB', 'bộ_nhớ': '32 GB', 'pin': '425 mAh' },
    brand: 'Samsung',
    category: 'Smartwatch',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'v15', sku: 'GW7-44-GREEN', color: 'Xanh Quân Đội', memory: '44mm', listedPrice: 7990000, salePrice: 6990000, stock: 22 }
    ],
    reviews: []
  }
};

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        category: true,
        variants: true,
        images: true,
        reviews: {
          include: {
            user: { select: { fullName: true } }
          },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (product && product.active) {
      const thumbnail = product.images?.find((img) => img.isThumbnail)?.url || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80';
      const allImages = product.images && product.images.length > 0
        ? product.images.map((img) => img.url)
        : [thumbnail];

      return NextResponse.json({
        id: product.id,
        name: product.name,
        slug: product.slug,
        modelCode: product.modelCode,
        description: product.description,
        specs: product.specs,
        brand: product.brand.name,
        category: product.category.name,
        image: thumbnail,
        images: allImages,
        variants: product.variants.map((variant) => ({
          id: variant.id,
          sku: variant.sku,
          color: variant.color,
          memory: variant.memory,
          listedPrice: Number(variant.listedPrice),
          salePrice: variant.salePrice ? Number(variant.salePrice) : null,
          stock: variant.stock
        })),
        reviews: product.reviews.map((review) => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          imageUrls: review.imageUrls,
          author: review.user.fullName,
          createdAt: review.createdAt
        }))
      });
    }
  } catch (e) {
    console.warn('Prisma DB query failed, checking mock fallback detail for:', slug);
  }

  // Fallback match in MOCK_PRODUCT_DETAILS or default fallback product
  if (MOCK_PRODUCT_DETAILS[slug]) {
    return NextResponse.json(MOCK_PRODUCT_DETAILS[slug]);
  }

  // Default fallback for any custom products
  const defaultMockImage = 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80';
  return NextResponse.json({
    id: 'mock-id-' + slug,
    name: slug.replace(/-/g, ' ').toUpperCase(),
    slug: slug,
    modelCode: 'MODEL-' + slug.substring(0, 5).toUpperCase(),
    description: 'Sản phẩm chính hãng với thiết kế sang trọng, hiệu năng vượt trội và bảo hành 12 tháng tại TechStore.',
    specs: { 'màn_hình': 'OLED 120Hz sắc nét', 'bảo_hành': '12 tháng chính hãng', 'tình_trạng': 'Mới 100% Nguyên Seal' },
    brand: 'Chính Hãng',
    category: 'Sản phẩm',
    image: defaultMockImage,
    images: [defaultMockImage, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { id: 'mock-v1', sku: 'SKU-' + slug.toUpperCase(), color: 'Mặc định', memory: 'Tiêu chuẩn', listedPrice: 15990000, salePrice: 13990000, stock: 20 }
    ],
    reviews: []
  });
}
