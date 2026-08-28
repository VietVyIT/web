import { OrderStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/request-auth";
import { prisma } from "@/lib/prisma";
import { parseJsonBody } from "@/lib/request-body";

const statusSchema = z.object({
  orderId: z.string().cuid(),
  status: z.nativeEnum(OrderStatus)
});

export async function GET(request: NextRequest) {
  const auth = requireRole(request, ["ADMIN", "STAFF_SALES", "STAFF_WAREHOUSE"]);
  if (auth.response) {
    return auth.response;
  }
  const orders = await prisma.order.findMany({
    include: { user: true, items: { include: { variant: true } } },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(orders);
}

export async function PATCH(request: NextRequest) {
  const auth = requireRole(request, ["ADMIN", "STAFF_SALES"]);
  if (auth.response) {
    return auth.response;
  }

  const body = await parseJsonBody<unknown>(request);
  if (!body) {
    return NextResponse.json({ message: "Body JSON khong hop le." }, { status: 400 });
  }
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.order.update({
    where: { id: parsed.data.orderId },
    data: { status: parsed.data.status }
  });

  if (parsed.data.status === OrderStatus.DELIVERED) {
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    const orderWithSerials = await prisma.order.findUnique({
      where: { id: parsed.data.orderId },
      include: { items: { include: { serialCodes: true } } }
    });
    if (orderWithSerials) {
      for (const item of orderWithSerials.items) {
        for (const serial of item.serialCodes) {
          await prisma.warrantyRecord.upsert({
            where: { serialId: serial.id },
            create: {
              serialId: serial.id,
              customerId: updated.userId,
              startedAt: new Date(),
              expiresAt: new Date(Date.now() + oneYear)
            },
            update: {
              customerId: updated.userId,
              startedAt: new Date(),
              expiresAt: new Date(Date.now() + oneYear)
            }
          });
        }
      }
    }
  }

  return NextResponse.json(updated);
}
