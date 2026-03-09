"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useApp } from "../../../components/AppContext";
import FallbackImage from "../../../components/FallbackImage";

export default function WishlistPage() {
  const { wishlist } = useApp();

  const empty = useMemo(() => wishlist.length === 0, [wishlist]);

  if (empty) {
    return <p>Your wishlist is empty.</p>;
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {wishlist.map((item) => (
        <article key={item._id} className="brand-card overflow-hidden">
          <div className="relative h-40">
            <FallbackImage src={item.image} alt={item.name} fill className="object-cover" />
          </div>
          <div className="p-4">
            <h2 className="font-semibold">{item.name}</h2>
            <p className="text-sm text-white/70">Starting at Rs.{item.prices["250g"]}</p>
            <Link href={`/product/${item._id}`} className="brand-btn-primary mt-3 w-full text-center">
              View
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}
