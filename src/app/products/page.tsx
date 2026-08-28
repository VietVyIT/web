"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  modelCode: string;
  brand: string;
  category: string;
  avgRating: number;
  variants: Array<{ effectivePrice: number; stock: number }>;
}

export default function ProductsPage() {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const brands = useMemo(() => Array.from(new Set(items.map((item) => item.brand))), [items]);
  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category))),
    [items]
  );
  const [brandFilter, setBrandFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (sort) params.set("sort", sort);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    const response = await fetch(`/api/products?${params.toString()}`);
    const payload = (await response.json()) as ProductItem[] | { message?: string };
    if (!response.ok) {
      setError((payload as { message?: string }).message ?? "Khong the tai san pham.");
      setItems([]);
      setLoading(false);
      return;
    }
    setItems(payload as ProductItem[]);
    setLoading(false);
  };

  useEffect(() => {
    void loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredByUi = items.filter((item) => {
    if (brandFilter && item.brand !== brandFilter) return false;
    if (categoryFilter && item.category !== categoryFilter) return false;
    return true;
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void loadProducts();
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">Danh sach san pham</h1>
      <form onSubmit={onSubmit} className="mt-4 grid gap-3 rounded-lg bg-white p-4 md:grid-cols-6">
        <input
          placeholder="Tim theo ten/model"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          className="md:col-span-2"
        />
        <input
          placeholder="Gia tu"
          value={minPrice}
          onChange={(event) => setMinPrice(event.target.value)}
          type="number"
        />
        <input
          placeholder="Gia den"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
          type="number"
        />
        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="newest">Moi nhat</option>
          <option value="price_asc">Gia tang dan</option>
          <option value="price_desc">Gia giam dan</option>
          <option value="rating_desc">Danh gia cao</option>
        </select>
        <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-white">
          Tim
        </button>
      </form>

      <div className="mt-4 grid gap-3 rounded-lg bg-white p-4 md:grid-cols-2">
        <select value={brandFilter} onChange={(event) => setBrandFilter(event.target.value)}>
          <option value="">Tat ca thuong hieu</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
        <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
          <option value="">Tat ca danh muc</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {loading ? <p className="mt-6">Dang tai...</p> : null}
      {error ? <p className="mt-6 text-red-600">{error}</p> : null}
      {!loading && !error && filteredByUi.length === 0 ? (
        <p className="mt-6 text-slate-600">Khong tim thay san pham phu hop.</p>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredByUi.map((item) => {
          const lowPrice = Math.min(...item.variants.map((variant) => variant.effectivePrice));
          const totalStock = item.variants.reduce((sum, variant) => sum + variant.stock, 0);
          return (
            <article key={item.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">
                {item.brand} - {item.category}
              </p>
              <h2 className="mt-1 text-lg font-semibold">{item.name}</h2>
              <p className="mt-1 text-sm text-slate-600">Model: {item.modelCode}</p>
              <p className="mt-3 text-xl font-bold text-blue-600">
                {new Intl.NumberFormat("vi-VN").format(lowPrice)} VND
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Danh gia {item.avgRating.toFixed(1)} - Con hang {totalStock}
              </p>
              <Link
                href={`/products/${item.slug}`}
                className="mt-4 inline-block rounded-md bg-slate-900 px-4 py-2 text-white"
              >
                Xem chi tiet
              </Link>
            </article>
          );
        })}
      </div>
    </main>
  );
}

