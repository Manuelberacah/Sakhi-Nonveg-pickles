"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "./AppContext";

const UpdatesButton = () => {
  const pathname = usePathname();
  const { token } = useApp();

  const hiddenOn = ["/", "/landing", "/login", "/signup"];
  if (!token || hiddenOn.includes(pathname)) return null;

  return (
    <Link
      href="/updates"
      className="fixed bottom-36 right-4 z-50 rounded-full bg-brandYellow px-4 py-3 text-sm font-semibold text-black shadow-lg transition hover:bg-yellow-400 md:bottom-40"
    >
      Updates
    </Link>
  );
};

export default UpdatesButton;
