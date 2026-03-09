"use client";

import "../lib/i18n";
import { I18nextProvider } from "react-i18next";
import i18n from "../lib/i18n";
import { AppProvider } from "./AppContext";
import { ThemeProvider } from "./ThemeContext";

const Providers = ({ children }) => {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <AppProvider>{children}</AppProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
};

export default Providers;
