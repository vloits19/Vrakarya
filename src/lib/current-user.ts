import { db } from "@/config/database";
import { verifySession } from "./auth";

export async function getCurrentUser() {
  const session = await verifySession();
  if (!session.isAuth || !session.userId) return null;

  try {
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { id: true, username: true, displayName: true, email: true, avatarUrl: true, role: true }
    });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}
