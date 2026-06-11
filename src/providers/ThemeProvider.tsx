"use client";

import { createContext, useContext } from "react";

// ============================================================
// ThemeProvider — wraps the app for theme & future auth context
// Currently provides dark theme by default.
// Extend with auth, locale, etc. as the app grows.
// ============================================================

interface ThemeContextValue {
  theme: "dark" | "light";
}

const ThemeContext = createContext<ThemeContextValue>({ theme: "dark" });

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={{ theme: "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}
