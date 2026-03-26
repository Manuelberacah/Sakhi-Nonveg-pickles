"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../../components/AppContext";
import { api } from "../../../lib/api";
import { useTranslation } from "react-i18next";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, user } = useApp();
  const { t } = useTranslation();
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [pincodeInfo, setPincodeInfo] = useState(null);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("info");
  const [loading, setLoading] = useState(false);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity * item.product.prices[item.size], 0),
    [cart]
  );

  const delivery = pincodeInfo?.deliveryCharge || 0;
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
        setStatus(t("razorpayLoadFail"));
        setStatusType("error");
        return;
      }

      if (!/^\d{6}$/.test(String(pincode || "").trim())) {
        setStatus(t("pincodeEnterValid"));
        setStatusType("error");
        return;
      }
      if (!pincodeInfo) {
        setStatus(t("pincodeEnterToContinue"));
        setStatusType("error");
        return;
      }

      const orderRes = await api.post("/orders/razorpay/order", { address, pincode });
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
              pincode
            });
            await clearCart();
            setStatus(t("orderPlacedSuccess"));
            setStatusType("success");
            setTimeout(() => router.push("/home"), 1500);
          } catch (error) {
            setStatus(error.response?.data?.message || t("paymentVerifyFailed"));
            setStatusType("error");
          }
        },
        modal: {
          ondismiss: () => {
            setStatus(t("paymentCancelled"));
            setStatusType("error");
          }
        },
        theme: { color: "#C10F1A" }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", () => {
        setStatus(t("paymentFailed"));
        setStatusType("error");
      });
      razorpay.open();
    } catch (error) {
      setStatus(error.response?.data?.message || t("orderPlaceFailed"));
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length) return <p>{t("addItemsBeforeCheckout")}</p>;

  return (
    <section className="mx-auto max-w-2xl">
      <form onSubmit={handleOrder} className="brand-card space-y-4 p-5">
        <h1 className="text-2xl font-bold text-brandYellow">{t("checkoutTitle")}</h1>
        <textarea
          required
          placeholder={t("addressPlaceholder")}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="h-24 w-full rounded-xl border border-white/20 bg-black/30 p-3"
        />
        <input
          required
          placeholder={t("pincodePlaceholder")}
          value={pincode}
          onChange={async (e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 6);
            setPincode(value);
            if (value.length > 0 && value.length < 6) {
              setPincodeError(t("pincodeMustBe6"));
              setPincodeInfo(null);
              return;
            }
            if (value.length === 6) {
              setPincodeLoading(true);
              try {
                const res = await api.get(`/orders/pincode/${value}`);
                setPincodeInfo(res.data);
                setPincodeError("");
              } catch (error) {
                setPincodeInfo(null);
                setPincodeError(error.response?.data?.message || t("pincodeEnterValid"));
              } finally {
                setPincodeLoading(false);
              }
            } else {
              setPincodeError("");
              setPincodeInfo(null);
            }
          }}
          className="w-full rounded-xl border border-white/20 bg-black/30 p-3"
        />
        {pincodeError ? <p className="text-sm text-red-400">{pincodeError}</p> : null}
        {pincodeLoading ? <p className="text-sm text-white/70">{t("pincodeChecking")}</p> : null}
        {pincodeInfo ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/85">
            <p>
              {pincodeInfo.district}, {pincodeInfo.state}
            </p>
            <p className="mt-1 text-brandYellow">
              {t("deliveryLabel")}: Rs.{pincodeInfo.deliveryCharge}
            </p>
          </div>
        ) : null}

        <div className="rounded-xl bg-white/5 p-3 text-sm">
          <p>
            {t("subtotalLabel")}: Rs.{subtotal}
          </p>
          <p>
            {t("deliveryLabel")}: Rs.{delivery}
          </p>
          <p className="mt-1 text-lg font-bold">
            {t("totalLabel")}: Rs.{total}
          </p>
        </div>

        <button disabled={loading} className="brand-btn-primary w-full" type="submit">
          {loading ? t("placingOrder") : t("placeOrder")}
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
