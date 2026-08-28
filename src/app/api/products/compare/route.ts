import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.getAll("id");
  if (ids.length < 2 || ids.length > 3) {
    return NextResponse.json({ message: "Can chon 2 den 3 san pham de so sanh." }, { status: 400 });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: ids }, active: true },
    include: { brand: true, variants: true }
  });

  if (products.length !== ids.length) {
    return NextResponse.json({ message: "Mot hoac nhieu san pham khong ton tai." }, { status: 404 });
  }

  return NextResponse.json(
    products.map((product) => ({
      id: product.id,
      name: product.name,
      modelCode: product.modelCode,
      brand: product.brand.name,
      specs: product.specs,
      variants: product.variants.map((variant) => ({
        sku: variant.sku,
        color: variant.color,
        memory: variant.memory,
        listedPrice: Number(variant.listedPrice),
        salePrice: variant.salePrice ? Number(variant.salePrice) : null,
        stock: variant.stock
      }))
    }))
  );
}

