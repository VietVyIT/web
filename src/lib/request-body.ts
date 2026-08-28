import { NextRequest } from "next/server";

export async function parseJsonBody<T>(request: NextRequest): Promise<T | null> {
  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return null;
  }

  try {
    const payload = (await request.json()) as T;
    return payload;
  } catch {
    return null;
  }
}

