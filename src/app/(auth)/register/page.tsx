"use client";

import { useActionState, useState } from "react";
import { register } from "@/app/actions/auth";
import { Card, Input, Button } from "@/components/ui";
import Link from "next/link";
import { Eye, EyeOff, Gamepad2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [state, action, isPending] = useActionState(register, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <Card hover={false} className="p-8 backdrop-blur-xl bg-background-secondary/80 border-glass-border">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-black tracking-tighter hover:text-accent-cyan transition-colors mb-4">
          <Gamepad2 className="w-8 h-8 text-accent-cyan" />
          VRAKARYA
        </Link>
        <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
        <p className="text-foreground-muted text-sm mt-2">
          Join the creator platform
        </p>
      </div>

      <form action={action} className="space-y-5">
        <Input
          label="Username"
          name="username"
          type="text"
          placeholder="Choose a username"
          required
        />
        
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="name@example.com"
          required
        />
        
        <div className="relative">
          <Input
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 8 characters"
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

        <div className="relative">
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Repeat password"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-[34px] text-foreground-dim hover:text-foreground transition-colors"
          >
            {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
          className="w-full flex items-center justify-center gap-2 group mt-2"
          disabled={isPending}
        >
          {isPending ? "Creating Account..." : "Sign Up"}
          {!isPending && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-foreground-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-accent-cyan font-semibold hover:text-accent-cyan/80 transition-colors">
          Sign in
        </Link>
      </div>
    </Card>
  );
}
