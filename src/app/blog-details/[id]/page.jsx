import React, { FC } from "react";
import ActionButtons from "@/components/buttons/ActionButtons";
import { db } from "@/lib/db";
import { NetworkError } from "@/components/NetworkError";
import BackButton from "@/components/buttons/BackButton";

async function getPost(id) {
  try {
    const response = await db.post.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        tag: true,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}

const BlogDetails = async ({ params }) => {
  const post = await getPost(params.id);
  console.log(params.id);
  console.log(post);

  return (
    <section className="container">
      <div className="flex flex-row items-center gap-3">
        <BackButton/>
        <h2>Blog Details</h2>
      </div>
      {post ? (
        <div className="flex flex-col gap-2 px-10">
          <h2>{post?.title}</h2>
          <ActionButtons id={post.id} />
          <div className="">
            <p>{post?.tag.name}</p>
            <p>{post.content}</p>
          </div>
        </div>
      ) : (
        <NetworkError />
      )}
    </section>
  );
};

export default BlogDetails;
