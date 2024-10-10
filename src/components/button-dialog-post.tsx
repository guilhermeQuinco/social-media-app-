"use client";

import { Copy, Italic } from "lucide-react";

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

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

interface IUser {
  name: string;
  image: string;
}

export function ButtonPost({ name, image }: IUser) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ bold: false, italic: false }),
      Placeholder.configure({
        placeholder: "What's new?",
      }),
    ],
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  const onSubmit = async () => {
    await createPost(input);
    editor?.commands.clearContent();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bottom-5 right-5 fixed p-10 rounded-xl"
        >
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <form onSubmit={onSubmit}>
          <div className="flex items-center space-x-2">
            <div className=" flex flex-col">
              <div className="flex flex-row items-center gap-5 ">
                <Avatar>
                  <AvatarImage src={image} alt="@shadcn" />
                  <AvatarFallback className="bg-red-800 text-white">
                    {name.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm">{name}</span>
              </div>

              <EditorContent
                name="content"
                editor={editor}
                className="w-[25.7rem] max-h-[20rem] overflow-y-auto ml-[3.7rem] "
              />
            </div>
          </div>
          <div className=" w-full flex justify-end ">
            <DialogClose asChild>
              <Button className="w-[20%]" type="submit">
                Post
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
