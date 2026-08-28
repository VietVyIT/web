import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest } from "next/server";

export type Role = "CUSTOMER" | "STAFF_SALES" | "STAFF_WAREHOUSE" | "ADMIN";

export interface AccessTokenPayload extends JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function accessSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is required");
  }
  return secret;
}

export function signAccessToken(payload: { sub: string; email: string; role: Role }): string {
  return jwt.sign(payload, accessSecret(), { expiresIn: "7d" });
}

export function readBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice("Bearer ".length);
}

export function parseAccessToken(token: string): AccessTokenPayload | null {
  try {
    const decoded = jwt.verify(token, accessSecret());
    if (typeof decoded === "string") {
      return null;
    }
    if (!decoded.sub || !decoded.email || !decoded.role) {
      return null;
    }
    return decoded as AccessTokenPayload;
  } catch {
    return null;
  }
}

