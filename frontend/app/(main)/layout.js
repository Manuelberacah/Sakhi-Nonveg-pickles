"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import MainHeader from "../../components/MainHeader";
import BottomNav from "../../components/BottomNav";
import { useApp } from "../../components/AppContext";

const MainLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { token, loading } = useApp();

  useEffect(() => {
    if (!loading && !token && pathname !== "/login" && pathname !== "/signup") {
      router.push("/login");
    }
  }, [token, loading, pathname, router]);

  return (
    <>
      <MainHeader />
      <main className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-28 pt-6">{children}</main>
      <BottomNav />
    </>
  );
};

export default MainLayout;
