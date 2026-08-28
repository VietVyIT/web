import { NextRequest, NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import { requireRole } from "@/lib/request-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const auth = requireRole(request, ["ADMIN", "STAFF_SALES"]);
  if (auth.response) {
    return auth.response;
  }

  const [totalRevenueByDay, bestSellingProducts, lowStockVariants] = await Promise.all([
    prisma.order.groupBy({
      by: ["createdAt"],
      where: { status: OrderStatus.DELIVERED },
      _sum: { total: true }
    }),
    prisma.orderItem.groupBy({
      by: ["variantId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 10
    }),
    prisma.productVariant.findMany({
      where: { stock: { lte: 5 } },
      include: { product: true },
      orderBy: { stock: "asc" }
    })
  ]);

  const variants = await prisma.productVariant.findMany({
    where: { id: { in: bestSellingProducts.map((item) => item.variantId) } },
    include: { product: true }
  });
  const variantMap = new Map(variants.map((item) => [item.id, item]));

  return NextResponse.json({
    revenueByDay: totalRevenueByDay.map((item) => ({
      date: item.createdAt,
      revenue: Number(item._sum.total ?? 0)
    })),
    topSelling: bestSellingProducts.map((item) => ({
      variantId: item.variantId,
      sku: variantMap.get(item.variantId)?.sku ?? "N/A",
      productName: variantMap.get(item.variantId)?.product.name ?? "N/A",
      soldQty: item._sum.quantity ?? 0
    })),
    lowStock: lowStockVariants.map((item) => ({
      variantId: item.id,
      sku: item.sku,
      productName: item.product.name,
      stock: item.stock
    }))
  });
}
