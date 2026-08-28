import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const serialOrImei = request.nextUrl.searchParams.get("serialOrImei");
  const phone = request.nextUrl.searchParams.get("phone");

  if (!serialOrImei && !phone) {
    return NextResponse.json(
      { message: "Can serialOrImei hoac phone de tra cuu." },
      { status: 400 }
    );
  }

  const record = await prisma.warrantyRecord.findFirst({
    where: serialOrImei
      ? {
          serial: {
            OR: [{ code: serialOrImei }, { imeiPhone: serialOrImei }]
          }
        }
      : {
          customer: {
            phone: phone ?? undefined
          }
        },
    include: {
      customer: { select: { fullName: true, phone: true } },
      serial: {
        include: {
          variant: {
            include: {
              product: true
            }
          }
        }
      }
    }
  });

  if (!record) {
    return NextResponse.json({ message: "Khong tim thay thong tin bao hanh." }, { status: 404 });
  }

  return NextResponse.json(record);
}

