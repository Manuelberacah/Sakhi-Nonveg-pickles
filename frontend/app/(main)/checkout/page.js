"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../../components/AppContext";
import { api } from "../../../lib/api";

const regions = [
  { value: "andhra-pradesh", label: "Andhra Pradesh (Rs.80)" },
  { value: "south-india", label: "South India (Rs.120)" },
  { value: "rest-of-india", label: "Rest of India (Rs.180)" }
];

const regionCharge = {
  "andhra-pradesh": 80,
  "south-india": 120,
  "rest-of-india": 180
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, user } = useApp();
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [region, setRegion] = useState("andhra-pradesh");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("info");
  const [loading, setLoading] = useState(false);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity * item.product.prices[item.size], 0),
    [cart]
  );

  const delivery = regionCharge[region];
  const total = subtotal + delivery;

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    setStatusType("info");

    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        setStatus("Razorpay failed to load. Please try again.");
        setStatusType("error");
        return;
      }

      const orderRes = await api.post("/orders/razorpay/order", { address, pincode, region });
      const { orderId, amount, currency, keyId } = orderRes.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "Sakhi Non-Veg Pickles",
        description: "Order payment",
        order_id: orderId,
        prefill: {
          name: user?.name || "",
          email: user?.email || ""
        },
        handler: async (response) => {
          try {
            await api.post("/orders/razorpay/verify", {
              ...response,
              address,
              pincode,
              region
            });
            await clearCart();
            setStatus("Order placed successfully. Confirmation sent to Sakhi team.");
            setStatusType("success");
            setTimeout(() => router.push("/home"), 1500);
          } catch (error) {
            setStatus(error.response?.data?.message || "Payment verification failed");
            setStatusType("error");
          }
        },
        modal: {
          ondismiss: () => {
            setStatus("Payment cancelled. Please try again.");
            setStatusType("error");
          }
        },
        theme: { color: "#C10F1A" }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", () => {
        setStatus("Payment failed. Please try again.");
        setStatusType("error");
      });
      razorpay.open();
    } catch (error) {
      setStatus(error.response?.data?.message || "Failed to place order");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length) return <p>Add items to cart before checkout.</p>;

  return (
    <section className="mx-auto max-w-2xl">
      <form onSubmit={handleOrder} className="brand-card space-y-4 p-5">
        <h1 className="text-2xl font-bold text-brandYellow">Checkout</h1>
        <textarea
          required
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="h-24 w-full rounded-xl border border-white/20 bg-black/30 p-3"
        />
        <input
          required
          placeholder="Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          className="w-full rounded-xl border border-white/20 bg-black/30 p-3"
        />
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full rounded-xl border border-white/20 bg-black/30 p-3"
        >
          {regions.map((item) => (
            <option key={item.value} value={item.value} className="text-black">
              {item.label}
            </option>
          ))}
        </select>

        <div className="rounded-xl bg-white/5 p-3 text-sm">
          <p>Subtotal: Rs.{subtotal}</p>
          <p>Delivery: Rs.{delivery}</p>
          <p className="mt-1 text-lg font-bold">Total: Rs.{total}</p>
        </div>

        <button disabled={loading} className="brand-btn-primary w-full" type="submit">
          {loading ? "Placing order..." : "Place Order"}
        </button>
        {status ? (
          <div
            className={`rounded-xl border px-3 py-2 text-sm ${
              statusType === "success"
                ? "border-green-500/40 bg-green-500/10 text-green-200"
                : statusType === "error"
                  ? "border-red-500/40 bg-red-500/10 text-red-200"
                  : "border-white/10 bg-white/5 text-white/80"
            }`}
          >
            {status}
          </div>
        ) : null}
      </form>
    </section>
  );
}
