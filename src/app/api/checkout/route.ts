import { OrderStatus, type Voucher } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { parseJsonBody } from "@/lib/request-body";
import { requireAuth } from "@/lib/request-auth";
import { checkoutSchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";
import { toDecimal } from "@/lib/money";

function applyVoucher(subtotal: number, voucher: Voucher | null): number {
  if (!voucher) {
    return 0;
  }
  if (voucher.minOrderValue && subtotal < Number(voucher.minOrderValue)) {
    return 0;
  }

  let discount = 0;
  if (voucher.discountPct) {
    discount += (subtotal * Number(voucher.discountPct)) / 100;
  }
  if (voucher.discountAmount) {
    discount += Number(voucher.discountAmount);
  }
  return Math.min(discount, subtotal);
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

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.flatten() }, { status: 400 });
  }

  const { addressId, paymentMethod, voucherCode } = parsed.data;
  const userId = auth.user.sub;

  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== userId) {
    return NextResponse.json({ message: "Dia chi khong hop le." }, { status: 400 });
  }

  const now = new Date();
  const voucher = voucherCode
    ? await prisma.voucher.findFirst({
        where: {
          code: voucherCode,
          active: true,
          startsAt: { lte: now },
          endsAt: { gte: now }
        }
      })
    : null;

  if (voucher?.usageLimit !== null && voucher?.usageLimit !== undefined) {
    if (voucher.usedCount >= voucher.usageLimit) {
      return NextResponse.json({ message: "Voucher da het luot su dung." }, { status: 409 });
    }
  }

  const result = await prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findUnique({
      where: { userId },
      include: { items: { include: { variant: true } } }
    });
    if (!cart || cart.items.length === 0) {
      return { error: "Gio hang dang rong." };
    }

    let subtotal = 0;
    for (const item of cart.items) {
      const unitPrice = Number(item.variant.salePrice ?? item.variant.listedPrice);
      subtotal += unitPrice * item.quantity;
    }

    const discount = applyVoucher(subtotal, voucher);
    const total = subtotal - discount;

    for (const item of cart.items) {
      const updatedStock = await tx.productVariant.updateMany({
        where: {
          id: item.variantId,
          stock: { gte: item.quantity }
        },
        data: {
          stock: { decrement: item.quantity }
        }
      });
      if (updatedStock.count !== 1) {
        return { error: `Het hang: ${item.variant.sku}` };
      }
    }

    if (voucher) {
      const claimed = await tx.voucher.updateMany({
        where: {
          id: voucher.id,
          OR: [{ usageLimit: null }, { usedCount: { lt: voucher.usageLimit ?? 0 } }]
        },
        data: { usedCount: { increment: 1 } }
      });
      if (claimed.count !== 1) {
        return { error: "Voucher da het luot su dung." };
      }
    }

    const order = await tx.order.create({
      data: {
        userId,
        addressId,
        paymentMethod,
        status: OrderStatus.PENDING,
        subtotal: toDecimal(subtotal),
        discount: toDecimal(discount),
        total: toDecimal(total),
        voucherId: voucher?.id,
        items: {
          create: cart.items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.variant.salePrice ?? item.variant.listedPrice
          }))
        }
      },
      include: { items: true }
    });

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    return { order };
  });

  if ("error" in result) {
    return NextResponse.json({ message: result.error }, { status: 409 });
  }

  return NextResponse.json(result.order, { status: 201 });
}
