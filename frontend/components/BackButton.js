"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const BackButton = ({ fallbackHref = "/home", className = "" }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold transition hover:bg-white/10 ${className}`}
    >
      {t("back")}
    </button>
  );
};

export default BackButton;
