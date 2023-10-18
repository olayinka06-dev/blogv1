"use client";
import React, { useEffect, useState } from "react";
import { BlogContext } from "./Context";
import { useSession } from "next-auth/react";

export const AppWrapper = ({ children }) => {
  const {data} = useSession();
  const session = data?.user.username;
  console.log(session);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    profilePicture: null,
    termsAgreed: false,
    bio: "",
    interests: [],
    connectWith: [],
    updates: [],
    userExperience: "",
    certificates: "",
    challenges: "",
    placeOfWork: "",
    userRole: [],
    username: data?.user.username,
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    username: "",
    password: "",
    confirmPassword: "",
    userRole: "",
    profilePicture: null,
  });
  const [step, setStep] = useState(1);
  const [enableCredentials, setEnableCredentials] = useState(false);
  const [enableProfileSection, setEnableProfileSection] = useState(false);

  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const validationSchema = () => {
    const hasErrors = Object.values(errors).some((error) => error);

    if (!formData.firstName) {
      setErrors((prev) => ({ ...prev, firstName: "This Field is Required" }));
    } else if (!formData.lastName) {
      setErrors((prev) => ({ ...prev, lastName: "This Field is Required" }));
    } else if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: "This Field is Required" }));
    } else if (!formData.phoneNumber) {
      setErrors((prev) => ({ ...prev, phoneNumber: "This Field is Required" }));
    } else if (!hasErrors) {
      setErrors("");
      setStep(step + 1);
      scrollUp();
    }
  };
  const AccountValidationSchema = () => {
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
      // setStep(step + 1);
      setEnableCredentials(true)
      scrollUp();
    }
  };

  const blogData = {
    setErrors,
    setFormData,
    validationSchema,
    setStep,
    AccountValidationSchema,
    prevStep,
    setEnableCredentials,
    setEnableProfileSection,
    enableProfileSection, 
    enableCredentials,
    step,
    formData,
    errors,
    session
  };
  return (
    <BlogContext.Provider value={{ blogData }}>{children}</BlogContext.Provider>
  );
};
