"use server";

import { db } from "@/config/database";
import { verifySession } from "@/lib/auth";

export async function updateUserRole(userId: string, newRole: string) {
  const session = await verifySession();
  
  if (!session || session.role !== "Admin") {
    throw new Error("Unauthorized. Only administrators may manage users.");
  }

  // Prevent role downgrade for the default administrator
  const userToUpdate = await db.user.findUnique({ where: { id: userId } });
  
  if (!userToUpdate) {
    throw new Error("User not found.");
  }

  if (userToUpdate.username === "Vloits" && newRole !== "Admin") {
    throw new Error("Action denied. The default administrator role cannot be downgraded.");
  }

  await db.user.update({
    where: { id: userId },
    data: { role: newRole }
  });

  return { success: true };
}

export async function deleteUser(userId: string) {
  const session = await verifySession();
  
  if (!session || session.role !== "Admin") {
    throw new Error("Unauthorized. Only administrators may manage users.");
  }

  const userToDelete = await db.user.findUnique({ where: { id: userId } });
  
  if (!userToDelete) {
    throw new Error("User not found.");
  }

  if (userToDelete.username === "Vloits") {
    throw new Error("Action denied. The default administrator cannot be deleted.");
  }

  await db.user.delete({
    where: { id: userId }
  });

  return { success: true };
}
