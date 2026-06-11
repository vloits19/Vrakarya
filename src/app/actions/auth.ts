"use server";

import { db } from "@/config/database";
import { createSession, destroySession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { analyze, logModeration } from "@/lib/moderation";

export async function login(state: unknown, formData: FormData) {
  const identifier = formData.get("identifier") as string;
  const password = formData.get("password") as string;

  if (!identifier || !password) {
    return { error: "Username/Email and password are required." };
  }

  // Find user by email or username
  const user = await db.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { username: identifier }
      ]
    }
  });

  if (!user || !user.passwordHash) {
    return { error: "Invalid credentials." };
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    return { error: "Invalid credentials." };
  }

  await createSession(user.id, user.username, user.role);

  redirect("/feed");
}

export async function register(state: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!email || !username || !password || !confirmPassword) {
    return { error: "All fields are required." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  if (!usernameRegex.test(username)) {
    return { error: "Username must be 3-30 characters and contain only letters, numbers, and underscores." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Invalid email format." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  // --- Content Moderation: check username ---
  const usernameMod = analyze(username);
  if (usernameMod.action === "block" || usernameMod.action === "censor") {
    logModeration({ userId: "registration", source: "register.username", input: username, matches: usernameMod.matches, highestSeverity: usernameMod.highestSeverity, result: "blocked" });
    return { error: "Username contains prohibited content. Please choose a different username." };
  }

  // Check if user already exists
  const existingUser = await db.user.findFirst({
    where: {
      OR: [
        { email },
        { username }
      ]
    }
  });

  if (existingUser) {
    return { error: "Email or username already in use." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      email,
      username,
      displayName: username,
      passwordHash,
      role: "Viewer",
    }
  });

  await createSession(user.id, user.username, user.role);

  redirect("/feed");
}

export async function logout() {
  await destroySession();
  redirect("/");
}
