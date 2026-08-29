const TOKEN_KEY = "webbanhang_token";
const USER_KEY = "webbanhang_user";

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: "CUSTOMER" | "STAFF_SALES" | "STAFF_WAREHOUSE" | "ADMIN";
}

export function updateUserSession(updates: Partial<SessionUser>): void {
  const user = readUser();
  if (user) {
    const updated = { ...user, ...updates };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    // Trigger custom event so header can update
    window.dispatchEvent(new Event('auth-change'));
  }
}

export function readToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(TOKEN_KEY);
}

export function saveSession(token: string, user: SessionUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function readUser(): SessionUser | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

