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
  if (!value) {
    return null;
  }
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return null;
  }
  return numeric;
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  const keyword = query.get("q");
  const brandSlug = query.get("brand");
  const categorySlug = query.get("category");
  const minPrice = toNumber(query.get("minPrice"));
  const maxPrice = toNumber(query.get("maxPrice"));
  const sort = parseSort(query.get("sort"));
  const onlyAutocomplete = query.get("mode") === "autocomplete";

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
        if (minPrice !== null && variant.effectivePrice < minPrice) {
          return false;
        }
        if (maxPrice !== null && variant.effectivePrice > maxPrice) {
          return false;
        }
        return true;
      });

    if (variants.length === 0) {
      continue;
    }

    const avgRating =
      product.reviews.length === 0
        ? 0
        : product.reviews.reduce((sum, item) => sum + item.rating, 0) / product.reviews.length;

    filtered.push({
      id: product.id,
      name: product.name,
      slug: product.slug,
      modelCode: product.modelCode,
      brand: product.brand.name,
      category: product.category.name,
      specs: product.specs,
      variants,
      avgRating,
      createdAt: product.createdAt
    });
  }

  const sorted = [...filtered].sort((a, b) => {
    const lowA = Math.min(...a.variants.map((variant) => variant.effectivePrice));
    const lowB = Math.min(...b.variants.map((variant) => variant.effectivePrice));
    if (sort === "price_asc") {
      return lowA - lowB;
    }
    if (sort === "price_desc") {
      return lowB - lowA;
    }
    if (sort === "rating_desc") {
      return b.avgRating - a.avgRating;
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  if (onlyAutocomplete) {
    return NextResponse.json(
      sorted.map((item) => ({
        id: item.id,
        name: item.name,
        modelCode: item.modelCode
      }))
    );
  }

  return NextResponse.json(sorted);
}

