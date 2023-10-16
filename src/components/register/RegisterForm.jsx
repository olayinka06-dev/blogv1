"use client";
import { InputForm } from "@/components/formgroup/Forms";
import GithubSignInForm from "@/components/formgroup/GithubSignInForm";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    termsAgreed: "",
  });
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const validationSchema = () => {
    const hasErrors = Object.values(errors).some((error) => error);

    if (!formData.username) {
      setErrors((prev) => ({ ...prev, username: "This Field is Required" }));
    } else if (!formData.password) {
      setErrors((prev) => ({ ...prev, password: "This Field is Required" }));
    } else if (!formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "This Field is Required",
      }));
    } else if (!hasErrors) {
      setErrors("");
    }
  };

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
        !/^(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{5,11}$/.test(value)
          ? "Password should contain both numbers and special characters and have a length between 5 and 11 characters."
          : name === "confirmPassword" &&
            formData.password !== formData.confirmPassword
          ? "Password do not match!"
          : "",
    }));
  };
  const handleSubmit = async () => {
    setLoading(true);
    if (validationSchema) {
      try {
        const BASE_URL = "/api/register";
        const resp = await fetch(BASE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const result = await resp.json();
        const { message, status } = result;

        if (resp.ok) {
          setLoading(false);
          toast.success(message, {
            position: "top-right",
            autoClose: 3000, 
          });
          router.push("/sign-in");
        } else {
          setLoading(false);
          toast.error(message, {
            position: "top-right",
            autoClose: 3000, 
          });
          console.log({ message, status });
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
        toast.error(error, {
          position: "top-right",
          autoClose: 3000, 
        });
      }
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg mb-2">
        <div className="badge badge-accent text-white">Account Information</div>
      </h3>
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
      <InputForm
        htmlFor="confirmPassword"
        labelValue="Confirm Password"
        type="password"
        name="confirmPassword"
        id={"confirmPassword"}
        value={formData.confirmPassword}
        error={errors.confirmPassword}
        onChange={handleInputChange}
        placeholder="Confirm Password"
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
      <ToastContainer />
      <div className="flex flex-col w-full lg:flex-row">
        <button
          onClick={handleSubmit}
          disabled={!formData.termsAgreed}
          className={`${
            formData.termsAgreed ? "" : "bg-gray-400 cursor-not-allowed"
          } btn btn-accent text-white relative w-1/2`}
        >
          <div>
              {loading && (
                <span className="loading absolute ml-6 bottom-[12px] loading-spinner loading-md">
                  Signing Up...
                </span>
              )}
              <span className="">
                {loading ? "Signing Up..." : "Sign Up"}
              </span>
            </div>
        </button>
        <div className="divider lg:divider-horizontal">OR</div>
        <GithubSignInForm />
      </div>
      <div className="mb-4 flex justify-end">
        <span>
          Already have an Account{" "}
          <a className="text-accent underline" href="/sign-in">
            Sign In
          </a>
        </span>
      </div>
    </div>
  );
};

export default RegisterForm;
