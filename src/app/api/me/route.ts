import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/request-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth.response) {
    return auth.response;
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.user.sub },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      role: true,
      addresses: true
    }
  });

  return NextResponse.json(user);
}
