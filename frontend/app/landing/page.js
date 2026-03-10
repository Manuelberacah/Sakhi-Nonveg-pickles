"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import i18n from "../../lib/i18n";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../../components/ThemeToggle";

export default function LandingPage() {
  const { t } = useTranslation();
  const [logoSrc, setLogoSrc] = useState("/brand/logo.png");
  const [heroSrc, setHeroSrc] = useState("/brand/logo-full.png.jpg");
  const [showLang, setShowLang] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("sakhi_lang");
    const allowed = ["en", "te"];
    if (stored && allowed.includes(stored)) {
      i18n.changeLanguage(stored);
    }
  }, []);

  const setLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("sakhi_lang", lang);
    if (document?.documentElement) {
      document.documentElement.lang = lang;
    }
    setShowLang(false);
  };

  const sections = [
    {
      image: "/products/chicken.png.jpg",
      title: t("landingSection1Title"),
      description: t("landingSection1Desc")
    },
    {
      image: "/products/mutton.png.jpg",
      title: t("landingSection2Title"),
      description: t("landingSection2Desc")
    },
    {
      image: "/products/prawn.png.png",
      title: t("landingSection3Title"),
      description: t("landingSection3Desc")
    },
    {
      image: "/products/fish.png.jpg",
      title: t("landingSection4Title"),
      description: t("landingSection4Desc")
    },
    {
      image: "/products/gongura-chicken.png.jpg",
      title: t("landingSection5Title"),
      description: t("landingSection5Desc")
    }
  ];

  return (
    <main className="pb-16">
      <AnimatePresence>
        {showLang ? (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="brand-card w-full max-w-sm space-y-4 p-6"
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.99 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-xl font-bold text-brandYellow">{t("landingChooseLanguageTitle")}</h2>
              <p className="adaptive-muted text-sm">{t("landingChooseLanguageBody")}</p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setLanguage("en")} className="brand-btn-primary w-full">
                  {t("english")}
                </button>
                <button type="button" onClick={() => setLanguage("te")} className="brand-btn-secondary w-full">
                  {t("telugu")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      {showLang ? null : (
        <>
          <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/75 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-12 overflow-hidden rounded-lg border border-white/20 bg-black">
              <Image
                src={logoSrc}
                alt="Sakhi logo"
                fill
                className="object-cover"
                onError={() => setLogoSrc("/brand/logo-full.png.jpg")}
              />
            </div>
            <p className="text-sm font-bold text-brandYellow md:text-base">{t("brandName")}</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold">
              {t("login")}
            </Link>
            <Link href="/signup" className="brand-btn-primary text-sm">
              {t("signup")}
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 pb-10 pt-28 md:pt-32">
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-brandRed/25 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-brandYellow/20 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative mx-auto grid max-w-6xl gap-6 rounded-3xl border border-white/10 bg-black/40 p-5 md:grid-cols-[1.15fr_0.85fr] md:p-8"
        >
          <div className="space-y-4">
            <p className="inline-block rounded-full bg-brandRed/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brandYellow">
              {t("landingPill")}
            </p>
            <h1 className="text-3xl font-black leading-tight text-brandYellow md:text-5xl">
              {t("landingHeadline")}
            </h1>
            <p className="max-w-2xl text-base text-white/85 md:text-lg">
              {t("landingIntro")}
            </p>
            <div className="grid gap-2 text-sm text-white/90">
              <p>
                <span className="font-semibold text-brandYellow">{t("landingPhoneLabel")}:</span> 8143156089, 80153 0090
              </p>
              <p>
                <span className="font-semibold text-brandYellow">{t("landingEmailLabel")}:</span>{" "}
                sakhinonvegsakhipickles.nonveg@gmail.com
              </p>
              <p>
                <span className="font-semibold text-brandYellow">{t("landingAddressLabel")}:</span> Anand Gokulam,
                Teacher&apos;s layout, 301, Kommadi Rd, Gandhi Nagar, Madhurawada, Andhra Pradesh 530048
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="https://www.instagram.com/sakhi_nonveg_pickles_/"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-700"
              >
                {t("landingInstagram")}
              </a>
              <a
                href="https://share.google/6HNSsh5Xaf5BHq8sQ"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                {t("landingGoogle")}
              </a>
              <a
                href="https://maps.app.goo.gl/Jim7dmA1hwJJVc887?g_st=aw"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                {t("landingOpenMap")}
              </a>
            </div>
          </div>

          <div className="relative min-h-[260px] overflow-hidden rounded-2xl border border-white/15">
            <Image
              src={heroSrc}
              alt="Sakhi Non-Veg Pickles logo"
              fill
              className="object-cover"
              onError={() => setHeroSrc("/brand/logo.png")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          </div>
        </motion.div>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col gap-12 px-4">
        {sections.map((item, index) => {
          const reverse = index % 2 === 1;
          return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7 }}
              className={`grid items-center gap-6 rounded-2xl border border-white/10 bg-black/35 p-4 md:p-6 ${
                reverse ? "md:grid-cols-[0.95fr_1.05fr]" : "md:grid-cols-[1.05fr_0.95fr]"
              }`}
            >
              <div className={`${reverse ? "md:order-2" : ""} relative h-64 overflow-hidden rounded-2xl border border-white/10`}>
                <Image src={item.image} alt={item.title} fill className="object-cover transition duration-500 hover:scale-105" />
              </div>
              <div className={`${reverse ? "md:order-1" : ""} space-y-3`}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brandRed">{t("landingStoryLabel")}</p>
                <h2 className="text-2xl font-black text-brandYellow md:text-3xl">{item.title}</h2>
                <p className="text-white/85">{item.description}</p>
              </div>
            </motion.article>
          );
        })}
      </section>
        </>
      )}
    </main>
  );
}
