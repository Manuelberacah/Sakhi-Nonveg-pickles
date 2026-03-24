"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../../../components/AppContext";
import { getProductName } from "../../../lib/productI18n";
import { api } from "../../../lib/api";

export default function ProfilePage() {
  const { user, token, products } = useApp();
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      if (!token) return;
      setLoadingOrders(true);
      try {
        const res = await api.get("/orders/my-orders");
        setOrders(res.data || []);
      } catch (error) {
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, [token]);

  return (
    <section className="mx-auto max-w-xl space-y-6">
      <div className="brand-card p-6">
        <h1 className="text-2xl font-bold text-brandYellow">{t("profile")}</h1>
        <div className="mt-4 space-y-2 text-sm">
          <p>
            <span className="text-white/70">{t("name")}:</span> {user?.name}
          </p>
          <p>
            <span className="text-white/70">{t("emailOrPhone")}:</span>{" "}
            {user?.email || user?.phone || "-"}
          </p>
        </div>
      </div>

      <div className="brand-card p-6">
        <h2 className="text-lg font-semibold text-brandYellow">{t("yourOrders")}</h2>
        {loadingOrders ? <p className="text-sm text-white/70">{t("loadingOrders")}</p> : null}
        {!loadingOrders && orders.length === 0 ? (
          <p className="text-sm text-white/70">{t("noOrders")}</p>
        ) : null}
        <div className="mt-4 space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-white/80">
                <span>{t("orderId")}: {order._id.slice(-6)}</span>
                <span>{t("orderPlaced")}: {new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div className="mt-2 space-y-1 text-sm text-white/80">
                {order.items?.map((item) => {
                  const product = products.find((entry) => entry._id === item.productId);
                  const itemName = product
                    ? getProductName(product, i18n.language, t)
                    : item.name;
                  return (
                    <p key={`${order._id}-${item.productId}-${item.size}`}>
                      {itemName} ({item.size}) x {item.quantity} = Rs.{item.subtotal}
                    </p>
                  );
                })}
              </div>
              <p className="mt-2 text-sm font-semibold text-brandYellow">
                {t("orderTotal")}: Rs.{order.totalAmount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
