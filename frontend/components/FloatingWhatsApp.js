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
  const [isMobile, setIsMobile] = useState(false);
  const [armed, setArmed] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!armed) return undefined;
    const timer = setTimeout(() => setArmed(false), 2500);
    return () => clearTimeout(timer);
  }, [armed]);

  useEffect(() => {
    setArmed(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleReset = () => setArmed(false);
    window.addEventListener("blur", handleReset);
    document.addEventListener("visibilitychange", handleReset);
    return () => {
      window.removeEventListener("blur", handleReset);
      document.removeEventListener("visibilitychange", handleReset);
    };
  }, []);

  const hiddenOn = ["/", "/landing", "/login", "/signup", "/admin"];
  if (!mounted || hiddenOn.includes(pathname)) return null;

  const handleClick = (event) => {
    if (!isMobile) return;
    if (!armed) {
      event.preventDefault();
      setArmed(true);
      return;
    }
    setArmed(false);
  };

  return (
    <a
      href={whatsappUrl("Hello, I want to know more about Sakhi Non-Veg Pickles.")}
      target="_blank"
      rel="noreferrer"
      onClick={handleClick}
      className={`group fixed bottom-28 right-3 z-50 inline-flex h-12 w-12 max-w-[calc(100vw-2rem)] items-center overflow-hidden rounded-full bg-green-500 pr-4 text-white shadow-lg transition-all duration-300 md:bottom-24 md:right-4 md:hover:w-64 md:hover:bg-green-600 ${
        armed ? "w-[calc(100vw-2.5rem)] bg-green-600 md:w-64" : ""
      }`}
      aria-label={t("chatWhatsapp")}
    >
      <span className="ml-3 inline-flex h-6 w-6 items-center justify-center">
        <WhatsAppIcon sx={{ fontSize: 22 }} />
      </span>
      <span
        className={`ml-3 whitespace-nowrap text-sm font-semibold transition-opacity duration-200 ${
          armed ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"
        }`}
      >
        {t("chatWhatsapp")}
      </span>
    </a>
  );
};

export default FloatingWhatsApp;
