"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useApp } from "../../../components/AppContext";
import ThemeToggle from "../../../components/ThemeToggle";

export default function SignupPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup } = useApp();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signup(form);
      const next = searchParams.get("next");
      router.push(next || "/home");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <motion.form
        onSubmit={handleSubmit}
        className="brand-card w-full space-y-4 p-6"
        initial={{ opacity: 0, y: 22, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
        <h1 className="text-2xl font-bold text-brandYellow">{t("signup")}</h1>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <input
          placeholder={t("name")}
          required
          className="adaptive-input w-full rounded-xl border p-3"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
        />
        <input
          type="email"
          placeholder={t("email")}
          required
          className="adaptive-input w-full rounded-xl border p-3"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder={t("password")}
          required
          className="adaptive-input w-full rounded-xl border p-3"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
        />
        <label className="adaptive-muted flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
          />
          {t("showPassword")}
        </label>
        <button className="brand-btn-primary w-full" type="submit">
          {t("signup")}
        </button>
        <p className="adaptive-muted text-sm">
          {t("alreadyRegistered")} <Link href="/login" className="text-brandYellow">{t("login")}</Link>
        </p>
      </motion.form>
    </main>
  );
}


