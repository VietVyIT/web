import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseJsonBody } from "@/lib/request-body";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/request-auth";
import { toDecimal } from "@/lib/money";

const schema = z.object({
  code: z.string().min(3).max(50),
  discountPct: z.number().min(0).max(100).optional(),
  discountAmount: z.number().min(0).optional(),
  minOrderValue: z.number().min(0).optional(),
  usageLimit: z.number().int().min(1).optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime()
});

export async function GET(request: NextRequest) {
  const auth = requireRole(request, ["ADMIN", "STAFF_SALES"]);
  if (auth.response) {
    return auth.response;
  }

  const vouchers = await prisma.voucher.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(vouchers);
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

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.flatten() }, { status: 400 });
  }

  if (!parsed.data.discountPct && !parsed.data.discountAmount) {
    return NextResponse.json(
      { message: "Voucher can discountPct hoac discountAmount." },
      { status: 400 }
    );
  }

  const voucher = await prisma.voucher.create({
    data: {
      code: parsed.data.code.toUpperCase(),
      discountPct: parsed.data.discountPct ? toDecimal(parsed.data.discountPct) : undefined,
      discountAmount: parsed.data.discountAmount
        ? toDecimal(parsed.data.discountAmount)
        : undefined,
      minOrderValue: parsed.data.minOrderValue ? toDecimal(parsed.data.minOrderValue) : undefined,
      usageLimit: parsed.data.usageLimit,
      startsAt: new Date(parsed.data.startsAt),
      endsAt: new Date(parsed.data.endsAt)
    }
  });

  return NextResponse.json(voucher, { status: 201 });
}
