import { OrderStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { parseJsonBody } from "@/lib/request-body";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/request-auth";
import { reviewSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth.response) {
    return auth.response;
  }

  const body = await parseJsonBody<unknown>(request);
  if (!body) {
    return NextResponse.json({ message: "Body JSON khong hop le." }, { status: 400 });
  }

  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.flatten() }, { status: 400 });
  }

  const userId = auth.user.sub;
  const { productId, rating, comment, imageUrl } = parsed.data;

  const deliveredOrder = await prisma.order.findFirst({
    where: {
      userId,
      status: OrderStatus.DELIVERED,
      items: {
        some: {
          variant: {
            productId
          }
        }
      }
    }
  });

  if (!deliveredOrder) {
    return NextResponse.json(
      { message: "Chi duoc danh gia sau khi don hang da giao." },
      { status: 403 }
    );
  }

  const review = await prisma.review.upsert({
    where: { userId_productId: { userId, productId } },
    update: { rating, comment, imageUrl },
    create: { userId, productId, rating, comment, imageUrl }
  });

  return NextResponse.json(review, { status: 201 });
}
