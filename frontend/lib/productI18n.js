"use client";

const isTelugu = (language = "") => language.toLowerCase().startsWith("te");

export const getProductName = (product, language, t) => {
  if (!product) return "";
  if (isTelugu(language)) {
    if (product.nameTe) return product.nameTe;
    if (typeof t === "function") {
      return t(`product.${product.slug}`, { defaultValue: product.name });
    }
  }
  return product.name;
};

export const getProductDescription = (product, language, t) => {
  if (!product) return "";
  if (isTelugu(language) && product.descriptionTe) {
    return product.descriptionTe;
  }
  if (isTelugu(language) && typeof t === "function") {
    return t(`productDesc.${product.slug}`, { defaultValue: product.description });
  }
  return product.description;
};
