// import Link from "next/link";
// import {HiOutlineArrowNarrowRight} from "react-icons/hi";
// import {AiFillEye, AiOutlineMessage} from 'react-icons/ai';

// const BlogCards = ({ post }) => {
//   const { id, tag, title, content } = post;
//   return (
//     <div className="p-4 w-full">
//       <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
//         {/* <img
//           className="lg:h-48 md:h-36 w-full object-cover object-center"
//           src="https://dummyimage.com/721x401"
//           alt="blog"
//         /> */}
//         <div className="p-6">
//           <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
//             {tag.name}
//           </h2>
//           <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
//             {title}
//           </h1>
//           <p className="leading-relaxed mb-3">
//             {content?.slice(0, 30)+"..."}
//           </p>
//           <div className="flex items-center flex-wrap">
//             <Link
//               href={`/blog-details/${id}`}
//               className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0"
//             >
//               Read More
//               <span><HiOutlineArrowNarrowRight/></span>
//             </Link>
//             <span className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
//               <span><AiFillEye/></span>
//               1.2K
//             </span>
//             <span className="text-gray-400 inline-flex items-center leading-none text-sm">
//               <span><AiOutlineMessage/></span>
//               6
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogCards;



import Link from "next/link";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { AiFillEye, AiOutlineMessage } from "react-icons/ai";

const BlogCards = ({ post }) => {
  const { id, tag, title, content, Media: media } = post;
  // console.log(post);

  // Function to render media based on type (image or video)
  const renderMedia = () => {
    if (media && media.length > 0) {
      const firstMedia = media[0]; // Assuming you only display the first media
      if (firstMedia.type === "image") {
        // Render image
        return (
          <img
            className="lg:h-48 md:h-36 w-full object-cover object-center"
            src={firstMedia.url}
            alt={title}
          />
        );
      } else if (firstMedia.type === "video") {
        // Render video
        return (
          <video controls className="w-full">
            <source src={firstMedia.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      }
    }
    return null; // No media to display
  };

  return (
    <div className="p-4 w-full">
      <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
        {renderMedia()} {/* Call the renderMedia function */}
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
