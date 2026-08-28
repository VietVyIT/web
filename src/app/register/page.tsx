"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { saveSession, type SessionUser } from "@/lib/client-auth";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, phone: phone || undefined, email, password })
    });
    const payload = (await response.json()) as {
      message?: string;
      token?: string;
      user?: SessionUser;
    };
    setLoading(false);
    if (!response.ok || !payload.token || !payload.user) {
      setError(payload.message ?? "Dang ky that bai.");
      return;
    }
    saveSession(payload.token, payload.user);
    router.push("/products");
  };

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Dang ky tai khoan</h1>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <input
            placeholder="Ho va ten"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="w-full"
            required
          />
          <input
            placeholder="So dien thoai"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full"
            required
          />
          <input
            type="password"
            placeholder="Mat khau (toi thieu 8 ky tu)"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full"
            required
            minLength={8}
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white disabled:bg-blue-300"
          >
            {loading ? "Dang xu ly..." : "Dang ky"}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          Da co tai khoan?{" "}
          <Link href="/login" className="text-blue-600">
            Dang nhap
          </Link>
        </p>
      </div>
    </main>
  );
}

