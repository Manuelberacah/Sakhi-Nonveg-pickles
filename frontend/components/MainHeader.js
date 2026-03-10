"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useApp } from "./AppContext";
import BackButton from "./BackButton";
import ThemeToggle from "./ThemeToggle";

const MainHeader = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, logout } = useApp();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    setOpen(false);
    logout();
    router.push("/login");
  };

  useEffect(() => {
    const onDocClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <BackButton />
          <Link href="/home" className="text-lg font-extrabold text-brandYellow">
            Sakhi Non-Veg Pickles
          </Link>
        </div>
        <div
          ref={dropdownRef}
          className="relative flex items-center gap-3"
        >
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-xl bg-brandRed px-4 py-2 text-sm font-semibold"
          >
            {user?.name || t("profile")}
          </button>
          {open ? (
            <div className="absolute right-0 top-full z-50 mt-2 w-48 space-y-1 rounded-xl border border-white/10 bg-black p-2">
              <Link
                href="/updates"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm hover:bg-white/10"
              >
                {t("updates")}
              </Link>
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm hover:bg-white/10"
              >
                {t("settings")}
              </Link>
              <Link
                href="/support"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm hover:bg-white/10"
              >
                {t("support")}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10"
              >
                {t("logout")}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
