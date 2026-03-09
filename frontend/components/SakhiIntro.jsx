"use client";

import { motion } from "framer-motion";
import { Noto_Sans_Telugu } from "next/font/google";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const teluguFont = Noto_Sans_Telugu({
  subsets: ["telugu"],
  weight: ["700"]
});

export default function SakhiIntro() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/landing");
    }, 4500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-black px-4">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-brandRed/20 blur-3xl" />
        <div className="absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-brandYellow/20 blur-3xl" />
      </div>

      <motion.div
        className={`${teluguFont.className} flex items-end gap-1 text-7xl font-bold text-brandYellow md:text-8xl`}
        initial={{ opacity: 0.9 }}
        animate={{ opacity: 1 }}
      >
        {["స", "ఖి"].map((glyph, index) => (
          <motion.span
            key={glyph}
            initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
            animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
            transition={{ duration: 1.2, delay: index * 1.1, ease: "easeInOut" }}
            className="inline-block"
          >
            {glyph}
          </motion.span>
        ))}
      </motion.div>

      <motion.h1
        className="mt-10 text-center text-3xl font-black text-brandYellow md:text-4xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.9, duration: 0.8 }}
      >
        Sakhi Non-Veg Pickles
      </motion.h1>
    </div>
  );
}

