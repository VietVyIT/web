"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/client-api";
import { readToken } from "@/lib/client-auth";

interface ProductDetail {
  id: string;
  name: string;
  modelCode: string;
  description: string | null;
  specs: Record<string, string> | null;
  brand: string;
  category: string;
  variants: Array<{
    id: string;
    sku: string;
    color: string | null;
    memory: string | null;
    listedPrice: number;
    salePrice: number | null;
    stock: number;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    author: string;
    createdAt: string;
  }>;
}

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [variantId, setVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const run = async () => {
      const response = await fetch(`/api/products/${params.slug}`);
      const payload = (await response.json()) as ProductDetail | { message?: string };
      if (!response.ok) {
        setMessage((payload as { message?: string }).message ?? "Khong the tai san pham.");
        setLoading(false);
        return;
      }
      const data = payload as ProductDetail;
      setProduct(data);
      if (data.variants.length > 0) {
        setVariantId(data.variants[0].id);
      }
      setLoading(false);
    };
    void run();
  }, [params.slug]);

  const activeVariant = useMemo(
    () => product?.variants.find((variant) => variant.id === variantId) ?? null,
    [product, variantId]
  );

  const addToCart = async () => {
    if (!readToken()) {
      router.push("/login");
      return;
    }
    if (!variantId) {
      setMessage("Hay chon bien the.");
      return;
    }
    try {
      await apiFetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({ variantId, quantity })
      });
      setMessage("Da them vao gio hang.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Them gio hang that bai.");
    }
  };

  if (loading) {
    return <main className="mx-auto max-w-6xl px-4 py-8">Dang tai...</main>;
  }
  if (!product) {
    return <main className="mx-auto max-w-6xl px-4 py-8 text-red-600">{message}</main>;
  }

  const effectivePrice = activeVariant
    ? activeVariant.salePrice ?? activeVariant.listedPrice
    : undefined;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/products" className="text-sm text-blue-600">
        ← Quay lai danh sach
      </Link>
      <div className="mt-3 grid gap-6 md:grid-cols-2">
        <section className="rounded-lg bg-white p-5">
          <p className="text-sm text-slate-500">
            {product.brand} - {product.category}
          </p>
          <h1 className="mt-1 text-2xl font-bold">{product.name}</h1>
          <p className="text-sm text-slate-500">Model: {product.modelCode}</p>
          <p className="mt-3 text-slate-700">{product.description ?? "Dang cap nhat mo ta."}</p>
          {effectivePrice ? (
            <p className="mt-4 text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat("vi-VN").format(effectivePrice)} VND
            </p>
          ) : null}
        </section>
        <section className="rounded-lg bg-white p-5">
          <h2 className="text-lg font-semibold">Chon bien the</h2>
          <select
            className="mt-3 w-full"
            value={variantId}
            onChange={(event) => setVariantId(event.target.value)}
          >
            {product.variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.sku} - {variant.color ?? "Mau mac dinh"} - {variant.memory ?? "Bo nho mac dinh"} - Ton{" "}
                {variant.stock}
              </option>
            ))}
          </select>
          <div className="mt-3 flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={10}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="w-24"
            />
            <button onClick={addToCart} className="rounded-md bg-blue-600 px-4 py-2 text-white">
              Them vao gio
            </button>
          </div>
          {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}
        </section>
      </div>

      <section className="mt-6 rounded-lg bg-white p-5">
        <h2 className="text-lg font-semibold">Thong so ky thuat</h2>
        {!product.specs || Object.keys(product.specs).length === 0 ? (
          <p className="mt-2 text-slate-600">Chua co thong so.</p>
        ) : (
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="rounded-md border border-slate-200 px-3 py-2">
                <p className="text-xs text-slate-500">{key}</p>
                <p className="font-medium">{String(value)}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-6 rounded-lg bg-white p-5">
        <h2 className="text-lg font-semibold">Danh gia</h2>
        {product.reviews.length === 0 ? (
          <p className="mt-2 text-slate-600">Chua co danh gia.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {product.reviews.map((review) => (
              <article key={review.id} className="rounded-md border border-slate-200 p-3">
                <p className="text-sm font-medium">{review.author}</p>
                <p className="text-xs text-slate-500">
                  {new Date(review.createdAt).toLocaleString("vi-VN")}
                </p>
                <p className="mt-1 text-sm">So sao: {review.rating}/5</p>
                <p className="mt-1 text-sm text-slate-700">{review.comment ?? "Khong co binh luan."}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

