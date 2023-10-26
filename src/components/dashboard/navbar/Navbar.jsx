import Image from "next/image";
import React from "react";

export const Navbar = () => {
  const images = [
    "/my-profile.jpeg",
    "/my-profile.jpeg",
    "/my-profile.jpeg",
    "/my-profile.jpeg",
    "/my-profile.jpeg",
    "/my-profile.jpeg",
    "/my-profile.jpeg",
    "/my-profile.jpeg",
    "/my-profile.jpeg",
    "/my-profile.jpeg",
    "/my-profile.jpeg",
    "/my-profile.jpeg",
    "/my-profile.jpeg",
    "/my-profile.jpeg",
    "/my-profile.jpeg",
    "/my-profile.jpeg",
    "/my-profile.jpeg",
    "/my-profile.jpeg",
    "/my-profile.jpeg",
  ];
  return (
    <nav className="shadow py-4 px-3">
      <div className=" overflow-x-scroll">
        <span>frequently chat</span>
        <div className="flex gap-2">
          {images.map((image, i) => (
            <div key={i} className="">
              <Image
                alt="logo"
                className="rounded-full"
                src={image}
                height={40}
                width={40}
              />
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};
