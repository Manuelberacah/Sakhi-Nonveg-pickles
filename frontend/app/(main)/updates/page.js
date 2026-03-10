"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../../../components/AppContext";

const types = ["update", "post", "reel"];
const ADMIN_TOKEN_KEY = "sakhi_admin_token";

const isImageUrl = (url = "") => /\.(png|jpe?g|webp|gif|avif|svg)(\?.*)?$/i.test(url);
const isVideoUrl = (url = "") => /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);

const youtubeEmbedUrl = (url = "") => {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/i);
  if (!yt) return "";
  return `https://www.youtube.com/embed/${yt[1]}`;
};

const instagramEmbedUrl = (url = "") => {
  if (!/instagram\.com/i.test(url)) return "";
  const clean = url.replace(/\?.*$/, "").replace(/\/$/, "");
  if (clean.endsWith("/embed")) return clean;
  return `${clean}/embed`;
};

const MediaPreview = ({ mediaUrl, openLabel }) => {
  if (!mediaUrl) return null;

  const yt = youtubeEmbedUrl(mediaUrl);
  if (yt) {
    return (
      <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
        <iframe
          src={yt}
          title="YouTube update"
          className="h-72 w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  if (isImageUrl(mediaUrl)) {
    return (
      <img
        src={mediaUrl}
        alt="Update media"
        className="mt-3 w-full rounded-xl border border-white/10 object-cover"
      />
    );
  }

  if (isVideoUrl(mediaUrl)) {
    return (
      <video
        className="mt-3 w-full rounded-xl border border-white/10"
        controls
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={mediaUrl} />
      </video>
    );
  }

  const ig = instagramEmbedUrl(mediaUrl);
  if (ig) {
    return (
      <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
        <iframe
          src={`${ig}?autoplay=1`}
          title="Instagram update"
          className="h-[620px] w-full md:h-[720px]"
          scrolling="no"
          allow="autoplay; encrypted-media; clipboard-write; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <a
      href={mediaUrl}
      target="_blank"
      rel="noreferrer"
      className="mt-2 inline-block text-sm text-green-400 underline"
    >
      {openLabel}
    </a>
  );
};

export default function UpdatesPage() {
  const { updates, createUpdate, removeUpdate, token } = useApp();
  const { t } = useTranslation();
  const [adminToken, setAdminToken] = useState("");
  const [form, setForm] = useState({ title: "", content: "", type: "update", mediaUrl: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY) || "";
    setAdminToken(token);
  }, []);

  const isAdmin = useMemo(() => Boolean(adminToken) && !token, [adminToken, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    setLoading(true);
    setStatus("");
    try {
      await createUpdate(form, adminToken);
      setForm({ title: "", content: "", type: "update", mediaUrl: "" });
      setStatus(t("updatesPublished"));
    } catch (error) {
      setStatus(error.response?.data?.message || t("updatesPublishFailed"));
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    try {
      await removeUpdate(id, adminToken);
    } catch (error) {
      setStatus(error.response?.data?.message || t("updatesPublishFailed"));
    }
  };

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-3xl font-black text-brandYellow">{t("updatesTitle")}</h1>

      {isAdmin ? (
        <form onSubmit={handleSubmit} className="brand-card space-y-3 p-4">
          <h2 className="text-lg font-semibold">{t("updatesCreateTitle")}</h2>
          <input
            required
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder={t("updatesTitlePlaceholder")}
            className="w-full rounded-xl border border-white/20 bg-black/30 p-3"
          />
          <textarea
            value={form.content}
            onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
            placeholder={t("updatesDescriptionPlaceholder")}
            className="h-24 w-full rounded-xl border border-white/20 bg-black/30 p-3"
          />
          <div className="grid gap-3 md:grid-cols-2">
            <select
              value={form.type}
              onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
              className="w-full rounded-xl border border-white/20 bg-black/30 p-3"
            >
              {types.map((type) => (
                <option key={type} value={type} className="text-black">
                  {type}
                </option>
              ))}
            </select>
            <input
              value={form.mediaUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, mediaUrl: e.target.value }))}
              placeholder={t("updatesMediaPlaceholder")}
              className="w-full rounded-xl border border-white/20 bg-black/30 p-3"
            />
          </div>
          <button type="submit" disabled={loading} className="brand-btn-primary">
            {loading ? t("updatesPublishing") : t("updatesPublish")}
          </button>
          {status ? <p className="text-sm text-brandYellow">{status}</p> : null}
        </form>
      ) : (
        <p className="text-sm text-white/80">{t("updatesLatest")}</p>
      )}

      <div className="space-y-4">
        {updates.length === 0 ? <p>{t("updatesEmpty")}</p> : null}
        {updates.map((item) => (
          <article key={item._id} className="brand-card p-4">
            <div className="mb-1 flex items-center justify-between gap-3">
              <h3 className="text-xl font-bold text-brandYellow">{item.title}</h3>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase">{item.type}</span>
            </div>
            {item.content ? <p className="text-white/85">{item.content}</p> : null}
            <MediaPreview mediaUrl={item.mediaUrl} openLabel={t("updatesOpenMedia")} />
            <p className="mt-3 text-xs text-white/60">
              {t("updatesPostedBy")} {item.createdBy || "Sakhi Team"} - {new Date(item.createdAt).toLocaleString()}
            </p>
            {isAdmin ? (
              <button
                type="button"
                onClick={() => onDelete(item._id)}
                className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-sm"
              >
                {t("updatesDelete")}
              </button>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
