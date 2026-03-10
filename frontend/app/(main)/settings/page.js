"use client";

import { useTranslation } from "react-i18next";
import LanguageSwitch from "../../../components/LanguageSwitch";
import ThemeToggle from "../../../components/ThemeToggle";

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold text-brandYellow">{t("settings")}</h1>
      <div className="brand-card p-4">
        <p className="mb-3 text-sm font-semibold text-brandYellow">{t("theme")}</p>
        <ThemeToggle />
      </div>
      <LanguageSwitch />
    </section>
  );
}
