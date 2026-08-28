"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  modelCode: string;
  brand: string;
  avgRating: number;
  variants: Array<{ effectivePrice: number }>;
}

export default function HomePage() {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const response = await fetch("/api/products");
      const payload = (await response.json()) as ProductItem[];
      setItems(payload.slice(0, 8));
      setLoading(false);
    };
    void run();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold">Web ban hang thiet bi cong nghe</h1>
        <p className="mt-2 text-slate-600">
          Tim laptop, dien thoai va phu kien theo model, gia, cau hinh. Demo UI khach hang da
          duoc noi voi API.
        </p>
        <div className="mt-4 flex gap-3">
          <Link href="/products" className="rounded-md bg-blue-600 px-4 py-2 text-white">
            Xem san pham
          </Link>
          <Link href="/register" className="rounded-md border border-slate-300 px-4 py-2">
            Tao tai khoan
          </Link>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">San pham noi bat</h2>
          <Link href="/products" className="text-sm text-blue-600">
            Xem tat ca
          </Link>
        </div>
        {loading ? (
          <p>Dang tai du lieu...</p>
        ) : items.length === 0 ? (
          <p className="text-slate-600">Chua co du lieu san pham. Hay seed du lieu demo.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => {
              const minPrice = Math.min(...item.variants.map((v) => v.effectivePrice));
              return (
                <Link
                  href={`/products/${item.slug}`}
                  key={item.id}
                  className="rounded-lg border border-slate-200 bg-white p-4 hover:shadow-sm"
                >
                  <p className="text-xs text-slate-500">{item.brand}</p>
                  <h3 className="mt-1 line-clamp-2 min-h-12 font-medium">{item.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">Model: {item.modelCode}</p>
                  <p className="mt-3 font-semibold text-blue-600">
                    {new Intl.NumberFormat("vi-VN").format(minPrice)} VND
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Danh gia: {item.avgRating.toFixed(1)}</p>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

