// components/hero-text.tsx
"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function HeroText() {
  const container = useRef(null);

  // Parallax effect config
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={container} className="relative z-10 py-20 md:py-32">
      <motion.div style={{ y, opacity }} className="relative">
        <motion.h1
          className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-8"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          My <br className="hidden md:block" />
          <span className="stroke-text hover:text-black transition-colors duration-500 cursor-default">
            Intern
          </span>
          <br />
          <span className="ml-12 md:ml-32">Journey</span> <br />
          <span className="font-serif italic font-light ml-4 md:ml-12 text-6xl md:text-8xl">
            Documented.
          </span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-gray-700 max-w-2xl font-light leading-relaxed ml-2 md:ml-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Follow my journey as a Business Applications IT Intern, transforming
          data with Power BI and connecting systems through Cloud Platform
          Integration.
        </motion.p>
      </motion.div>
    </div>
  );
}
