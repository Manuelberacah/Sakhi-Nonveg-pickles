"use client";

import i18n from "../lib/i18n";
import { useTranslation } from "react-i18next";

const LanguageSwitch = () => {
  const { t } = useTranslation();
  const setLanguage = (lang) => {
    i18n.changeLanguage(lang);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("sakhi_lang", lang);
      if (document?.documentElement) {
        document.documentElement.lang = lang;
      }
    }
  };

  return (
    <div className="brand-card p-4">
      <p className="mb-3 text-sm font-semibold text-brandYellow">{t("language")}</p>
      <div className="flex gap-3">
        <button type="button" onClick={() => setLanguage("en")} className="brand-btn-primary">
          {t("english")}
        </button>
        <button type="button" onClick={() => setLanguage("te")} className="brand-btn-secondary">
          {t("telugu")}
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitch;
