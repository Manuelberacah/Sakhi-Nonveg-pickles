"use client";

import { whatsappUrl } from "../../../lib/whatsapp";

export default function SupportPage() {
  return (
    <section className="mx-auto max-w-2xl brand-card space-y-4 p-6">
      <h1 className="text-2xl font-bold text-brandYellow">Customer Support</h1>
      <p>Phone: 8015300905</p>
      <p>Email: sakhipickles.nonveg@gmail.com</p>
      <a
        href={whatsappUrl("Hello, I need customer support for my Sakhi Non-Veg Pickles order.")}
        target="_blank"
        rel="noreferrer"
        className="brand-btn bg-green-500 text-white hover:bg-green-600"
      >
        Chat on WhatsApp
      </a>
    </section>
  );
}
