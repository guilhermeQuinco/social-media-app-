"use server";

import { users } from "@/db/schema";
import { auth } from "../../auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { database } from "@/db/database";

export default async function updateProfile(id: string) {
  const session = await auth();

  if (!session) throw new Error("Unauthorized");

  await database
    .update(users)
    .set({ username: "testando" })
    .where(eq(users.id, id));

  revalidatePath(`/`);
}
