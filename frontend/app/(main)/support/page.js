"use client";

import { useTranslation } from "react-i18next";
import { whatsappUrl } from "../../../lib/whatsapp";

export default function SupportPage() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-2xl brand-card space-y-4 p-6">
      <h1 className="text-2xl font-bold text-brandYellow">{t("supportTitle")}</h1>
      <p>{t("supportPhone")}: 8015300905</p>
      <p>{t("supportEmail")}: sakhipickles.nonveg@gmail.com</p>
      <a
        href={whatsappUrl(t("supportWhatsappMsg"))}
        target="_blank"
        rel="noreferrer"
        className="brand-btn bg-green-500 text-white hover:bg-green-600"
      >
        {t("supportWhatsapp")}
      </a>
    </section>
  );
}
