"use client";
import React, { useEffect, useState } from "react";
import ActionButtons from "../../components/buttons/ActionButtons";
import Link from "next/link";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/__hs";
import { fetchJson } from "../../lib/fetchJson";
import { Success, Error } from "@/lib/entities";

const BlogProps = ({ post, profile, session, comments }) => {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const postId = post?.id;

  console.log("comments", comments);

  const imageExtensions = ["jpeg", "jpg", "png", "gif", "webp", "svg"];

  // Function to determine if the media URL is an image
  const isImage = (url) => {
    const lowerCaseUrl = url.toLowerCase();
    return imageExtensions.some((ext) => lowerCaseUrl.includes(`.${ext}`));
  };

  const handleCommentSave = async () => {
    try {
      const BASE_URL = `/api/post/single-blog-details`;
      const resp = await fetchJson(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment, postId }),
      });
      const result = await resp.json();
      const { message } = result;
      if (resp.ok) {
        Success(message);
        router.refresh();
      } else {
        Error(message);
      }
    } catch (error) {
      console.log(error);
      Error(message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const BASE_URL = `/api/post/single-blog-details?id=${commentId}`;
      const resp = await fetch(BASE_URL, {
        method: "DELETE",
      });

      const result = await resp.json();
      const { message } = result;

      if (resp.ok) {
        Success(message);
        router.refresh();
      } else {
        Error(message);
      }
    } catch (error) {
      console.log(error);
      Error(message);
    }
  };

  useEffect(() => {
    let interval = setInterval(() => {
      router.refresh();
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [comments]);

  return (
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
            <div className="relative aspect-[97/60] w-full sm:aspect-[97/44]">
              {isImage(post?.media) ? (
                <Image
                  className="object-cover object-center"
                  src={post?.media}
                  alt={post?.media}
                  fill
                />
              ) : (
                <video
                  className="object-cover object-center"
                  src={post?.media}
                  alt={post?.media}
                  controls
                />
              )}
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
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              className="input input-bordered input-md w-full"
            />
            <button
              onClick={handleCommentSave}
              className="btn btn-accent px-8 text-white"
            >
              Add
            </button>
          </>
        ) : null}
      </div>
      <section className="bg-[#f2f2f2] py-8 px-5 lg:py-16 w-full lg:w-8/12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg lg:text-2xl font-bold text-black dark:text-white">
            Discussion ({comments?.length})
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {comments && comments.length > 0
            ? comments.map((comment, index) => (
                <div
                  key={index}
                  className="p-6 text-base flex flex-col gap-1 rounded-lg bg-white"
                >
                  <div className="flex flex-row items-center gap-2 mb-2">
                    <img
                      src={
                        comment?.user?.profile?.profilePicture || "/next.svg"
                      }
                      alt={comment?.user?.profile?.profilePicture}
                      className="w-9 h-9 rounded-full"
                    />
                    <p>{comment?.user?.username}</p>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    {comment?.text}
                  </p>
                  <p>{formatDate(comment?.createdAt)}</p>
                  <div className="flex justify-end">
                    <button
                      className="btn"
                      onClick={() => handleDeleteComment(comment?.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            : null}
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default BlogProps;
