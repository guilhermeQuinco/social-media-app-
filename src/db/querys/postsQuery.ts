import { database, desc, eq } from "../database";

import { posts as postsTable } from "@/db/schema";
import { users as usersTable } from "@/db/schema";
import { media as mediaTable } from "@/db/schema";

const baseQuery = database
  .select({
    id: postsTable.id,
    content: postsTable.content,

    user: {
      id: usersTable.id,
      name: usersTable.name,
      image: usersTable.image,
      email: usersTable.email,
    },
    media: {
      id: mediaTable.id,
      type: mediaTable.type,
      fileKey: mediaTable.fileKey,
    },
  })
  .from(postsTable)
  .innerJoin(usersTable, eq(usersTable.id, postsTable.userId))
  .leftJoin(mediaTable, eq(mediaTable.postId, postsTable.id));

export const postsFeedQuery = baseQuery
  .orderBy(desc(postsTable.id))
  .prepare("posts_for_feed");
