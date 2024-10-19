"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Placeholder } from "@tiptap/extension-placeholder";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import image from "next/image";
import updateProfile from "./actions";
// import updateProfile from "../actions";

export function EditProfile({
  userProfile,
}: {
  userProfile: {
    id: string;
    name: string;
    username: string;
    email: string;
  };
}) {
  const editorBio = useEditor({
    extensions: [
      StarterKit.configure({ bold: false, italic: false }),
      Placeholder.configure({
        placeholder: "+ Bio",
      }),
    ],
  });

  const input =
    editorBio?.getText({
      blockSeparator: "\n",
    }) || "";

  const handleUser = async () => {
    await updateProfile(userProfile.id);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full rounded-xl py-3 mt-5" variant={"outline"}>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <form className="w-full mt-5" onSubmit={handleUser}>
          <div className="w-full flex items-center space-x-2">
            <div className="flex flex-col gap-3 w-full">
              <div className=" w-full flex flex-col gap-3 mb-5">
                <div className="flex flex-col">
                  <label className="font-bold">Name</label>
                  <Input
                    defaultValue={userProfile.name}
                    className="w-full border-b p-0"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-bold">Username</label>
                  <Input
                    defaultValue={userProfile.username}
                    className="w-full border-b p-0"
                  />
                </div>
                <div className="flex flex-col ">
                  <label className="font-bold">Bio</label>
                  <EditorContent
                    name="content"
                    editor={editorBio}
                    className="w-full max-w-[469px] max-h-[20rem] overflow-y-auto mt-2 border-b"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className=" w-full flex justify-end ">
            <DialogClose asChild>
              <Button className="w-[20%] rounded-xl" type="submit">
                Save
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
