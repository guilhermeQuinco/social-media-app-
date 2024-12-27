import Image from "next/image";
import { database } from "@/db/database";
import { posts, users } from "@/db/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SignIn from "@/components/sign-in";
import { auth } from "./auth";
import { SignOut } from "@/components/sign-out";

import { ButtonPost } from "@/components/button-dialog-post";
//import createPost from "./actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { asc, desc } from "drizzle-orm";
import Link from "next/link";
import { postsFeedQuery } from "@/db/querys/postsQuery";

export default async function Home() {
  const session = await auth();

  const posts = await postsFeedQuery.execute();

  return (
    <main className="w-full overflow-hidden h-screen ">
      <div className="w-full justify-center flex items-center flex-col">
        {session?.user ? <SignOut /> : <SignIn />}
        <section className="w-full max-w-[900px] p-5 absolute top-32">
          <div className="flex flex-col gap-5 mt-1 ">
            {posts.map((item) => (
              <div
                className="flex flex-col gap-3 bg-gray-900 p-5 rounded-xl"
                key={item.id}
              >
                <div className="flex flex-row items-center gap-2">
                  <Avatar>
                    <AvatarImage src={item.user.image!} alt="@shadcn" />
                    <AvatarFallback>
                      {item.user.name!.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className=" text-sm text-gray-200">
                    {item.user.email}
                  </span>
                </div>{" "}
                <span className="text-white ml-[50px] whitespace-pre-line break-words">
                  {item.content}
                </span>
                <Link href={`/post/${item.id}`}>
                  <div className=" ml-[50px] rounded-2xl w-fill h-full relative overflow-hidden">
                    <Image
                      className="rounded-2xl "
                      src={item.media?.fileKey as string}
                      alt={item.content}
                      objectFit="cover"
                      width={500}
                      height={500}
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>

      {session ? (
        <ButtonPost name={session.user?.name!} image={session.user?.image!} />
      ) : (
        ""
      )}
    </main>
  );
}
