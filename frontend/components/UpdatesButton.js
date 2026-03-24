"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import UpdateIcon from "@mui/icons-material/Update";
import { useTranslation } from "react-i18next";

const UpdatesButton = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [armed, setArmed] = useState(false);
  const { t } = useTranslation();

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
    <Link
      href="/updates"
      onClick={handleClick}
      className={`group fixed bottom-44 right-3 z-50 inline-flex h-11 w-11 max-w-[calc(100vw-2rem)] items-center overflow-hidden rounded-full bg-brandYellow pr-3 text-black shadow-lg transition-all duration-300 md:bottom-40 md:right-4 md:hover:w-32 md:hover:bg-yellow-400 ${
        armed ? "w-32 bg-yellow-400" : ""
      }`}
      aria-label={t("updates")}
    >
      <span className="ml-3 inline-flex h-6 w-6 items-center justify-center">
        <UpdateIcon sx={{ fontSize: 20 }} />
      </span>
      <span
        className={`ml-3 whitespace-nowrap text-sm font-semibold transition-opacity duration-200 ${
          armed ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"
        }`}
      >
        {t("updates")}
      </span>
    </Link>
  );
};

export default UpdatesButton;
