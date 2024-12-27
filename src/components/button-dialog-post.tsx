"use client";

import { Copy, Italic, Paperclip } from "lucide-react";

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

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import React, { useState } from "react";
import Image from "next/image";
import { createPost, getSignedURL } from "@/app/actions";

interface IUser {
  name: string;
  image: string;
}

export function ButtonPost({ name, image }: IUser) {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);

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

  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBUffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBUffer));
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    return hashHex;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({ input, file });
    try {
      if (file) {
        const checksum = await computeSHA256(file);

        const {
          url: signedURL,
          fileKey,
          mediaId,
        } = await getSignedURL(file.type, file.size, checksum);

        if (!signedURL) {
          console.error("error");
        }

        const uploadURL = signedURL || "";

        await fetch(uploadURL, {
          method: "PUT",
          body: file,
          headers: {
            "Content-type": file.type,
          },
        });

        console.log({ uploadURL, fileKey, mediaId });

        await createPost({ input, mediaId });

        editor?.commands.clearContent();

        setFile(undefined);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFile(file);

    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }

    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
    } else {
      setFileUrl(undefined);
    }
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
          <div className="flex items-center space-x-2 ">
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

              <div className="flex flex-col space-y-3 ml-[3.7rem]">
                <EditorContent
                  name="content"
                  editor={editor}
                  className="w-[25.7rem] max-h-[20rem] overflow-y-auto  "
                />

                {fileUrl && file && (
                  <div className="flex flex-col space-y-2">
                    <div className="rounded-2xl w-32 h-32 relative overflow-hidden">
                      <Image
                        src={fileUrl}
                        alt={file.name}
                        fill
                        priority
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                <label className="flex">
                  <input
                    type="file"
                    className="hidden "
                    onChange={handleChange}
                  />
                  <Paperclip className="cursor-pointer" />
                </label>
              </div>
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
