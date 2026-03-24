"use client";

import { useTranslation } from "react-i18next";
import { useTheme } from "./ThemeContext";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20 ${className}`}
    >
      {theme === "dark" ? t("lightMode") : t("darkMode")}
    </button>
  );
};

export default ThemeToggle;
