import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cartItemSchema } from "@/lib/schemas";
import { parseJsonBody } from "@/lib/request-body";
import { requireAuth } from "@/lib/request-auth";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth.response) {
    return auth.response;
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: auth.user.sub },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: { include: { brand: true } }
            }
          }
        }
      }
    }
  });

  return NextResponse.json(cart ?? { items: [] });
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth.response) {
    return auth.response;
  }

  const body = await parseJsonBody<unknown>(request);
  if (!body) {
    return NextResponse.json({ message: "Body JSON khong hop le." }, { status: 400 });
  }

  const parsed = cartItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.flatten() }, { status: 400 });
  }

  const { variantId, quantity } = parsed.data;
  const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
  if (!variant) {
    return NextResponse.json({ message: "Khong tim thay bien the san pham." }, { status: 404 });
  }
  if (variant.stock < quantity) {
    return NextResponse.json({ message: "Khong du ton kho." }, { status: 409 });
  }

  const cart = await prisma.cart.upsert({
    where: { userId: auth.user.sub },
    update: {},
    create: { userId: auth.user.sub }
  });

  await prisma.cartItem.upsert({
    where: {
      cartId_variantId: { cartId: cart.id, variantId }
    },
    update: { quantity },
    create: {
      cartId: cart.id,
      variantId,
      quantity
    }
  });

  const latest = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: { items: { include: { variant: true } } }
  });

  return NextResponse.json(latest);
}
