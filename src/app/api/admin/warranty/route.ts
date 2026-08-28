import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseJsonBody } from "@/lib/request-body";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/request-auth";

const schema = z.object({
  warrantyId: z.string().cuid(),
  repairStatus: z.string().min(2),
  repairNote: z.string().max(2000).optional()
});

export async function GET(request: NextRequest) {
  const auth = requireRole(request, ["ADMIN", "STAFF_WAREHOUSE", "STAFF_SALES"]);
  if (auth.response) {
    return auth.response;
  }

  const items = await prisma.warrantyRecord.findMany({
    include: { serial: true, customer: true },
    orderBy: { updatedAt: "desc" }
  });

  return NextResponse.json(items);
}

export async function PATCH(request: NextRequest) {
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

  const updated = await prisma.warrantyRecord.update({
    where: { id: parsed.data.warrantyId },
    data: {
      repairStatus: parsed.data.repairStatus,
      repairNote: parsed.data.repairNote
    }
  });

  return NextResponse.json(updated);
}
