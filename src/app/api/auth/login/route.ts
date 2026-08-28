import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseJsonBody } from "@/lib/request-body";
import { loginSchema } from "@/lib/schemas";
import { signAccessToken, verifyPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await parseJsonBody<unknown>(request);
  if (!body) {
    return NextResponse.json({ message: "Body JSON khong hop le." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.flatten() }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ message: "Email hoac mat khau khong dung." }, { status: 401 });
  }

  const matches = await verifyPassword(password, user.passwordHash);
  if (!matches) {
    return NextResponse.json({ message: "Email hoac mat khau khong dung." }, { status: 401 });
  }

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

