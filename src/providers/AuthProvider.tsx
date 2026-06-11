"use client";

import { createContext, useContext, ReactNode } from "react";
import { logout } from "@/app/actions/auth";

type AuthState = {
  isAuth: boolean;
  userId: string | null;
  role: string | null;
  logoutAction: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState: Omit<AuthState, "logoutAction">;
}) {
  const logoutAction = async () => {
    await logout();
  };

  return (
    <AuthContext.Provider value={{ ...initialState, logoutAction }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
