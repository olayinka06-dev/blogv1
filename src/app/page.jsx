import React from "react";
import BlogCards from "../components/BlogCards";
import { db } from "../lib/db";
import { NetworkError } from "@/components/NetworkError";

async function getPosts() {
  try {
    const response = await db.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        tag: true,
        Media: true
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

const Home = async () => {
  const posts = await getPosts();
  console.log(posts);

  return (
    <section>
      {posts ? (
        <div className="grid grid-cols-3 items-center justify-center">
          {posts.map((post) => (
            <BlogCards key={post} post={post} />
          ))}
        </div>
      ) : (
        <NetworkError/>
      )}
    </section>
  );
};

export default Home;
