import { signIn } from "@/app/auth";
import { Button } from "./ui/button";

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
      className="absolute top-6 right-6"
    >
      <Button type="submit" className="px-6">
        Log in
      </Button>
    </form>
  );
}
