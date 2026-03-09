"use client";

import i18n from "../lib/i18n";
import { useTranslation } from "react-i18next";

const LanguageSwitch = () => {
  const { t } = useTranslation();

  return (
    <div className="brand-card p-4">
      <p className="mb-3 text-sm font-semibold text-brandYellow">{t("language")}</p>
      <div className="flex gap-3">
        <button type="button" onClick={() => i18n.changeLanguage("en")} className="brand-btn-primary">
          {t("english")}
        </button>
        <button type="button" onClick={() => i18n.changeLanguage("te")} className="brand-btn-secondary">
          {t("telugu")}
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitch;
