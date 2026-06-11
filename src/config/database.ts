// ============================================================
// Database Configuration — Prisma
// ============================================================

import { PrismaClient } from "../generated/prisma";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const dbUrl = process.env["DATABASE_URL"] || "file:./dev.db";

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
