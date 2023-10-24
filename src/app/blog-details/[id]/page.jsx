import React from "react";

// import { db } from "@/lib/db";
import {db} from "../../../lib/db";
import { NetworkError } from "@/components/NetworkError";
import BackButton from "@/components/buttons/BackButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import BlogProps from "@/components/blog-details/BlogProps";

async function getPost(id) {
  // setInterval(async () => {
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
          media: true,
          Comment: true,
          user: {
            select: {
              id: true,
              Comment: true,
              username: true,
              profile: {
                select: {
                  profilePicture: true,
                  userRole: true,
                },
              },
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  // }, 1000);
}

async function getAllComment(postId) {
  // setInterval( async () => {
    try {
      const comments = await db.comment.findMany({
        where: { postId: postId },
        select: {
          id: true,
          text: true,
          user: {
            select: {
              id: true,
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
  // }, 1000);
}

const BlogDetails = async ({ params }) => {
  const post = await getPost(params.id);
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


// "use client";
// import React from "react";
// import { NetworkError } from "@/components/NetworkError";
// import BackButton from "@/components/buttons/BackButton";
// import BlogProps from "@/components/blog-details/BlogProps";
// import {useData} from '@/app/practice/useData';
// import { useSession } from "next-auth/react";

// const BlogDetails =  ({params}) => {
//   const { data: post, isLoading, isError } = useData(`/api/post/single-blog?id=${params.id}`);

//   const {data: session} = useSession();
//   const profile = post?.user?.profile;

//   if (isLoading) {
//     // You can render a loading indicator here if needed.
//     return <div>Loading...</div>;
//   }

//   if (isError) {
//     // Handle the error, e.g., display an error message.
//     return <NetworkError/>;
//   }
  

//   return (
//     <section className="">
//       <div className="container">
//         <BackButton />
//         {post && (
//           <BlogProps profile={profile} post={post} session={session}  />
//         )}
//       </div>
//     </section>
//   );
// };

// export default BlogDetails;
