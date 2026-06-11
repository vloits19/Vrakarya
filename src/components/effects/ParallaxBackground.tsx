"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function ParallaxBackground() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out mouse movement
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const spotlightX = useTransform(springX, (latest) => latest * 100);
  const spotlightY = useTransform(springY, (latest) => latest * 100);

  const particle1X = useTransform(springX, (latest) => latest * -50);
  const particle1Y = useTransform(springY, (latest) => latest * -50);

  const particle2X = useTransform(springX, (latest) => latest * 30);
  const particle2Y = useTransform(springY, (latest) => latest * 30);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates to center of screen (-1 to 1)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#0A0A0B]">
      {/* Base Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      {/* Dynamic Mouse Spotlight */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -mt-[400px] -ml-[400px] rounded-full opacity-20 blur-[100px]"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(236,72,153,0) 70%)",
          x: spotlightX,
          y: spotlightY,
        }}
      />

      {/* Floating Particles/Elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[120px]"
        style={{
          x: particle1X,
          y: particle1Y,
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"
        style={{
          x: particle2X,
          y: particle2Y,
        }}
      />
    </div>
  );
}
