import Link from "next/link";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { AiFillEye, AiOutlineMessage } from "react-icons/ai";

const BlogCards = ({ post }) => {
  const { id, tag, title, content, media, user } = post;
  const profile = user?.profile;

  return (
    <div className="p-4 w-full">
      <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
        {/* {renderMedia()} Call the renderMedia function */}
        <img
          className="lg:h-48 md:h-36 w-full object-cover object-center"
          src={media}
          alt={media}
        />
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
                    <span className="text-sm">{profile?.userRole.slice(0, 2).join(" | ")}</span>
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
            <Link
              href={`/blog-details/${id}`}
              className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0"
            >
              Read More
              <span>
                <HiOutlineArrowNarrowRight />
              </span>
            </Link>
            <span className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
              <span>
                <AiFillEye />
              </span>
              1.2K
            </span>
            <span className="text-gray-400 inline-flex items-center leading-none text-sm">
              <span>
                <AiOutlineMessage />
              </span>
              6
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCards;
