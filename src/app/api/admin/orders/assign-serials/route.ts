import { InventorySerialStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseJsonBody } from "@/lib/request-body";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/request-auth";

const schema = z.object({
  orderItemId: z.string().cuid(),
  serialIds: z.array(z.string().cuid()).min(1)
});

export async function POST(request: NextRequest) {
  const auth = requireRole(request, ["ADMIN", "STAFF_WAREHOUSE"]);
  if (auth.response) {
    return auth.response;
  }

  const body = await parseJsonBody<unknown>(request);
  if (!body) {
    return NextResponse.json({ message: "Body JSON khong hop le." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.flatten() }, { status: 400 });
  }

  const orderItem = await prisma.orderItem.findUnique({
    where: { id: parsed.data.orderItemId }
  });
  if (!orderItem) {
    return NextResponse.json({ message: "Khong tim thay order item." }, { status: 404 });
  }
  if (orderItem.quantity !== parsed.data.serialIds.length) {
    return NextResponse.json(
      { message: "So luong serial phai bang so luong trong order item." },
      { status: 400 }
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const assigned = await tx.inventorySerial.updateMany({
      where: {
        id: { in: parsed.data.serialIds },
        variantId: orderItem.variantId,
        status: InventorySerialStatus.IN_STOCK,
        orderItemId: null
      },
      data: {
        orderItemId: orderItem.id,
        status: InventorySerialStatus.SOLD
      }
    });
    return assigned.count;
  });

  if (result !== parsed.data.serialIds.length) {
    return NextResponse.json(
      { message: "Mot hoac nhieu serial khong hop le/da duoc gan truoc do." },
      { status: 409 }
    );
  }

  return NextResponse.json({ assigned: result });
}
