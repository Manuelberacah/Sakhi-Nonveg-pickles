"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../../../components/AppContext";
import { useRouter } from "next/navigation";
import { getProductName } from "../../../lib/productI18n";

const regionCharges = {
  "andhra-pradesh": 80,
  "south-india": 120,
  "rest-of-india": 180
};

export default function CartPage() {
  const router = useRouter();
  const { cart, updateCartItem, removeCartItem, token } = useApp();
  const { i18n, t } = useTranslation();

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + item.quantity * (item.product?.prices?.[item.size] || 0),
        0
      ),
    [cart]
  );

  const deliveryCharge = regionCharges["rest-of-india"];
  const total = subtotal + deliveryCharge;

  if (!cart.length) return <p>Your cart is empty.</p>;

  return (
    <section className="space-y-5">
      {cart.map((item) => {
        const price = item.product.prices[item.size];
        const rowSubtotal = price * item.quantity;
        const productName = getProductName(item.product, i18n.language, t);

        return (
          <article key={`${item.product._id}-${item.size}`} className="brand-card p-4">
            <h3 className="text-lg font-semibold">{productName}</h3>
            <p className="text-sm text-white/70">Size: {item.size}</p>
            <p className="text-sm text-white/70">Price: Rs.{price}</p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                className="rounded bg-white/10 px-3 py-1"
                onClick={() => updateCartItem(item.product._id, item.size, item.quantity - 1)}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                type="button"
                className="rounded bg-white/10 px-3 py-1"
                onClick={() => updateCartItem(item.product._id, item.size, item.quantity + 1)}
              >
                +
              </button>
              <button
                type="button"
                onClick={() => removeCartItem(item.product._id, item.size)}
                className="ml-auto rounded bg-red-500 px-3 py-1 text-sm"
              >
                Remove
              </button>
            </div>
            <p className="mt-2 text-sm text-brandYellow">Subtotal: Rs.{rowSubtotal}</p>
          </article>
        );
      })}

      <div className="brand-card space-y-2 p-4">
        <p>Subtotal: Rs.{subtotal}</p>
        <p>Delivery Charge: Rs.{deliveryCharge}</p>
        <p className="text-xl font-bold">Total: Rs.{total}</p>
        <button
          type="button"
          className="brand-btn-primary mt-2 w-full text-center"
          onClick={() => {
            if (token) {
              router.push("/checkout");
            } else {
              router.push("/login?next=/checkout");
            }
          }}
        >
          Proceed to Checkout
        </button>
      </div>
    </section>
  );
}
