import { NextResponse } from "next/server";
import { db } from "@/config/database";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const passwordHash = await bcrypt.hash("Yvarats19.", 10);
    const admin = await db.user.upsert({
      where: { email: "admin@vrakarya.dev" },
      update: {
        passwordHash,
        role: "Admin",
      },
      create: {
        username: "Vloits",
        displayName: "Vloits Admin",
        email: "admin@vrakarya.dev",
        passwordHash,
        role: "Admin",
      },
    });

    return NextResponse.json({ success: true, message: `Admin account ensured: ${admin.username}` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
