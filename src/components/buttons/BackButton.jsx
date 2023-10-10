"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { BsChevronLeft } from "react-icons/bs";

const BackButton = () => {
  const router = useRouter();
  return (
    <button className="variant flex flex-row items-center gap-2" onClick={() => router.back()}>
      <span><BsChevronLeft/></span>
      Back
    </button>
  );
};

export default BackButton;
