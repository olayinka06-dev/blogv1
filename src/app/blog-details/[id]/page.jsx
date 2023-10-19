import React, { FC } from "react";
import ActionButtons from "@/components/buttons/ActionButtons";
// import { db } from "@/lib/db";
import { NetworkError } from "@/components/NetworkError";
import BackButton from "@/components/buttons/BackButton";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "../../../lib/db";

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
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}

const BlogDetails = async ({ params, blogData }) => {
  const post = await getPost(params.id);
  const session = await getServerSession(authOptions);
  const profile = post?.user?.profile;
  post;

  return (
    <section className="">
      <div className="container">
      <BackButton/>
        {post ? (
          <div className="-mx-4 flex flex-col gap-4 items-center justify-center">
            <ActionButtons id={post.id} />

            <div className="w-full px-4 lg:w-8/12">
              <div>
                <h2 className="mb-8 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl">
                  {post?.title}
                </h2>
                <div className="mb-10 flex flex-wrap items-center justify-between border-b border-body-color border-opacity-10 pb-4 dark:border-white dark:border-opacity-10">
                  <div className="flex flex-wrap items-center">
                    <div className="mr-10 mb-5 flex items-center">
                      <div className="mr-4">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full">
                          <Image
                            src={profile?.profilePicture || "/next.svg"}
                            alt="User"
                            fill
                          />
                        </div>
                      </div>
                      <div className="w-full">
                        <h4 className="mb-1 text-base font-medium text-body-color">
                          By
                          <span className="pl-2">{post?.user?.username}</span>
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="mb-5">
                    <Link
                      className="badge badge-accent text-white"
                      href={`/category/`}
                    >
                      {post?.tag?.name}
                    </Link>
                  </div>
                </div>
                <div>
                  <div className="mb-10 w-full overflow-hidden rounded">
                    <div className="relative aspect-[97/60] w-full sm:aspect-[97/44]">
                      <Image
                        src={post?.media || ""}
                        alt="Blog"
                        className="object-cover object-center"
                        fill
                      />
                    </div>
                  </div>
                  <p className="mb-8 leading-relaxed text-base font-medium text-body-color sm:text-lg lg:text-base xl:text-lg">
                    {post?.content}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-8/12 flex gap-4">
              {session !== null ? (
                <>
                  <input
                    name="comment"
                    id="comment"
                    autoFocus
                    autoComplete="off"
                    placeholder="Add comment here"
                    // value={comment}
                    // onChange={(event) =>
                    //   setComment(event.target.value)
                    // }
                    className="input input-bordered input-md w-full"
                  />
                  {/* <Button text="Add" onClick={handleCommentSave} /> */}
                  <button className="btn btn-accent px-8 text-white">
                    Add
                  </button>
                </>
              ) : null}
            </div>
            <section className="dark:bg-gray-900 py-8 lg:py-16 w-full lg:w-8/12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg lg:text-2xl font-bold text-black dark:text-white">
                  Discussion ({blogData?.comments.length})
                </h2>
              </div>
              {blogData && blogData.comments && blogData.comments.length > 0
                ? blogData.comments.map((comment) => (
                    <div className="p-6 text-base rounded-lg dark:bg-gray-900">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <p className="inline-flex items-center mr-3 text-sm text-black dark:text-white font-semibold">
                            {comment.split("|")[1] === blogData?.userid
                              ? `${
                                  comment.split("|")[1].split("_")[0]
                                } (Author)`
                              : comment.split("|")[1].split("_")[0]}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">
                        {comment.split("|")[0]}
                      </p>
                    </div>
                  ))
                : null}
            </section>
          </div>
        ) : (
          <NetworkError />
        )}
      </div>
    </section>
  );
};

export default BlogDetails;
