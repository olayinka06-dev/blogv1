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
import { BiChevronDown, BiCopy } from "react-icons/bi";
import { MdModeEditOutline } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import Reply from "./Reply";
import { BsFillReplyAllFill } from "react-icons/bs";

const BlogProps = ({ post, profile, session, comm }) => {
  const router = useRouter();
  const [comments, setComments] = useState(comm);
  const [comment, setComment] = useState("");
  const [editingComment, setEditingComment] = useState({
    commentId: null,
    text: "",
  });
  const [replyingComment, setReplyingComment] = useState({
    commentId: null,
    text: "",
  });

  const postId = post?.id;
  const [commentInfo, setCommentInfo] = useState(null);

  const handleShowCommentInfo = (commentId) => {
    setCommentInfo(commentId);
    if (commentInfo === commentId) {
      setCommentInfo(null); // Close the comment info if it's already open
    } else {
      setCommentInfo(commentId); // Open the comment info if it's closed
    }
  };

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
      setCommentInfo(null);

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
    setCommentInfo(null);
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

  const handleReplyComment = (comment) => {
    setReplyingComment({
      commentId: comment.id,
    });
    setCommentInfo(null);
  };

  const handleSaveReplyComment = async (comment) => {
    try {
      const BASE_URL = `/api/post/reply`;
      const resp = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId: comment.id,
          text: replyingComment.text,
        }),
      });
      const result = await resp.json();
      const { message } = result;

      if (resp.ok) {
        Success(message);
        router.refresh();
        // Reset the editing state
        setReplyingComment({ commentId: null, text: "" });
        // Refresh comments to show the updated one
        // const updatedComments = [...comments];
        // const editedCommentIndex = updatedComments.findIndex(
        //   (c) => c.id === comment.id
        // );
        // if (editedCommentIndex !== -1) {
        //   updatedComments[editedCommentIndex].text = editingComment.text;
        //   setComments(updatedComments);
        // }
      } else {
        Error(message);
      }
    } catch (error) {
      console.error(error);
      Error(error);
    }
  };

  // useEffect(() => {
  //   let interval = setInterval(() => {
  //     router.refresh();
  //   }, 2000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [comments]);

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
                src={profile?.profilePicture || "/placeholder.jpg"}
                alt="User"
                fill
              />
            </div>
            <h4 className="text-base font-medium text-body-color">
              By <span className="pl-2">{post?.user?.username}</span>
            </h4>
            <h4 className="text-base font-medium text-body-color">
              By <span className="pl-2">{post?.user?.profile?.userRole.map((role=> role))}</span>
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

      <section className="bg-gray-100 dark:bg-gray-800 p-6 relative rounded-lg mt-8">
        <h2 className="text-lg lg:text-2xl font-bold text-black dark:text-white">
          Comments ({comments?.length})
        </h2>
        <div className="mt-4">
          {comments &&
            comments
              .slice()
              .reverse()
              .map((comment, index) => (
                <div key={index}>
                  <div
                    className={`chat  ${
                      comment?.user?.id === session?.user?.id
                        ? " chat-end"
                        : "chat-start"
                    }`}
                  >
                    <div className="chat-image avatar">
                      <div className="w-10 rounded-full">
                        <Image
                          src={
                            comment?.user?.profile?.profilePicture ||
                            "/placeholder.jpg"
                          }
                          alt={comment?.user?.profile?.profilePicture}
                          height={50}
                          width={50}
                        />
                      </div>
                    </div>
                    <div className="chat-header flex flex-row gap-2 items-center">
                      {comment?.user?.username}
                      <time className="text-xs opacity-50">
                        {formatDate(comment?.createdAt)}
                      </time>
                    </div>
                    <div className="chat-bubble bg-white relative text-gray-700">
                      <span
                        onClick={() => handleShowCommentInfo(comment.id)}
                        className=" absolute cursor-pointer top-0 right-0"
                      >
                        <BiChevronDown />
                      </span>
                      {comment?.text}
                      {commentInfo === comment.id && (
                        <div className="flex flex-col z-[100] bg-white w-[200px] shadow border rounded-xl h-fit gap-2 absolute top-[-5rem] left-0 items-center mt-3">
                          {comment?.user?.id === session?.user?.id && (
                            <span
                              className="btn flex flex-row justify-start gap-1 btn-sm w-full bg-white border-none text-right"
                              onClick={() => handleEditComment(comment)}
                            >
                              <span>
                                <MdModeEditOutline />
                              </span>
                              <span>Edit</span>
                            </span>
                          )}
                          {comment?.user?.id === session?.user?.id && (
                            <button
                              className="btn btn-sm w-full flex flex-row justify-start gap-1 bg-white border-none text-right"
                              onClick={() => handleDeleteComment(comment?.id)}
                            >
                              <span>
                                <RiDeleteBin5Line />
                              </span>
                              <span>Delete</span>
                            </button>
                          )}

                          <button className="btn btn-sm w-full flex flex-row justify-start bg-white border-none text-right">
                            <span>
                              <BiCopy />
                            </span>
                            <span>Copy</span>
                          </button>
                          <button
                            onClick={() => handleReplyComment(comment)}
                            className="btn btn-sm w-full flex flex-row justify-start bg-white border-none text-right"
                          >
                            <span>
                              <BsFillReplyAllFill />
                            </span>
                            <span>Reply</span>
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="chat-footer opacity-50">Delivered</div>
                  </div>

                  <Reply comment={comment} session={session}/>
                  {replyingComment.commentId === comment.id && (
                    <div className="flex flex-row gap-2 mt-5">
                      <input
                        type="text"
                        value={replyingComment.text}
                        placeholder="reply to a comment ..."
                        className="input input-bordered input-md w-[90%]"
                        onChange={(e) =>
                          setReplyingComment({
                            ...replyingComment,
                            text: e.target.value,
                          })
                        }
                      />
                      <button
                        className="btn btn-accent text-white py-2 px-5"
                        onClick={() => handleSaveReplyComment(comment)}
                      >
                        Save
                      </button>
                    </div>
                  )}
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
                </div>
              ))}
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default BlogProps;
