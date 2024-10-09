import { signOut } from "@/app/auth";
import { Button } from "./ui/button";

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
      className="absolute top-6 right-6"
    >
      <Button type="submit">Sign Out</Button>
    </form>
  );
}
