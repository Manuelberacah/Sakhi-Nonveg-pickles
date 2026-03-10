"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp } from "./AppContext";
import { useTranslation } from "react-i18next";

const UpdatesButton = () => {
  const pathname = usePathname();
  const { token } = useApp();
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => setMounted(true), []);

  const hiddenOn = ["/", "/landing", "/login", "/signup"];
  if (!mounted || !token || hiddenOn.includes(pathname)) return null;

  return (
    <Link
      href="/updates"
      className="fixed bottom-36 right-4 z-50 rounded-full bg-brandYellow px-4 py-3 text-sm font-semibold text-black shadow-lg transition hover:bg-yellow-400 md:bottom-40"
    >
      {t("updates")}
    </Link>
  );
};

export default UpdatesButton;
