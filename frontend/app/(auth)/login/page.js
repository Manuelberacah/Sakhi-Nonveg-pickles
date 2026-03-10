"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useApp } from "../../../components/AppContext";
import BackButton from "../../../components/BackButton";
import ThemeToggle from "../../../components/ThemeToggle";
import { api } from "../../../lib/api";

const ADMIN_EMAIL = "sakhipickles.nonveg@gmail.com";
const ADMIN_PASSWORD = "Chamundeswari@22";
const ADMIN_TOKEN_KEY = "sakhi_admin_token";

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { login } = useApp();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (
        form.email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
        form.password === ADMIN_PASSWORD
      ) {
        const res = await api.post("/admin/login", form);
        localStorage.setItem(ADMIN_TOKEN_KEY, res.data.token);
        router.push("/admin");
        return;
      }

      await login(form);
      router.push("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
        <div className="flex items-center justify-between">
          <BackButton fallbackHref="/landing" />
          <ThemeToggle />
        </div>
        <h1 className="text-2xl font-bold text-brandYellow">{t("login")}</h1>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
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
          {t("login")}
        </button>
        <p className="adaptive-muted text-sm">
          {t("newHere")} <Link href="/signup" className="text-brandYellow">{t("signup")}</Link>
        </p>
      </motion.form>
    </main>
  );
}

