import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/request-auth";
import { parseJsonBody } from "@/lib/request-body";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  recipient: z.string().min(2),
  phone: z.string().min(8),
  line1: z.string().min(3),
  ward: z.string().min(2),
  district: z.string().min(2),
  city: z.string().min(2),
  isDefault: z.boolean().optional()
});

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth.response) {
    return auth.response;
  }

  const addresses = await prisma.address.findMany({
    where: { userId: auth.user.sub },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
  });

  return NextResponse.json(addresses);
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
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({
      where: { userId: auth.user.sub, isDefault: true },
      data: { isDefault: false }
    });
  }

  const created = await prisma.address.create({
    data: {
      userId: auth.user.sub,
      recipient: parsed.data.recipient,
      phone: parsed.data.phone,
      line1: parsed.data.line1,
      ward: parsed.data.ward,
      district: parsed.data.district,
      city: parsed.data.city,
      isDefault: parsed.data.isDefault ?? false
    }
  });

  return NextResponse.json(created, { status: 201 });
}
