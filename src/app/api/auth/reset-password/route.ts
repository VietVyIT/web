import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseJsonBody } from "@/lib/request-body";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  newPassword: z.string().min(8)
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
    return NextResponse.json({ message: "OTP hoac email khong dung." }, { status: 400 });
  }

  const otp = await prisma.passwordResetOtp.findFirst({
    where: {
      userId: user.id,
      code: parsed.data.otp,
      usedAt: null,
      expiresAt: { gte: new Date() }
    },
    orderBy: { createdAt: "desc" }
  });

  if (!otp) {
    return NextResponse.json({ message: "OTP hoac email khong dung." }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(parsed.data.newPassword) }
    }),
    prisma.passwordResetOtp.update({
      where: { id: otp.id },
      data: { usedAt: new Date() }
    })
  ]);

  return NextResponse.json({ message: "Doi mat khau thanh cong." });
}

