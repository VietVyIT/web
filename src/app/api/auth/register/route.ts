import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signAccessToken } from "@/lib/auth";
import { parseJsonBody } from "@/lib/request-body";
import { registerSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  const body = await parseJsonBody<unknown>(request);
  if (!body) {
    return NextResponse.json({ message: "Body JSON khong hop le." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.flatten() }, { status: 400 });
  }

  const { email, password, fullName, phone } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ message: "Email da ton tai." }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
      fullName,
      phone
    }
  });

  const token = signAccessToken({ sub: user.id, email: user.email, role: user.role });
  return NextResponse.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    }
  });
}
