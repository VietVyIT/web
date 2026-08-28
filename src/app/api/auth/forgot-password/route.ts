import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseJsonBody } from "@/lib/request-body";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email()
});

export async function POST(request: NextRequest) {
  const body = await parseJsonBody<unknown>(request);
  if (!body) {
    return NextResponse.json({ message: "Body JSON khong hop le." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.flatten() }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) {
    return NextResponse.json({ message: "Neu email ton tai, ma OTP da duoc gui." });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  await prisma.passwordResetOtp.create({
    data: {
      userId: user.id,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    }
  });

  return NextResponse.json({
    message: "Da tao OTP. Tich hop email provider de gui OTP cho khach.",
    devOtp: process.env.NODE_ENV === "production" ? undefined : code
  });
}

