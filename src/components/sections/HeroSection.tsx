"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { getPlatformStats } from "@/app/actions/projects";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [stats, setStats] = useState({ userCount: 0, projectCount: 0, postCount: 0 });

  useEffect(() => {
    getPlatformStats().then(setStats);
  }, []);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 200, damping: 20 }
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background/80 md:bg-background/60 bg-gradient-to-t from-background via-background/80 to-background/30 z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          {/* Placeholder abstract tech/game dev video */}
          <source src="https://cdn.pixabay.com/video/2021/08/04/83866-584742517_large.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Background Effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-cyan/20 rounded-full blur-[128px] animate-pulse-glow z-0" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse-glow animation-delay-200 z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[200px] z-0" />

      {/* Content */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-5xl mx-auto px-4 text-center"
      >
        {/* Badge */}
        <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-8">
          <Sparkles className="w-4 h-4" />
          <span className="font-medium">The platform for game creators</span>
        </motion.div>

        {/* Title */}
        <motion.h1 variants={item} className="text-5xl sm:text-7xl md:text-[5.5rem] font-black tracking-tighter mb-6 drop-shadow-2xl font-heading leading-[1.1]">
          Where Game Devs
          <br />
          <span className="bg-gradient-to-r from-accent-cyan via-accent-cyan to-primary text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(113,142,182,0.3)]">Showcase & Connect</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p variants={item} className="text-lg sm:text-xl md:text-2xl text-foreground-muted max-w-3xl mx-auto mb-10 leading-relaxed">
          Share your projects, track your progress, and connect with a
          vibrant community of indie game developers and studios.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/feed">
            <Button size="lg" className="min-w-[180px] h-14 text-base">
              Explore Projects
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg" className="min-w-[180px] h-14 text-base backdrop-blur-md">
              Join as Developer
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div variants={item} className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { value: stats.userCount.toString(), label: "Developers" },
            { value: stats.projectCount.toString(), label: "Projects" },
            { value: stats.postCount.toString(), label: "Posts" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-foreground font-heading tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-foreground-dim mt-2 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
