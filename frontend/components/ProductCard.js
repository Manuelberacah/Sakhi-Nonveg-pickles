"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import FallbackImage from "./FallbackImage";

const ProductCard = ({ product }) => {
  const { t } = useTranslation();

  return (
    <div className="brand-card overflow-hidden shadow-brand">
      <div className="relative h-44 w-full">
        <FallbackImage src={product.image} alt={product.name} fill className="object-cover" />
      </div>
      <div className="space-y-3 p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-white/70">Starting at Rs.{product.prices["250g"]}</p>
        <Link href={`/product/${product._id}`} className="brand-btn-primary w-full text-center">
          {t("viewDetails")}
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
