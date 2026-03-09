"use client";

import { useApp } from "../../../components/AppContext";

export default function ProfilePage() {
  const { user } = useApp();

  return (
    <section className="mx-auto max-w-xl brand-card p-6">
      <h1 className="text-2xl font-bold text-brandYellow">Profile</h1>
      <div className="mt-4 space-y-2 text-sm">
        <p><span className="text-white/70">Name:</span> {user?.name}</p>
        <p><span className="text-white/70">Email:</span> {user?.email}</p>
      </div>
    </section>
  );
}
