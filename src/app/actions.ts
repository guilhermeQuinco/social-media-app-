"use server";
import { revalidatePath } from "next/cache";
import { media, posts } from "@/db/schema";
import { database } from "@/db/database";
import { auth } from "./auth";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { env } from "@/env";
import { eq } from "drizzle-orm";

function generateFileName(bytes = 32) {
  const key = crypto.randomBytes(bytes).toString("hex");
  return key;
}

const fileKey = generateFileName();

const s3 = new S3Client({
  region: "us-east-1",
  endpoint: `https://64992ea635e4dfa4c178c5efdf7ac353.r2.cloudflarestorage.com/${env.CLOUDFLARE_BUCKET_NAME}`,
  credentials: {
    accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
});

const acceptedTypes = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/webm",
];

const maxFileSize = 1024 * 1024 * 10; // 10MB

export async function getSignedURL(
  type: string,
  size: number,
  checksum: string
) {
  const session = await auth();

  if (!session) {
    throw new Error("not authorized");
  }

  if (!acceptedTypes.includes(type)) {
    return { failure: "Invalid file type" };
  }

  if (size > maxFileSize) {
    return { failure: "File is too large" };
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: "social-media-app",
    Key: fileKey,
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checksum,
  });

  const signedURL = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 60,
  });

  const mediaResult = await database
    .insert(media)
    .values({
      userId: session?.user?.id as string,
      type: type.startsWith("image") ? "image" : "video",
      fileKey: `${env.CLOUDFLARE_URL}/${env.CLOUDFLARE_BUCKET_NAME}/${fileKey}`,
    })
    .returning({ id: media.id })
    .then((res) => res[0]);

  return {
    url: signedURL,
    fileKey,
    mediaId: mediaResult.id,
  };
}

type CreatePostParams = {
  input: string;
  mediaId?: number;
};

export async function createPost({ input, mediaId }: CreatePostParams) {
  const session = await auth();

  if (!session) throw new Error("Unauthorized");

  if (mediaId) {
    await database
      .select()
      .from(media)
      .where(eq(media.id, mediaId))
      .then((res) => res[0]);

    if (!mediaId) {
      console.error("Media not found");
      return { failure: "Media not found" };
    }
  }

  const postItem = await database
    .insert(posts)
    .values({
      userId: session?.user?.id!,
      content: input,
    })
    .returning()
    .then((res) => res[0]);

  if (mediaId) {
    await database
      .update(media)
      .set({ postId: postItem.id })
      .where(eq(media.id, mediaId));
  }

  revalidatePath("/");
}
