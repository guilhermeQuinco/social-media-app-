import { useParams } from "next/navigation";
import { database } from "@/db/database";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { EditProfile } from "./edit-profile";
import { auth } from "@/app/auth";

export default async function Profile({
  params: { id },
}: {
  params: { id: string };
}) {
  const session = await auth();

  const user = await database.query.users.findFirst({
    where: eq(users.id, id),
  });

  console.log(user);

  return (
    <div className="text-white w-screen h-screen flex justify-center items-center">
      <div className="w-full bg-slate-900 p-5 max-w-[700px]">
        <div className="w-full flex flex-row justify-between items-center ">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold">{user?.name}</h1>
            <span>{user?.username}</span>
          </div>

          <Image
            src={`${user?.image}`}
            alt="user-profile"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>

        {id === session?.user?.id ? (
          <EditProfile userProfile={user} />
        ) : (
          <h1>Follow</h1>
        )}
      </div>
    </div>
  );
}
