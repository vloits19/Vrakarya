"use server";

import { db } from "@/config/database";
import { verifySession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { analyze, logModeration } from "@/lib/moderation";

export async function updateProfile(formData: FormData) {
  try {
    const session = await verifySession();
    if (!session.isAuth || !session.userId) {
      return { success: false, error: "Unauthorized" };
    }

    const displayName = formData.get("displayName") as string;
    const username = formData.get("username") as string;
    const bio = formData.get("bio") as string;
    const avatarUrl = formData.get("avatarUrl") as string;

    // Validate
    if (!displayName || !username) {
      return { success: false, error: "Display Name and Username are required." };
    }
    
    // Formatting username (no spaces)
    const formattedUsername = username.trim().replace(/\s+/g, "").toLowerCase();

    // --- Content Moderation ---
    const nameMod = analyze(displayName);
    if (nameMod.action === "block") {
      logModeration({ userId: session.userId, source: "updateProfile.displayName", input: displayName, matches: nameMod.matches, highestSeverity: nameMod.highestSeverity, result: "blocked" });
      return { success: false, error: "Display name contains prohibited content." };
    }
    const usernameMod = analyze(formattedUsername);
    if (usernameMod.action === "block" || usernameMod.action === "censor") {
      logModeration({ userId: session.userId, source: "updateProfile.username", input: formattedUsername, matches: usernameMod.matches, highestSeverity: usernameMod.highestSeverity, result: "blocked" });
      return { success: false, error: "Username contains prohibited content." };
    }
    if (bio) {
      const bioMod = analyze(bio);
      if (bioMod.action === "block") {
        logModeration({ userId: session.userId, source: "updateProfile.bio", input: bio, matches: bioMod.matches, highestSeverity: bioMod.highestSeverity, result: "blocked" });
        return { success: false, error: "Bio contains prohibited content." };
      }
    }
    const filteredName = nameMod.censored ?? displayName;
    const filteredBio = bio ? (analyze(bio).censored ?? bio) : bio;

    await db.user.update({
      where: { id: session.userId },
      data: {
        displayName: filteredName,
        username: formattedUsername,
        bio: filteredBio,
        avatarUrl,
      },
    });

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    revalidatePath(`/profile/${formattedUsername}`);

    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to update profile:", error);
    
    if (typeof error === "object" && error !== null && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "Username is already taken." };
    }
    
    return { success: false, error: "An unexpected error occurred while updating profile." };
  }
}
