"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import UpdateIcon from "@mui/icons-material/Update";
import { useTranslation } from "react-i18next";

const UpdatesButton = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => setMounted(true), []);

  const hiddenOn = ["/", "/landing", "/login", "/signup"];
  if (!mounted || hiddenOn.includes(pathname)) return null;

  return (
    <Link
      href="/updates"
      className="group fixed bottom-44 right-4 z-50 inline-flex h-11 w-11 items-center overflow-hidden rounded-full bg-brandYellow pr-3 text-black shadow-lg transition-all duration-300 hover:w-32 hover:bg-yellow-400 md:bottom-40"
      aria-label={t("updates")}
    >
      <span className="ml-3 inline-flex h-6 w-6 items-center justify-center">
        <UpdateIcon sx={{ fontSize: 20 }} />
      </span>
      <span className="ml-3 whitespace-nowrap text-sm font-semibold opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {t("updates")}
      </span>
    </Link>
  );
};

export default UpdatesButton;
