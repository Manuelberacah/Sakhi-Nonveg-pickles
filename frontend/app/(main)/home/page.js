"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../../../components/AppContext";
import ProductCard from "../../../components/ProductCard";

export default function HomePage() {
  const { products, loading } = useApp();
  const { t } = useTranslation();

  const content = useMemo(() => {
    if (loading) return <p>Loading products...</p>;

    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    );
  }, [loading, products]);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-brandYellow">{t("homeTitle")}</h1>
        <p className="mt-2 text-sm text-white/70">{t("homeTagline")}</p>
      </div>
      {content}
    </section>
  );
}
