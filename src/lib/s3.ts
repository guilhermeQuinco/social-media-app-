import { env } from "@/env";
import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
});

export const getSignedUrlForS3Object = async (key: string) => {
  return await getSignedUrl(
    s3Client,
    new GetObjectCommand({ Bucket: env.BUCKET_NAME, Key: key }),
    { expiresIn: 3600 }
  );
};

// console.log(await S3.send(new ListBucketsCommand({})));

// console.log(
//   await S3.send(new ListObjectsV2Command({ Bucket: "my-bucket-name" }))
// );
