"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearSession, readUser, type SessionUser } from "@/lib/client-auth";

export function SiteHeader() {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    setUser(readUser());
  }, []);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          Web ban hang
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/products" className="hover:text-blue-600">
            San pham
          </Link>
          <Link href="/cart" className="hover:text-blue-600">
            Gio hang
          </Link>
          <Link href="/orders" className="hover:text-blue-600">
            Don hang
          </Link>
          {user ? (
            <>
              <span className="text-slate-600">{user.fullName}</span>
              <button
                type="button"
                className="rounded-md border border-slate-300 px-2 py-1 hover:bg-slate-100"
                onClick={() => {
                  clearSession();
                  setUser(null);
                  window.location.href = "/";
                }}
              >
                Dang xuat
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-600">
                Dang nhap
              </Link>
              <Link href="/register" className="hover:text-blue-600">
                Dang ky
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

