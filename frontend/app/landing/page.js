"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

const sections = [
  {
    image: "/products/chicken.png.jpg",
    title: "Traditional Fire, Modern Hygiene",
    description:
      "Every Sakhi jar is prepared in controlled, clean batches while preserving the bold, old-school Andhra pickle character meat lovers crave."
  },
  {
    image: "/products/mutton.png.jpg",
    title: "Premium Cuts, Rich Masala Depth",
    description:
      "From careful meat selection to slow spice layering, our process builds flavor in stages so each spoonful tastes deep, balanced, and memorable."
  },
  {
    image: "/products/prawn.png.png",
    title: "Coastal Heat With a Bright Finish",
    description:
      "Our prawn profile blends sea-fresh savoriness with vibrant spice and tang, giving your rice and rotis a punchy, satisfying finish."
  },
  {
    image: "/products/fish.png.jpg",
    title: "Homemade Soul in Every Jar",
    description:
      "No shortcuts, no artificial taste boosters. Just careful home-style cooking, premium spices, and the confidence of preservative-free flavor."
  },
  {
    image: "/products/gongura-chicken.png.jpg",
    title: "Signature Boldness for Meat Lovers",
    description:
      "From chicken to mutton, fish to prawns, every variant is crafted to feel distinct yet unmistakably Sakhi: bold, authentic, and addictive."
  }
];

export default function LandingPage() {
  const [logoSrc, setLogoSrc] = useState("/brand/logo.png");
  const [heroSrc, setHeroSrc] = useState("/brand/logo-full.png.jpg");

  return (
    <main className="pb-16">
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
            <p className="text-sm font-bold text-brandYellow md:text-base">Sakhi Non-Veg Pickles</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold">
              Login
            </Link>
            <Link href="/signup" className="brand-btn-primary text-sm">
              Sign Up
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
              Homemade Non-Veg Pickles
            </p>
            <h1 className="text-3xl font-black leading-tight text-brandYellow md:text-5xl">
              A Bite of Bold, A Jar of Gold
            </h1>
            <p className="max-w-2xl text-base text-white/85 md:text-lg">
              The perfect pickle for every meat lover. Preservative-free, premium meats and spices,
              and crafted freshness delivered with consistency.
            </p>
            <div className="grid gap-2 text-sm text-white/90">
              <p>
                <span className="font-semibold text-brandYellow">Phone:</span> 8143156089, 80153 0090
              </p>
              <p>
                <span className="font-semibold text-brandYellow">Email:</span>{" "}
                sakhinonvegsakhipickles.nonveg@gmail.com
              </p>
              <p>
                <span className="font-semibold text-brandYellow">Address:</span> Anand Gokulam,
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
                Instagram
              </a>
              <a
                href="https://share.google/6HNSsh5Xaf5BHq8sQ"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Google
              </a>
              <a
                href="https://maps.app.goo.gl/Jim7dmA1hwJJVc887?g_st=aw"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Open Map
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
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brandRed">Sakhi Story</p>
                <h2 className="text-2xl font-black text-brandYellow md:text-3xl">{item.title}</h2>
                <p className="text-white/85">{item.description}</p>
              </div>
            </motion.article>
          );
        })}
      </section>
    </main>
  );
}
