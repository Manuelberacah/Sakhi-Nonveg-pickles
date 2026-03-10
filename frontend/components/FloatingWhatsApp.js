"use client";

import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useApp } from "./AppContext";
import { whatsappUrl } from "../lib/whatsapp";

const FloatingWhatsApp = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { token } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const hiddenOn = ["/", "/landing", "/login", "/signup"];
  if (!mounted || !token || hiddenOn.includes(pathname)) return null;

  return (
    <a
      href={whatsappUrl("Hello, I want to know more about Sakhi Non-Veg Pickles.")}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-20 right-4 z-50 rounded-full bg-green-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-green-600 md:bottom-24"
    >
      {t("chatWhatsapp")}
    </a>
  );
};

export default FloatingWhatsApp;
