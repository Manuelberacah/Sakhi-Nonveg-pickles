"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import FallbackImage from "./FallbackImage";
import { getProductName } from "../lib/productI18n";

const ProductCard = ({ product }) => {
  const { t, i18n } = useTranslation();
  const productName = getProductName(product, i18n.language, t);

  return (
    <div className="brand-card overflow-hidden shadow-brand">
      <div className="relative h-44 w-full">
        <FallbackImage src={product.image} alt={productName} fill className="object-cover" />
      </div>
      <div className="space-y-3 p-4">
        <h3 className="text-lg font-semibold">{productName}</h3>
        <p className="text-sm text-white/70">
          {t("startingAt", { price: product.prices["250g"] })}
        </p>
        <Link href={`/product/${product._id}`} className="brand-btn-primary w-full text-center">
          {t("viewDetails")}
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
