import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/request-auth";
import { parseJsonBody } from "@/lib/request-body";
import { slugify } from "@/lib/slug";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2)
});

export async function GET(request: NextRequest) {
  const auth = requireRole(request, ["ADMIN", "STAFF_SALES"]);
  if (auth.response) {
    return auth.response;
  }
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(brands);
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

  const brand = await prisma.brand.create({
    data: {
      name: parsed.data.name,
      slug: slugify(parsed.data.name)
    }
  });

  return NextResponse.json(brand, { status: 201 });
}
