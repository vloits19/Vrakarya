"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { Card, Input, Button } from "@/components/ui";
import Link from "next/link";
import { Eye, EyeOff, Gamepad2, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card hover={false} className="p-8 backdrop-blur-xl bg-background-secondary/80 border-glass-border">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-black tracking-tighter hover:text-accent-cyan transition-colors mb-4">
          <Gamepad2 className="w-8 h-8 text-accent-cyan" />
          VRAKARYA
        </Link>
        <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
        <p className="text-foreground-muted text-sm mt-2">
          Sign in to your creator account
        </p>
      </div>

      <form action={action} className="space-y-6">
        <Input
          label="Username or Email"
          name="identifier"
          type="text"
          placeholder="Enter your username or email"
          required
        />
        
        <div className="relative">
          <Input
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[34px] text-foreground-dim hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {state?.error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium">
            {state.error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full flex items-center justify-center gap-2 group"
          disabled={isPending}
        >
          {isPending ? "Signing In..." : "Sign In"}
          {!isPending && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-foreground-muted">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-accent-cyan font-semibold hover:text-accent-cyan/80 transition-colors">
          Create one now
        </Link>
      </div>
    </Card>
  );
}
