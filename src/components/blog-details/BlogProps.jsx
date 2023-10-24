"use client";
import React, { useEffect, useState } from "react";
import ActionButtons from "../../components/buttons/ActionButtons";
import Link from "next/link";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/__hs";
import { Success, Error } from "@/lib/entities";
import { useData } from "@/app/practice/useData";

const BlogProps = ({ post, profile, session, comm }) => {
  const router = useRouter();
  const [comments, setComments] = useState(comm);
  const [comment, setComment] = useState("");
  const [editingComment, setEditingComment] = useState({
    commentId: null,
    text: "",
  });

  const postId = post?.id;

  // const {
  //   data: comments,
  //   isLoading,
  //   isError,
  // } = useData(`/api/post/comments?id=${postId}`);

  // const comments = data?.reverse();

  const imageExtensions = ["jpeg", "jpg", "png", "gif", "webp", "svg"];

  // Function to determine if the media URL is an image
  const isImage = (url) => {
    const lowerCaseUrl = url?.toLowerCase();
    return imageExtensions.some((ext) => lowerCaseUrl?.includes(`.${ext}`));
  };

  // const handleCommentSave = async () => {
  //   try {
  //     const BASE_URL = `/api/post/comments`;
  //     const resp = await fetch(BASE_URL, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ comment, postId }),
  //     });
  //     const result = await resp.json();
  //     console.log(result);
  //     const { message } = result;
  //     if (resp.ok) {
  //       Success(message);
  //       router.refresh();
  //     } else {
  //       Error(message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     Error(error);
  //   }
  // };

  const handleCommentSave = async () => {
    try {
      const BASE_URL = `/api/post/comments`;
      const resp = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment, postId }),
      });
      const result = await resp.json();
      const { message, uploadedComment } = result;
      const { user } = uploadedComment;
      if (resp.ok) {
        Success(message);
        router.refresh();

        // Update the local state with the new comment
        const newComment = {
          id: uploadedComment?.id, // Make sure your server returns the comment's ID
          text: uploadedComment?.text,
          user: {
            id: user?.id,
            username: user?.username,
            profile: {
              profilePicture: user?.profile?.profilePicture,
            },
          },
          createdAt: uploadedComment?.createdAt, // Use the server's timestamp
        };

        setComments([newComment, ...comments]); // Add the new comment to the local state
        setComment(""); // Clear the comment input

        // You might want to refresh the comments to show the updated one
      } else {
        Error(message);
      }
    } catch (error) {
      console.log(error);
      Error(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const BASE_URL = `/api/post/comments?id=${commentId}`;
      const resp = await fetch(BASE_URL, {
        method: "DELETE",
      });

      const result = await resp.json();
      const { message } = result;

      if (resp.ok) {
        Success(message);
        router.refresh();
        // Remove the deleted comment from the local state
        const updatedComments = comments.filter((c) => c.id !== commentId);
        setComments(updatedComments);
      } else {
        Error(message);
      }
    } catch (error) {
      console.log(error);
      Error(error);
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment({
      commentId: comment.id,
      text: comment.text,
    });
  };

  const handleEditSaveComment = async (comment) => {
    try {
      const BASE_URL = `/api/post/comments`;
      const resp = await fetch(BASE_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId: comment.id,
          text: editingComment.text,
        }),
      });
      const result = await resp.json();
      const { message } = result;

      if (resp.ok) {
        Success(message);
        router.refresh();
        // Reset the editing state
        setEditingComment({ commentId: null, text: "" });
        // Refresh comments to show the updated one
        const updatedComments = [...comments];
        const editedCommentIndex = updatedComments.findIndex(
          (c) => c.id === comment.id
        );
        if (editedCommentIndex !== -1) {
          updatedComments[editedCommentIndex].text = editingComment.text;
          setComments(updatedComments);
        }
      } else {
        Error(message);
      }
    } catch (error) {
      console.error(error);
      Error(error);
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
    <div className="container md:w-[70%] mx-auto p-4">
      <div className="mb-8 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl">
        {post?.title}
      </div>

      <div className="flex flex-wrap items-center justify-between border-b border-body-color border-opacity-10 pb-4 dark:border-white dark:border-opacity-10">
        <div className="flex flex-col mb-5">
          <div className="mb-5">
            <Link className="badge badge-accent text-white" href={`/category/`}>
              {post?.tag?.name}
            </Link>
          </div>
          <div className="flex items-center mb-5">
          <div className="relative h-10 w-10 overflow-hidden rounded-full mr-4">
            <Image
              src={profile?.profilePicture || "/next.svg"}
              alt="User"
              fill
            />
          </div>
          <h4 className="text-base font-medium text-body-color">
            By <span className="pl-2">{post?.user?.username}</span>
          </h4>
          </div>
          
        </div>
        <ActionButtons id={post.id} />
      </div>

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

      <p className="mt-8 text-base font-medium text-body-color sm:text-lg lg:text-base xl:text-lg">
        {post?.content}
      </p>

      {session !== null && (
        <div className="w-full lg:w-8/12 mt-8">
          <div className="flex items-center">
            <input
              name="comment"
              id="comment"
              autoFocus
              autoComplete="off"
              placeholder="Add your comment here"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              className="input input-bordered input-md w-full"
            />
            <button
              onClick={handleCommentSave}
              className="btn btn-accent ml-4 px-6 text-white"
            >
              Add Comment
            </button>
          </div>
        </div>
      )}

      <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mt-8">
        <h2 className="text-lg lg:text-2xl font-bold text-black dark:text-white">
          Comments ({comments?.length})
        </h2>

        <div className="mt-4">
          {comments &&
            comments
              .slice()
              .reverse()
              .map((comment, index) => (
                <>
                  <div
                    key={index}
                    className="rounded-lg bg-white dark:bg-gray-900 p-4 mb-4"
                  >
                    <div className="flex items-center mb-2">
                      <div className="relative h-8 w-8 overflow-hidden rounded-full mr-3">
                        <Image
                          src={
                            comment?.user?.profile?.profilePicture ||
                            "/next.svg"
                          }
                          alt={comment?.user?.profile?.profilePicture}
                          fill
                        />
                      </div>
                      <p className="text-lg text-body-color dark:text-gray-300 font-semibold">
                        {comment?.user?.username}
                      </p>
                    </div>
                    <p className="text-body-color dark:text-gray-300 text-sm mb-4">
                      {comment?.text}
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs">
                      {formatDate(comment?.createdAt)}
                    </p>
                    {comment?.user?.id === session?.user?.id && (
                      <div className="flex items-center mt-3">
                        <button
                          className="btn btn-sm btn-primary mr-2"
                          onClick={() => handleEditComment(comment)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-error text-white"
                          onClick={() => handleDeleteComment(comment?.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  {editingComment.commentId === comment.id && (
                    <div className="flex flex-row gap-2 mt-5">
                      <input
                        type="text"
                        value={editingComment.text}
                        className="input input-bordered input-md w-[90%]"
                        onChange={(e) =>
                          setEditingComment({
                            ...editingComment,
                            text: e.target.value,
                          })
                        }
                      />
                      <button
                        className="btn btn-accent text-white py-2 px-5"
                        onClick={() => handleEditSaveComment(comment)}
                      >
                        Save
                      </button>
                    </div>
                  )}
                </>
              ))}
        </div>
      </section>
      <ToastContainer />
    </div>
  );

  // return (
  //   <div className="-mx-4 flex flex-col gap-4 items-center justify-center">
  //     <ActionButtons id={post.id} />

  //     <div className="w-full px-4 lg:w-8/12">
  //       <div>
  //         <h2 className="mb-8 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl">
  //           {post?.title}
  //         </h2>

  //         <div className="mb-10 flex flex-wrap items-center justify-between border-b border-body-color border-opacity-10 pb-4 dark:border-white dark:border-opacity-10">
  //           <div className="flex flex-wrap items-center">
  //             <div className="mr-10 mb-5 flex items-center">
  //               <div className="mr-4">
  //                 <div className="relative h-10 w-10 overflow-hidden rounded-full">
  //                   <Image
  //                     src={profile?.profilePicture || "/next.svg"}
  //                     alt="User"
  //                     fill
  //                   />
  //                 </div>
  //               </div>
  //               <div className="w-full">
  //                 <h4 className="mb-1 text-base font-medium text-body-color">
  //                   By
  //                   <span className="pl-2">{post?.user?.username}</span>
  //                 </h4>
  //               </div>
  //             </div>
  //           </div>
  //           <div className="mb-5">
  //             <Link
  //               className="badge badge-accent text-white"
  //               href={`/category/`}
  //             >
  //               {post?.tag?.name}
  //             </Link>
  //           </div>
  //         </div>
  //         <div>
  //           <div className="relative aspect-[97/60] w-full sm:aspect-[97/44]">
  //             {isImage(post?.media) ? (
  //               <Image
  //                 className="object-cover object-center"
  //                 src={post?.media}
  //                 alt={post?.media}
  //                 fill
  //               />
  //             ) : (
  //               <video
  //                 className="object-cover object-center"
  //                 src={post?.media}
  //                 alt={post?.media}
  //                 controls
  //               />
  //             )}
  //           </div>
  //           <p className="mb-8 leading-relaxed text-base font-medium text-body-color sm:text-lg lg:text-base xl:text-lg">
  //             {post?.content}
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //     <div className="w-full lg:w-8/12 flex gap-4">
  //       {session !== null ? (
  //         <>
  //           <input
  //             name="comment"
  //             id="comment"
  //             autoFocus
  //             autoComplete="off"
  //             placeholder="Add comment here"
  //             value={comment}
  //             onChange={(event) => setComment(event.target.value)}
  //             className="input input-bordered input-md w-full"
  //           />
  //           <button
  //             onClick={handleCommentSave}
  //             className="btn btn-accent px-8 text-white"
  //           >
  //             Add
  //           </button>
  //         </>
  //       ) : null}
  //     </div>
  //     <section className="bg-[#f2f2f2] py-8 px-5 lg:py-16 w-full lg:w-8/12">
  //       <div className="flex justify-between items-center mb-6">
  //         <h2 className="text-lg lg:text-2xl font-bold text-black dark:text-white">
  //           Discussion ({comments?.length})
  //         </h2>
  //       </div>
  //       <div className="flex flex-col gap-3">
  //         {
  //           // isLoading ? (
  //           //   <p>loading....</p>
  //           // ) : isError ? (<p>error....</p>) : (
  //           comments &&
  //             comments.length > 0 &&
  //             comments
  //               .slice()
  //               .reverse()
  //               .map((comment, index) => (
  //                 <div>
  //                   <div
  //                     key={index}
  //                     className="p-6 text-base flex flex-col gap-1 rounded-lg bg-white"
  //                   >
  //                     <div className="flex flex-row items-center gap-2 mb-2">
  //                       <img
  //                         src={
  //                           comment?.user?.profile?.profilePicture ||
  //                           "/next.svg"
  //                         }
  //                         alt={comment?.user?.profile?.profilePicture}
  //                         className="w-9 h-9 rounded-full"
  //                       />
  //                       <p>{comment?.user?.username}</p>
  //                     </div>
  //                     <p className="text-gray-500 dark:text-gray-400">
  //                       {comment?.text}
  //                     </p>
  //                     <p>{formatDate(comment?.createdAt)}</p>
  //                     <div className="flex justify-end">
  //                       {comment?.user?.id === session?.user?.id && (
  //                         <div className="flex item-center gap-2">
  //                           <button
  //                             className="btn"
  //                             onClick={() => handleEditComment(comment)}
  //                           >
  //                             Edit
  //                           </button>
  //                           <button
  //                             className="btn"
  //                             onClick={() => handleDeleteComment(comment?.id)}
  //                           >
  //                             Delete
  //                           </button>
  //                         </div>
  //                       )}
  //                     </div>
  //                   </div>
  // {editingComment.commentId === comment.id && (
  //   <div className="flex flex-row gap-2 mt-5">
  //     <input
  //       type="text"
  //       value={editingComment.text}
  //       className="input input-bordered input-md w-[90%]"
  //       onChange={(e) =>
  //         setEditingComment({
  //           ...editingComment,
  //           text: e.target.value,
  //         })
  //       }
  //     />
  //     <button
  //       className="btn btn-accent text-white py-2 px-5"
  //       onClick={() => handleEditSaveComment(comment)}
  //     >
  //       Save
  //     </button>
  //   </div>
  // )}
  //                 </div>
  //               ))
  //         }
  //       </div>
  //     </section>
  //     <ToastContainer />
  //   </div>
  // );
};

export default BlogProps;
