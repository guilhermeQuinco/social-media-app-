import Image from "next/image";
import { database } from "@/db/database";
import { posts } from "@/db/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SignIn from "@/components/sign-in";
import { auth } from "./auth";

export default async function Home() {
  const postsQuery = await database.query.posts.findMany();

  const session = await auth();

  if (!session?.user) return null;

  return (
    <main className="container mx-auto p-12">
      <SignIn />
      <form
        action={async (formData: FormData) => {
          "use server";
          await database.insert(posts);
        }}
        className="flex flex-row"
      >
        <Input />
        <Button type="submit">Save</Button>
      </form>
      <Image
        src={session.user.image}
        alt="user-image"
        width={100}
        height={100}
        className="rounded-full"
      />
      <h1>{session.user.name}</h1>
      <span>{session.user.email}</span>

      {postsQuery.map((item) => (
        <span>{item.id}</span>
      ))}
    </main>
  );
}
