"use client";

import "../lib/i18n";
import { I18nextProvider } from "react-i18next";
import i18n from "../lib/i18n";
import { AppProvider } from "./AppContext";
import { ThemeProvider } from "./ThemeContext";
import { useEffect, useState } from "react";

const Providers = ({ children }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("sakhi_lang");
    if (stored && stored !== i18n.language) {
      i18n.changeLanguage(stored);
    }
    if (stored && document?.documentElement) {
      document.documentElement.lang = stored;
    }
    setReady(true);
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <AppProvider>{children}</AppProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
};

export default Providers;
