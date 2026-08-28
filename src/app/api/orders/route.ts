import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/request-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth.response) {
    return auth.response;
  }

  const orders = await prisma.order.findMany({
    where: { userId: auth.user.sub },
    include: {
      address: true,
      items: {
        include: {
          variant: {
            include: { product: true }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(orders);
}
