import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import createPost from "@/app/actions";

interface IUser {
  id: string;
  name: string;
  email: string;
}

export function ButtonPost({ user }: { user: IUser }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bottom-5 right-5 fixed p-10">
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-">
        <form action={createPost}>
          <div className="flex items-center space-x-2">
            <div className=" flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <span className="font-medium text-sm">{user.name}</span>
                <Input
                  id="post"
                  className="shadow-none border-none py-3 h-0 px-0"
                  placeholder="O que há de novo?"
                />
              </div>
            </div>
          </div>
          <div className=" w-full flex justify-end">
            <Button className="w-[20%]" type="submit">
              Post
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
