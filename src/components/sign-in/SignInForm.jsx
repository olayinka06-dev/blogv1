"use client";
import { InputForm } from "@/components/formgroup/Forms";
import GithubSignInForm from "@/components/formgroup/GithubSignInForm";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SignInForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    termsAgreed: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setErrors((prev) => ({
      ...prev,
      [name]:
        name === "password" &&
        !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/.test(value)
          ? "Password should contain both numbers and special characters and have a length between 5 and 11 characters."
          : "",
    }));
  };
  const handleSubmit = async () => {
    const hasErrors = Object.values(errors).some((error) => error);

    if (!formData.username) {
      setErrors((prev) => ({ ...prev, username: "This Field is Required" }));
    } else if (!formData.password) {
      setErrors((prev) => ({ ...prev, password: "This Field is Required" }));
    } else if (!hasErrors) {
      try {
        const signInData = await signIn("credentials", {
          username: formData.username,
          password: formData.password,
          redirect: false,

          // callbackUrl: "/dsahboard"
        });

        if (signInData.error) {
          if (signInData.error === "Invalid credentials") {
            setMessage("Invalid email or password");
          }

          if (signInData.error === "Account is locked") {
            setMessage("Account is locked. Please contact support.");
          }

          if (signInData.error === "User not found") {
            setMessage("User not found. Please check your username.");
          }

          console.error(signInData.error);
        } else {
          router.refresh();
          router.push("/get-started");
        }
      } catch (error) {
        console.error("Network error:", error);
        setMessage("Network error. Please try again later.");
      }
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg mb-2">
        <div className="badge badge-accent text-white">Account Information</div>
      </h3>
      {message && <p>{message}</p>}
      <InputForm
        htmlFor="username"
        labelValue="Username"
        type="text"
        id="username"
        name="username"
        value={formData.username}
        error={errors.username}
        onChange={handleInputChange}
        placeholder="Username"
        className="input input-bordered input-md w-full"
      />
      <InputForm
        htmlFor="password"
        labelValue="Password"
        type="password"
        id="password"
        name="password"
        value={formData.password}
        error={errors.password}
        onChange={handleInputChange}
        placeholder="Password"
        className="input input-bordered input-md w-full"
        toggleVisibility={true}
      />
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="termsAgreed"
            checked={formData.termsAgreed}
            onChange={handleInputChange}
            className="mr-2 checkbox"
          />
          I agree to the Terms of Service and Privacy Policy
        </label>
      </div>

      <div className="flex flex-col w-full lg:flex-row">
        <button
          onClick={handleSubmit}
          disabled={!formData.termsAgreed}
          className={`${
            formData.termsAgreed ? "" : "bg-gray-400 cursor-not-allowed"
          } btn btn-accent text-white w-1/2`}
        >
          Sign In
        </button>
        <div className="divider lg:divider-horizontal">OR</div>
        <GithubSignInForm />
      </div>

      <div className="mb-4 flex justify-end">
        <span>
          Don't have an Account{" "}
          <a className="text-accent underline" href="/register">
            Register
          </a>
        </span>
      </div>
    </div>
  );
};

export default SignInForm;