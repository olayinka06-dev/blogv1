"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AiFillLike } from "react-icons/ai";


const LikeButton = ({ postId, initialLikes }) => {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();

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

      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes);
        setIsLiked(!isLiked);
      } else {
        console.error("Failed to like/unlike the post");
      }
    } catch (error) {
      console.error("Error liking/unliking the post:", error);
    }
  };

  useEffect(() => {
    // You can fetch the user's liked status for the post here and set setIsLiked accordingly.
    // If the user has already liked the post, setIsLiked(true).
    // You might need to make a separate API request to check if the user has liked the post when this component mounts.
  }, []);
  return (
    <span
      onClick={handleLike}
      className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200"
    >
      <span>
        <AiFillLike />
      </span>
      {likes}
    </span>
  );
};

export default LikeButton;
