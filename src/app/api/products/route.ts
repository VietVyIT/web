import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type SortOption = "price_asc" | "price_desc" | "best_selling" | "newest" | "rating_desc";

interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  modelCode: string;
  brand: string;
  category: string;
  image?: string;
  specs: Prisma.JsonValue | null;
  variants: Array<{
    id: string;
    sku: string;
    color: string | null;
    memory: string | null;
    listedPrice: number;
    salePrice: number | null;
    stock: number;
    effectivePrice: number;
  }>;
  avgRating: number;
  createdAt: Date;
}

const MOCK_PRODUCTS: ProductListItem[] = [
  {
    id: 'p1',
    name: 'iPhone 16 Pro Max 256GB',
    slug: 'iphone-16-pro-max-256gb',
    modelCode: 'IP16PM-256',
    brand: 'Apple',
    category: 'Điện thoại',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    specs: null,
    avgRating: 4.9,
    createdAt: new Date(),
    variants: [
      { id: 'v1', sku: 'IP16PM-256-DESERT', color: 'Titan Sa Mạc', memory: '256GB', listedPrice: 34990000, salePrice: 33490000, stock: 15, effectivePrice: 33490000 },
      { id: 'v2', sku: 'IP16PM-256-NATURAL', color: 'Titan Tự Nhiên', memory: '256GB', listedPrice: 34990000, salePrice: 33490000, stock: 20, effectivePrice: 33490000 }
    ]
  },
  {
    id: 'p2',
    name: 'Samsung Galaxy S24 Ultra 512GB',
    slug: 'samsung-galaxy-s24-ultra-512gb',
    modelCode: 'SM-S928B',
    brand: 'Samsung',
    category: 'Điện thoại',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    specs: null,
    avgRating: 4.8,
    createdAt: new Date(),
    variants: [
      { id: 'v3', sku: 'S24U-512-GREY', color: 'Titan Xám', memory: '512GB', listedPrice: 37490000, salePrice: 31990000, stock: 10, effectivePrice: 31990000 }
    ]
  },
  {
    id: 'p3',
    name: 'Xiaomi 14 Ultra 512GB Leica',
    slug: 'xiaomi-14-ultra-512gb-leica',
    modelCode: 'MI14U-512',
    brand: 'Xiaomi',
    category: 'Điện thoại',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    specs: null,
    avgRating: 4.7,
    createdAt: new Date(),
    variants: [
      { id: 'v4', sku: 'MI14U-BLACK', color: 'Đen Da Cao Cấp', memory: '16GB/512GB', listedPrice: 32990000, salePrice: 29990000, stock: 12, effectivePrice: 29990000 }
    ]
  },
  {
    id: 'p4',
    name: 'iPhone 15 128GB Pink',
    slug: 'iphone-15-128gb-pink',
    modelCode: 'IP15-128',
    brand: 'Apple',
    category: 'Điện thoại',
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80',
    specs: null,
    avgRating: 4.8,
    createdAt: new Date(),
    variants: [
      { id: 'v5', sku: 'IP15-128-PINK', color: 'Hồng Pastel', memory: '128GB', listedPrice: 22990000, salePrice: 19490000, stock: 25, effectivePrice: 19490000 }
    ]
  },
  {
    id: 'p5',
    name: 'MacBook Pro 14 M3 Pro (18GB/512GB)',
    slug: 'macbook-pro-14-m3-pro-18gb-512gb',
    modelCode: 'MRX33',
    brand: 'Apple',
    category: 'Laptop',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    specs: null,
    avgRating: 5.0,
    createdAt: new Date(),
    variants: [
      { id: 'v6', sku: 'MBP14-M3P-BLACK', color: 'Space Black', memory: '18GB/512GB', listedPrice: 49990000, salePrice: 46990000, stock: 5, effectivePrice: 46990000 }
    ]
  },
  {
    id: 'p6',
    name: 'ASUS ROG Strix G16 RTX 4070',
    slug: 'asus-rog-strix-g16-rtx-4070',
    modelCode: 'G614JI',
    brand: 'ASUS',
    category: 'Laptop',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80',
    specs: null,
    avgRating: 4.9,
    createdAt: new Date(),
    variants: [
      { id: 'v7', sku: 'ROG-G16-4070', color: 'Eclipse Gray', memory: '16GB/1TB', listedPrice: 45990000, salePrice: 41990000, stock: 7, effectivePrice: 41990000 }
    ]
  },
  {
    id: 'p7',
    name: 'Dell XPS 16 9640 Core Ultra 7',
    slug: 'dell-xps-16-9640-core-ultra-7',
    modelCode: 'XPS9640',
    brand: 'Dell',
    category: 'Laptop',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80',
    specs: null,
    avgRating: 4.9,
    createdAt: new Date(),
    variants: [
      { id: 'v8', sku: 'DELL-XPS16-SILVER', color: 'Platinum Silver', memory: '32GB/1TB', listedPrice: 65990000, salePrice: 59990000, stock: 4, effectivePrice: 59990000 }
    ]
  },
  {
    id: 'p8',
    name: 'Lenovo ThinkPad X1 Carbon Gen 12',
    slug: 'lenovo-thinkpad-x1-carbon-gen-12',
    modelCode: 'X1C-G12',
    brand: 'Lenovo',
    category: 'Laptop',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80',
    specs: null,
    avgRating: 4.8,
    createdAt: new Date(),
    variants: [
      { id: 'v9', sku: 'THINKPAD-X1-G12', color: 'Black Carbon', memory: '16GB/512GB', listedPrice: 52990000, salePrice: 48990000, stock: 6, effectivePrice: 48990000 }
    ]
  },
  {
    id: 'p9',
    name: 'iPad Pro 11 inch M4 OLED 256GB',
    slug: 'ipad-pro-11-inch-m4-oled-256gb',
    modelCode: 'MVE73',
    brand: 'Apple',
    category: 'Tablet',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    specs: null,
    avgRating: 4.9,
    createdAt: new Date(),
    variants: [
      { id: 'v10', sku: 'IPAD-M4-11-BLACK', color: 'Space Black', memory: '256GB', listedPrice: 28990000, salePrice: 27490000, stock: 12, effectivePrice: 27490000 }
    ]
  },
  {
    id: 'p10',
    name: 'Tai nghe Chống Ồn Sony WH-1000XM5',
    slug: 'tai-nghe-sony-wh-1000xm5',
    modelCode: 'WH1000XM5',
    brand: 'Sony',
    category: 'Tai nghe',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    specs: null,
    avgRating: 4.9,
    createdAt: new Date(),
    variants: [
      { id: 'v11', sku: 'SONY-XM5-BLACK', color: 'Black', memory: 'N/A', listedPrice: 8490000, salePrice: 6990000, stock: 25, effectivePrice: 6990000 }
    ]
  },
  {
    id: 'p11',
    name: 'AirPods Pro 2 USB-C (2023)',
    slug: 'airpods-pro-2-usbc',
    modelCode: 'MTJV3',
    brand: 'Apple',
    category: 'Tai nghe',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
    specs: null,
    avgRating: 4.8,
    createdAt: new Date(),
    variants: [
      { id: 'v12', sku: 'AIRPODS-PRO-2', color: 'White', memory: 'N/A', listedPrice: 6190000, salePrice: 5690000, stock: 40, effectivePrice: 5690000 }
    ]
  },
  {
    id: 'p12',
    name: 'Marshall Major IV Bluetooth Wireless',
    slug: 'marshall-major-iv-bluetooth',
    modelCode: 'MAJOR-IV',
    brand: 'Marshall',
    category: 'Tai nghe',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
    specs: null,
    avgRating: 4.7,
    createdAt: new Date(),
    variants: [
      { id: 'v13', sku: 'MARSHALL-M4-BLK', color: 'Black Classic', memory: 'N/A', listedPrice: 4290000, salePrice: 3690000, stock: 30, effectivePrice: 3690000 }
    ]
  },
  {
    id: 'p13',
    name: 'Apple Watch Ultra 2 GPS + Cellular 49mm',
    slug: 'apple-watch-ultra-2-49mm',
    modelCode: 'MREX3',
    brand: 'Apple',
    category: 'Smartwatch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    specs: null,
    avgRating: 5.0,
    createdAt: new Date(),
    variants: [
      { id: 'v14', sku: 'AW-ULTRA2-ALPINE', color: 'Dây Alpine Cam', memory: '49mm', listedPrice: 21990000, salePrice: 19990000, stock: 14, effectivePrice: 19990000 }
    ]
  },
  {
    id: 'p14',
    name: 'Samsung Galaxy Watch 7 44mm BT',
    slug: 'samsung-galaxy-watch-7-44mm',
    modelCode: 'SM-L310',
    brand: 'Samsung',
    category: 'Smartwatch',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
    specs: null,
    avgRating: 4.7,
    createdAt: new Date(),
    variants: [
      { id: 'v15', sku: 'GW7-44-GREEN', color: 'Xanh Quân Đội', memory: '44mm', listedPrice: 7990000, salePrice: 6990000, stock: 22, effectivePrice: 6990000 }
    ]
  },
  {
    id: 'p15',
    name: 'Màn Hình Cong Gaming LG UltraGear 34 inch OLED 175Hz',
    slug: 'man-hinh-lg-ultragear-34-oled',
    modelCode: '34GS95QE',
    brand: 'LG',
    category: 'Màn hình',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    specs: null,
    avgRating: 4.9,
    createdAt: new Date(),
    variants: [
      { id: 'v16', sku: 'LG-34-OLED', color: 'Đen Gaming', memory: 'WQHD (3440x1440)', listedPrice: 29990000, salePrice: 25990000, stock: 6, effectivePrice: 25990000 }
    ]
  }
];

function parseSort(value: string | null): SortOption {
  if (
    value === "price_asc" ||
    value === "price_desc" ||
    value === "best_selling" ||
    value === "rating_desc"
  ) {
    return value;
  }
  return "newest";
}

function toNumber(value: string | null): number | null {
  if (!value) return null;
  const numeric = Number(value);
  return Number.isNaN(numeric) ? null : numeric;
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  const keyword = query.get("q")?.toLowerCase();
  const brandSlug = query.get("brand");
  const categorySlug = query.get("category");
  const minPrice = toNumber(query.get("minPrice"));
  const maxPrice = toNumber(query.get("maxPrice"));
  const sort = parseSort(query.get("sort"));
  const onlyAutocomplete = query.get("mode") === "autocomplete";

  try {
    const where: Prisma.ProductWhereInput = {
      active: true,
      ...(keyword
        ? {
            OR: [
              { name: { contains: keyword, mode: "insensitive" } },
              { modelCode: { contains: keyword, mode: "insensitive" } }
            ]
          }
        : {}),
      ...(brandSlug ? { brand: { slug: brandSlug } } : {}),
      ...(categorySlug ? { category: { slug: categorySlug } } : {})
    };

    const products = await prisma.product.findMany({
      where,
      take: onlyAutocomplete ? 10 : 50,
      include: {
        brand: true,
        category: true,
        variants: true,
        images: true,
        reviews: { select: { rating: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    const filtered: ProductListItem[] = [];

    for (const product of products) {
      const variants = product.variants
        .map((variant) => {
          const listedPrice = Number(variant.listedPrice);
          const salePrice = variant.salePrice ? Number(variant.salePrice) : null;
          const effectivePrice = salePrice ?? listedPrice;
          return {
            id: variant.id,
            sku: variant.sku,
            color: variant.color,
            memory: variant.memory,
            listedPrice,
            salePrice,
            stock: variant.stock,
            effectivePrice
          };
        })
        .filter((variant) => {
          if (minPrice !== null && variant.effectivePrice < minPrice) return false;
          if (maxPrice !== null && variant.effectivePrice > maxPrice) return false;
          return true;
        });

      if (variants.length === 0) continue;

      const avgRating =
        product.reviews.length === 0
          ? 4.8
          : product.reviews.reduce((sum, item) => sum + item.rating, 0) / product.reviews.length;

      const thumbnail = product.images?.find((img) => img.isThumbnail)?.url || product.images?.[0]?.url;

      filtered.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        modelCode: product.modelCode,
        brand: product.brand.name,
        category: product.category.name,
        image: thumbnail,
        specs: product.specs,
        variants,
        avgRating,
        createdAt: product.createdAt
      });
    }

    const sorted = [...filtered].sort((a, b) => {
      const lowA = Math.min(...a.variants.map((v) => v.effectivePrice));
      const lowB = Math.min(...b.variants.map((v) => v.effectivePrice));
      if (sort === "price_asc") return lowA - lowB;
      if (sort === "price_desc") return lowB - lowA;
      if (sort === "rating_desc") return b.avgRating - a.avgRating;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    if (onlyAutocomplete) {
      return NextResponse.json(
        sorted.map((item) => ({ id: item.id, name: item.name, modelCode: item.modelCode }))
      );
    }

    return NextResponse.json(sorted);
  } catch (error) {
    console.warn("Prisma DB offline, returning rich mock products fallback:", error);
    
    // Filter Mock Products
    let result = MOCK_PRODUCTS.filter(item => {
      if (keyword && !item.name.toLowerCase().includes(keyword) && !item.modelCode.toLowerCase().includes(keyword)) return false;
      if (brandSlug && item.brand.toLowerCase() !== brandSlug.toLowerCase()) return false;
      if (categorySlug) {
        const catMap: Record<string, string> = {
          'dien-thoai': 'Điện thoại',
          'laptop': 'Laptop',
          'tablet': 'Tablet',
          'tai-nghe': 'Tai nghe',
          'smartwatch': 'Smartwatch',
          'man-hinh': 'Màn hình'
        };
        if (catMap[categorySlug] && item.category !== catMap[categorySlug]) return false;
      }
      return true;
    });

    if (onlyAutocomplete) {
      return NextResponse.json(result.map(i => ({ id: i.id, name: i.name, modelCode: i.modelCode })));
    }

    return NextResponse.json(result);
  }
}
