import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/request-auth";
import { parseJsonBody } from "@/lib/request-body";
import { slugify } from "@/lib/slug";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  parentId: z.string().cuid().optional(),
  specs: z.record(z.string(), z.string()).optional()
});

export async function GET(request: NextRequest) {
  const auth = requireRole(request, ["ADMIN", "STAFF_SALES"]);
  if (auth.response) {
    return auth.response;
  }

  const categories = await prisma.category.findMany({
    include: { children: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(categories);
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

  const category = await prisma.category.create({
    data: {
      ...parsed.data,
      slug: slugify(parsed.data.name)
    }
  });

  return NextResponse.json(category, { status: 201 });
}
