"use server";
import { revalidatePath } from "next/cache";
import { posts } from "@/db/schema";
import { database } from "@/db/database";
import { auth } from "./auth";

export default async function createPost(input: string) {
  const session = await auth();

  if (!session) throw new Error("Unauthorized");

  await database.insert(posts).values({
    content: input,
    userId: session?.user?.id!,
  });
  revalidatePath("/");
}
