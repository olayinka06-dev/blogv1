"use client";
import React from "react";
import { useBlogContext } from "@/provider/Context";
import { signIn } from "next-auth/react";

const GithubSignInForm = () => {
  const { blogData } = useBlogContext();
  const { enableCredentials, setStep, setEnableCredentials } = blogData;
  const handleLogin = async () => {
    await signIn("github")
    setStep(2)
  };
  return (
    <button
      onClick={handleLogin}
      type="submit"
      className="btn w-auto bg-[#fff] text-[#000]"
    >
      <img
        loading="lazy"
        height="24"
        width="24"
        id="provider-logo"
        src="https://authjs.dev/img/providers/github.svg"
      />
      {/* <img
        loading="lazy"
        height="24"
        width="24"
        id="provider-logo-dark"
        src="https://authjs.dev/img/providers/github-dark.svg"
      /> */}
      <span>Sign in with GitHub</span>
    </button>
  );
};

export default GithubSignInForm;
