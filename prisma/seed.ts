import "dotenv/config";
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding default Admin account...");

  const libsql = createClient({
    url: "file:dev.db",
  });

  const passwordHash = await bcrypt.hash("Yvarats19.", 10);
  // SQLite uses unix timestamps or ISO strings for DATETIME. We'll use unix epoch timestamp but Prisma expects ISO strings or milliseconds. Actually Prisma uses ISO strings for sqlite or unix time? Let's check prisma's schema.

  // We will just do an INSERT OR REPLACE
  // UUID for ID
  const id = crypto.randomUUID();

  await libsql.execute({
    sql: `INSERT OR IGNORE INTO User (id, username, displayName, email, passwordHash, role, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
    args: [id, "Vloits", "Vloits Admin", "admin@vrakarya.dev", passwordHash, "Admin"]
  });

  console.log(`Admin account ensured: Vloits`);
}

main().catch(console.error);
