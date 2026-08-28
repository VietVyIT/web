import { NextRequest, NextResponse } from "next/server";
import { parseAccessToken, readBearerToken, type AccessTokenPayload } from "@/lib/auth";

export interface AuthResult {
  user: AccessTokenPayload;
  response: null;
}

export interface AuthErrorResult {
  user: null;
  response: NextResponse;
}

export function requireAuth(request: NextRequest): AuthResult | AuthErrorResult {
  const token = readBearerToken(request);
  if (!token) {
    return {
      user: null,
      response: NextResponse.json({ message: "Missing bearer token." }, { status: 401 })
    };
  }

  const user = parseAccessToken(token);
  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ message: "Invalid access token." }, { status: 401 })
    };
  }

  return { user, response: null };
}

export function requireRole(
  request: NextRequest,
  roles: AccessTokenPayload["role"][]
): AuthResult | AuthErrorResult {
  const result = requireAuth(request);
  if (result.response || !result.user) {
    return result;
  }

  if (!roles.includes(result.user.role)) {
    return {
      user: null,
      response: NextResponse.json({ message: "Forbidden." }, { status: 403 })
    };
  }

  return result;
}
