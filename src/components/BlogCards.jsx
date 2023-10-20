import Link from "next/link";
import { AiFillEye, AiFillLike, AiOutlineMessage } from "react-icons/ai";
import { BsForward } from "react-icons/bs";
import { MdPostAdd } from "react-icons/md";
import LikeButton from "@/components/buttons/LikeButton";

const BlogCards = ({ post }) => {
  const { id, tag, title, content, media, user, Comment, Like: like } = post;
  const profile = user?.profile;

  // console.log("like", like);

  const imageExtensions = ["jpeg", "jpg", "png", "gif", "webp", "svg"];

  // Function to determine if the media URL is an image
  const isImage = (url) => {
    const lowerCaseUrl = url.toLowerCase();
    return imageExtensions.some((ext) => lowerCaseUrl.includes(`.${ext}`));
  };

  return (
    <div className="p-4 w-full">
      <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
        <Link href={`/blog-details/${id}`}>
          {isImage(media) ? (
            <img
              className="lg:h-48 md:h-36 w-full object-cover object-center"
              src={media}
              alt={media}
            />
          ) : (
            <video
              className="lg:h-48 md:h-36 w-full object-cover object-center"
              src={media}
              alt={media}
              controls
            />
          )}
        </Link>

        <div className="flex items-center gap-2 px-6 mt-2">
          <img
            className="w-8 h-8 rounded-full"
            src={profile?.profilePicture || "/next.svg"}
            alt="author"
          />
          <div className="">
            <span>{user?.username}</span>
            <div className="">
              {profile?.userRole ? (
                <div>
                  {profile?.userRole.length > 2 ? (
                    <>
                      <span className="text-sm">
                        {profile?.userRole.slice(0, 2).join(" | ")}
                      </span>
                      <span className="text-sm"> | ...</span>
                    </>
                  ) : (
                    <span>{profile?.userRole.join(" | ")}</span>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="p-6">
          <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
            {tag.name}
          </h2>
          <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
            {title}
          </h1>
          <p className="leading-relaxed mb-3">
            {content?.slice(0, 30) + "..."}
          </p>
          <div className="flex items-center flex-wrap">
            <span className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
              <span>
                <AiFillEye />
              </span>
              1.2K
            </span>
            <LikeButton initialLikes={like} postId={id}/>
            <span className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
              <span>
                <BsForward />
              </span>
              1.2K
            </span>
            <span className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
              <span>
                <MdPostAdd />
              </span>
              1.2K
            </span>
            <Link href={`/blog-details/${id}`}>
              <span className="text-gray-400 inline-flex items-center leading-none text-sm">
                <span>
                  <AiOutlineMessage />
                </span>
                {Comment?.length}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCards;
