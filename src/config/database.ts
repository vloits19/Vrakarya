// ============================================================
// Database Configuration — Prisma
// ============================================================

import { PrismaClient } from "../generated/prisma";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const dbUrl = process.env["DATABASE_URL"] || "file:./dev.db";

if (process.env.NODE_ENV === "production") {
  if (!process.env["DATABASE_URL"] || process.env["DATABASE_URL"].startsWith("file:")) {
    throw new Error(`KOCAK: Kamu lupa memasukkan DATABASE_URL Turso ke Vercel (atau kamu malah memasukkan file:./dev.db). Tolong ke Vercel Dashboard -> Settings -> Environment Variables, lalu isi DATABASE_URL dengan link libsql:// Turso-mu, dan JANGAN LUPA KLIK REDEPLOY!`);
  }
  if (!process.env.TURSO_AUTH_TOKEN) {
    throw new Error(`KOCAK: Kamu lupa memasukkan TURSO_AUTH_TOKEN ke Vercel!`);
  }
}

const libsql = createClient({
  url: dbUrl,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const adapter = new PrismaLibSQL(libsql);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new PrismaClient({ adapter, log: ["error"] } as any);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
