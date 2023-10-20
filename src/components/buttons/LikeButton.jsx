"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AiFillLike } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LikeButton = ({ postId, initialLikes }) => {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(initialLikes?.length);
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();
  console.log("<<<<<<<<id>>>>>>>>>>", initialLikes[0]?.id);

  const handleLike = async () => {
    if (!session) {
      // Redirect to the login page if the user is not authenticated
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`/api/post/like?id=${postId}`, {
        method: "POST",
      });

      const data = await response.json();
      const { likes, message } = data;
      if (response.ok) {
        setLikes(likes);
        setIsLiked(!isLiked);
        toast.success(message, {
          position: "top-right",
          autoClose: 3000,
        });
        router.refresh();
      } else {
        toast.error("Failed to like/unlike the post", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Error liking/unliking the post", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    // You can fetch the user's liked status for the post here and set setIsLiked accordingly.
    // If the user has already liked the post, setIsLiked(true).
    // You might need to make a separate API request to check if the user has liked the post when this component mounts.
  }, []);
  return (
    <>
      <span
        onClick={handleLike}
        className={`${likes === 1 ? "text-accent" : "text-gray-400"}  mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200`}
      >
        <span>
          <AiFillLike />
        </span>
        {likes}
      </span>
      <ToastContainer />
    </>
  );
};

export default LikeButton;
