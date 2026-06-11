"use client";

import { motion } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function ScrollReveal({ children, delay = 0, className = "", direction = "up" }: ScrollRevealProps) {
  const getInitialY = () => {
    if (direction === "up") return 40;
    if (direction === "down") return -40;
    return 0;
  };

  const getInitialX = () => {
    if (direction === "left") return 40;
    if (direction === "right") return -40;
    return 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: getInitialY(), x: getInitialX() }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: delay,
        duration: 0.6 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
