import { InventorySerialStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseJsonBody } from "@/lib/request-body";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/request-auth";

const schema = z.object({
  variantId: z.string().cuid(),
  serials: z.array(z.object({ code: z.string().min(3), imeiPhone: z.string().optional() })).min(1)
});

export async function GET(request: NextRequest) {
  const auth = requireRole(request, ["ADMIN", "STAFF_WAREHOUSE"]);
  if (auth.response) {
    return auth.response;
  }

  const variantId = request.nextUrl.searchParams.get("variantId");
  const records = await prisma.inventorySerial.findMany({
    where: variantId ? { variantId } : undefined,
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(records);
}

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

  const created = await prisma.inventorySerial.createMany({
    data: parsed.data.serials.map((serial) => ({
      variantId: parsed.data.variantId,
      code: serial.code,
      imeiPhone: serial.imeiPhone,
      status: InventorySerialStatus.IN_STOCK
    })),
    skipDuplicates: false
  });

  return NextResponse.json({ inserted: created.count }, { status: 201 });
}
