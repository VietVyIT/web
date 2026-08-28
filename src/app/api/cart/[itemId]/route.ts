import { NextRequest, NextResponse } from "next/server";
import { parseJsonBody } from "@/lib/request-body";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/request-auth";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ itemId: string }> }
) {
  const auth = requireAuth(request);
  if (auth.response) {
    return auth.response;
  }

  const { itemId } = await context.params;
  const body = await parseJsonBody<{ quantity?: number }>(request);
  if (!body || typeof body.quantity !== "number") {
    return NextResponse.json({ message: "quantity phai la so." }, { status: 400 });
  }
  if (!Number.isInteger(body.quantity) || body.quantity < 1 || body.quantity > 10) {
    return NextResponse.json({ message: "quantity phai trong khoang 1-10." }, { status: 400 });
  }

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true, variant: true }
  });
  if (!item) {
    return NextResponse.json({ message: "Khong tim thay item." }, { status: 404 });
  }
  if (item.cart.userId !== auth.user.sub) {
    return NextResponse.json({ message: "Forbidden." }, { status: 403 });
  }
  if (item.variant.stock < body.quantity) {
    return NextResponse.json({ message: "Khong du ton kho." }, { status: 409 });
  }

  const updated = await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: body.quantity }
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ itemId: string }> }
) {
  const auth = requireAuth(request);
  if (auth.response) {
    return auth.response;
  }

  const { itemId } = await context.params;
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true }
  });
  if (!item) {
    return NextResponse.json({ message: "Khong tim thay item." }, { status: 404 });
  }
  if (item.cart.userId !== auth.user.sub) {
    return NextResponse.json({ message: "Forbidden." }, { status: 403 });
  }

  await prisma.cartItem.delete({ where: { id: itemId } });
  return new NextResponse(null, { status: 204 });
}
