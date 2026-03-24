"use client";

import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { whatsappUrl } from "../lib/whatsapp";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const FloatingWhatsApp = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const hiddenOn = ["/", "/landing", "/login", "/signup"];
  if (!mounted || hiddenOn.includes(pathname)) return null;

  return (
    <a
      href={whatsappUrl("Hello, I want to know more about Sakhi Non-Veg Pickles.")}
      target="_blank"
      rel="noreferrer"
      className="group fixed bottom-28 right-4 z-50 inline-flex h-12 w-12 items-center overflow-hidden rounded-full bg-green-500 pr-4 text-white shadow-lg transition-all duration-300 hover:w-64 hover:bg-green-600 md:bottom-24"
      aria-label={t("chatWhatsapp")}
    >
      <span className="ml-3 inline-flex h-6 w-6 items-center justify-center">
        <WhatsAppIcon sx={{ fontSize: 22 }} />
      </span>
      <span className="ml-3 whitespace-nowrap text-sm font-semibold opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {t("chatWhatsapp")}
      </span>
    </a>
  );
};

export default FloatingWhatsApp;
