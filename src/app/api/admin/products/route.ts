import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseJsonBody } from "@/lib/request-body";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/request-auth";
import { slugify } from "@/lib/slug";
import { toDecimal } from "@/lib/money";

const createSchema = z.object({
  name: z.string().min(3),
  modelCode: z.string().min(2),
  description: z.string().optional(),
  brandId: z.string().cuid(),
  categoryId: z.string().cuid(),
  specs: z.record(z.string(), z.string()).optional(),
  variants: z
    .array(
      z.object({
        sku: z.string().min(2),
        color: z.string().optional(),
        memory: z.string().optional(),
        listedPrice: z.number().positive(),
        salePrice: z.number().positive().optional(),
        stock: z.number().int().min(0)
      })
    )
    .min(1)
});

const updateSchema = z.object({
  active: z.boolean().optional()
});

export async function GET(request: NextRequest) {
  const auth = requireRole(request, ["ADMIN", "STAFF_SALES"]);
  if (auth.response) {
    return auth.response;
  }

  const products = await prisma.product.findMany({
    include: { brand: true, category: true, variants: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const auth = requireRole(request, ["ADMIN"]);
  if (auth.response) {
    return auth.response;
  }

  const body = await parseJsonBody<unknown>(request);
  if (!body) {
    return NextResponse.json({ message: "Body JSON khong hop le." }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.flatten() }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      name: parsed.data.name,
      slug: slugify(parsed.data.name),
      modelCode: parsed.data.modelCode,
      description: parsed.data.description,
      brandId: parsed.data.brandId,
      categoryId: parsed.data.categoryId,
      specs: parsed.data.specs,
      variants: {
        create: parsed.data.variants.map((variant) => ({
          sku: variant.sku,
          color: variant.color,
          memory: variant.memory,
          listedPrice: toDecimal(variant.listedPrice),
          salePrice: variant.salePrice ? toDecimal(variant.salePrice) : undefined,
          stock: variant.stock
        }))
      }
    },
    include: { variants: true }
  });

  return NextResponse.json(product, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const auth = requireRole(request, ["ADMIN"]);
  if (auth.response) {
    return auth.response;
  }
  const productId = request.nextUrl.searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ message: "Thieu productId." }, { status: 400 });
  }

  const body = await parseJsonBody<unknown>(request);
  if (!body) {
    return NextResponse.json({ message: "Body JSON khong hop le." }, { status: 400 });
  }
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.product.update({
    where: { id: productId },
    data: parsed.data
  });
  return NextResponse.json(updated);
}
