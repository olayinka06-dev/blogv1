import React from "react";
import BlogCards from "../../components/BlogCards";
import { db } from "../../lib/db";
import { NetworkError } from "@/components/NetworkError";

async function getPosts() {
  try {
    const response = await db.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        tag: true,
        media: true,
        user: {
          select: {
            username: true,
            profile: {
              select: {
                profilePicture: true,
                userRole: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}


const BlogPage = async () => {
  const posts = await getPosts();

  return (
    <section>
      {posts ? (
        <div className="grid grid-cols-3 items-center justify-center">
          {posts.length === 0 ? (
            <p>No Data returned</p>
          ) : (
            posts.map((post) => <BlogCards key={post} post={post} />)
          )}
        </div>
      ) : (
        <NetworkError />
      )}
    </section>
  );
};

export default BlogPage;
