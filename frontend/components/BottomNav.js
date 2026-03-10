"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useApp } from "./AppContext";

const NavItem = ({ href, label, active, count }) => (
  <Link
    href={href}
    className={`relative rounded-lg px-4 py-2 text-base font-semibold transition ${
      active ? "bg-brandYellow text-black" : "text-white hover:bg-white/10"
    }`}
  >
    {label}
    {count > 0 ? (
      <span className="ml-2 rounded-full bg-brandRed px-2 py-0.5 text-xs text-white">{count}</span>
    ) : null}
  </Link>
);

const BottomNav = () => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { cart, wishlist, user } = useApp();

  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 p-3">
        <NavItem href="/cart" label={t("cart")} active={pathname === "/cart"} count={cart.length} />
        <NavItem
          href="/wishlist"
          label={t("wishlist")}
          active={pathname === "/wishlist"}
          count={wishlist.length}
        />
      </div>
    </nav>
  );
};

export default BottomNav;
