"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../../../../components/AppContext";
import FallbackImage from "../../../../components/FallbackImage";
import { getProductDescription, getProductName } from "../../../../lib/productI18n";
import { whatsappUrl } from "../../../../lib/whatsapp";

const sizes = ["250g", "500g", "1kg"];

export default function ProductDetailsPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const { products, addToCart, toggleWishlist, wishlist } = useApp();
  const [size, setSize] = useState("250g");
  const [status, setStatus] = useState("");

  const product = useMemo(() => products.find((item) => item._id === id), [products, id]);

  if (!product) return <p>Loading product...</p>;

  const price = product.prices[size];
  const inWishlist = wishlist.some((item) => item._id === product._id);
  const productName = getProductName(product, i18n.language, t);
  const productDescription = getProductDescription(product, i18n.language, t);

  const handleAddCart = async () => {
    await addToCart(product._id, size, 1);
    setStatus("Added to cart");
  };

  const handleWishlist = async () => {
    await toggleWishlist(product._id);
    setStatus(inWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <section className="grid gap-8 lg:grid-cols-2">
      <div className="relative h-80 overflow-hidden rounded-2xl border border-white/10">
        <FallbackImage src={product.image} alt={productName} fill className="object-cover" />
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-black text-brandYellow">{productName}</h1>
        <p className="text-white/80">{productDescription}</p>

        <div>
          <p className="mb-2 text-sm text-white/70">Select size</p>
          <div className="flex gap-3">
            {sizes.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSize(option)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                  size === option ? "bg-brandYellow text-black" : "bg-white/10"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <p className="text-2xl font-bold">Rs.{price}</p>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={handleAddCart} className="brand-btn-primary">
            {t("addToCart")}
          </button>
          <button type="button" onClick={handleWishlist} className="brand-btn-secondary">
            {t("addToWishlist")}
          </button>
          <a
            href={whatsappUrl(
              `I want to order ${productName} - ${size} (Rs.${price}) from Sakhi Non-Veg Pickles.`
            )}
            target="_blank"
            rel="noreferrer"
            className="brand-btn bg-green-500 text-white hover:bg-green-600"
          >
            {t("orderOnWhatsapp")}
          </a>
        </div>

        {status ? <p className="text-sm text-brandYellow">{status}</p> : null}
      </div>
    </section>
  );
}
