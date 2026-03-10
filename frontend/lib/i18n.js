"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./translations";

const DEFAULT_LANG = "en";

const getInitialLanguage = () => {
  if (typeof window === "undefined") {
    return DEFAULT_LANG;
  }
  const stored = window.localStorage.getItem("sakhi_lang");
  return stored || DEFAULT_LANG;
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: DEFAULT_LANG,
    interpolation: {
      escapeValue: false
    }
  });
}

export default i18n;
