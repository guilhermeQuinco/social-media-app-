import Image from "next/image";
import { database } from "@/db/database";
import { posts } from "@/db/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SignIn from "@/components/sign-in";
import { auth } from "./auth";
import { SignOut } from "@/components/sign-out";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export default async function Home() {
  const session = await auth();

  const postsQuery = await database.query.posts.findMany({
    with: {
      user: {
        name: true,
      },
    },
  });

  console.log(postsQuery);

  return (
    <main className="container mx-auto p-12">
      {session?.user ? <SignOut /> : <SignIn />}

      <form
        action={async (formData: FormData) => {
          "use server";
          await database.insert(posts).values({
            content: formData.get("content") as string,
            userId: session?.user?.id!,
          });
          revalidatePath("/");
        }}
        className="flex flex-row"
      >
        <Input name="content" placeholder="No que você está pensando??" />
        <Button type="submit">Save</Button>
      </form>

      <div className="flex flex-col gap-3">
        {postsQuery.map((item) => (
          <div className="flex f">
            <span>{item.userId}</span>
            <span>{item.content}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
