import React from "react";

import { db } from "@/lib/db";
import { NetworkError } from "@/components/NetworkError";
import BackButton from "@/components/buttons/BackButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import BlogProps from "@/components/blog-details/BlogProps";
import { useFetchJson } from "@/lib/fetchJson";

// async function getPost(id) {

//   const { data, error, isLoading } = useFetchJson(
//     `/api/post/single-blog?id=${id}`
//   );

//   return {data, error, isLoading};
//   // try {
//   //   const response = await db.post.findFirst({
//   //     where: {
//   //       id: id,
//   //     },
//   //     select: {
//   //       id: true,
//   //       title: true,
//   //       content: true,
//   //       tag: true,
//   //       media: true,
//   //       Comment: true,
//   //       user: {
//   //         select: {
//   //           id: true,
//   //           Comment: true,
//   //           username: true,
//   //           profile: {
//   //             select: {
//   //               profilePicture: true,
//   //               userRole: true,
//   //             },
//   //           },
//   //         },
//   //       },
//   //       createdAt: true,
//   //       updatedAt: true,
//   //     },
//   //   });
//   //   return response;
//   // } catch (error) {
//   //   console.log(error);
//   // }
// }

async function getAllComment(postId) {
  try {
    const comments = await db.comment.findMany({
      where: { postId: postId },
      select: {
        id: true,
        text: true,
        user: {
          select: {
            username: true,
            profile: {
              select: {
                profilePicture: true,
              },
            },
          },
        },
        createdAt: true,
      },
    });

    return comments;
  } catch (error) {
    console.log(error);
  }
}

const BlogDetails = async ({ params }) => {

  const { data: post, error, isLoading } = useFetchJson(
    `/api/post/single-blog?id=${params.id}`
  );

  if (isLoading) {
    // You can render a loading indicator here if needed.
    return <div>Loading...</div>;
  }

  if (error) {
    // Handle the error, e.g., display an error message.
    return <div>Error: {error.message}</div>;
  }
  // const post = await getPost(params.id);
  // console.log(post.data);
  // console.log("params.id",params.id);
  const comments = await getAllComment(post?.id);
  const session = await getServerSession(authOptions);
  const profile = post?.user?.profile;

  return (
    <section className="">
      <div className="container">
        <BackButton />
        {post ? (
          <BlogProps profile={profile} post={post} session={session} comments={comments} />
        ) : (
          <NetworkError />
        )}
      </div>
    </section>
  );
};

export default BlogDetails;
