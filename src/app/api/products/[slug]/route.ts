import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      category: true,
      variants: true,
      reviews: {
        include: {
          user: {
            select: {
              fullName: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!product || !product.active) {
    return NextResponse.json({ message: "Khong tim thay san pham." }, { status: 404 });
  }

  return NextResponse.json({
    id: product.id,
    name: product.name,
    slug: product.slug,
    modelCode: product.modelCode,
    description: product.description,
    specs: product.specs,
    brand: product.brand.name,
    category: product.category.name,
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

