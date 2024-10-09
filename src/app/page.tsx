import Image from "next/image";
import { database } from "@/db/database";
import { posts } from "@/db/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SignIn from "@/components/sign-in";
import { auth } from "./auth";
import { SignOut } from "@/components/sign-out";

import { ButtonPost } from "@/components/button-dialog-post";
import createPost from "./actions";

export default async function Home() {
  const session = await auth();

  const postsQuery = await database.query.posts.findMany({});

  return (
    <main className="w-full overflow-hidden">
      <div className="w-full h-screen justify-center flex items-center flex-col">
        {session?.user ? <SignOut /> : <SignIn />}
        <section className="w-full max-w-[900px] p-5">
          <form action={createPost} className="flex flex-row w-full">
            <Input
              name="content"
              placeholder="No que você está pensando??"
              className="border-none shadow-none outline-none p-0"
            />
            <Button type="submit">Save</Button>
          </form>

          <div className="flex flex-col gap-3">
            {postsQuery.map((item) => (
              <div className="flex flex-col">
                <span>{item.userId}</span>
                <span>{item.content}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {session ? <ButtonPost user={session?.user} /> : ""}
    </main>
  );
}
