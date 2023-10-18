import React from "react";
import Link from "next/link";
import SignOut from "@/components/formgroup/Buttons";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Image from "next/image";

async function getProfile(session) {
  try {
    const response = await db.user.findFirst({
      where: {id: session?.user.id},
      include: {
        profile: true
      }
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  const user = await getProfile(session);
  const profilePicture = user?.profile?.profilePicture;

  return (
    <header className="w-full p-4">
      <nav className="flex container items-center justify-between">
        <div className="">
          <Link href="/">LOGO</Link>
        </div>

        {session?.user.username ? (
          <div className="flex items-center gap-2">
            <img src={profilePicture || "/next.svg"} className="w-8 h-8 rounded-full" alt={profilePicture}/>
            <Link className="btn btn-accent text-white" href={"/create-post"}>
              Create Post
            </Link>
            <SignOut />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link className="btn btn-accent text-white" href={"/register"}>
              Register
            </Link>
            <Link className="btn btn-accent text-white" href={"/sign-in"}>
              Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
// "use client";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import SignOut from "@/components/formgroup/Buttons";
// import { useSession } from "next-auth/react";
// import { db } from "@/lib/db"; // Import your database connection

// const Navbar = () => {
//   const { data: session } = useSession();
//   const [profilePicture, setProfilePicture] = useState(null);

//   useEffect(() => {
//     if (session?.user.username) {
//       // Fetch the user's profile picture when a session exists
//       const fetchProfilePicture = async () => {
//         try {
//           const user = await db.user.findUnique({
//             where: { username: session.user.username },
//             include: {
//               profile: true
//             }
//           });
//           setProfilePicture(user?.profile?.profilePicture || null);
//         } catch (error) {
//           console.error("Error fetching profile picture:", error);
//         }
//       };

//       fetchProfilePicture();
//     }
//   }, [session]);

//   return (
//     <header className="w-full p-4">
//       <nav className="flex container items-center justify-between">
//         <div className="">
//           <Link href="/">LOGO</Link>
//         </div>

//         {session?.user.username ? (
//           <div className="flex items-center gap-2">
//             <Link className="btn btn-accent text-white" href={"/create-post"}>
//               Create Post
//             </Link>
//             <div className="flex items-center gap-2">
//               {profilePicture ? (
//                 <img
//                   src={profilePicture}
//                   alt="Profile Picture"
//                   className="w-8 h-8 rounded-full"
//                 />
//               ) : (
//                 <img
//                   src="/default-profile-image.png"
//                   alt="Default Profile Picture"
//                   className="w-8 h-8 rounded-full"
//                 />
//               )}
//               <SignOut />
//             </div>
//           </div>
//         ) : (
//           <div className="flex items-center gap-2">
//             <Link className="btn btn-accent text-white" href={"/register"}>
//               Register
//             </Link>
//             <Link className="btn btn-accent text-white" href={"/sign-in"}>
//               Login
//             </Link>
//           </div>
//         )}
//       </nav>
//     </header>
//   );
// };

// export default Navbar;

