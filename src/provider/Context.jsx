"use client";
import { createContext, useContext } from "react";

export const BlogContext = createContext({
  blogData: {
    formData: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      username: "",
      password: "",
      confirmPassword: "",
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
      username: "",
    },
    errors: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      username: "",
      password: "",
      confirmPassword: "",
      userRole: "",
      profilePicture: null,
    },
    step: 1,
    enableCredentials: false,
    enableProfileSection: false,
    session: null,
    setEnableProfileSection: () => {},
    setEnableCredentials: () => {},
    setStep: () => {},
    setFormData: () => {},
    setErrors: () => {},
    validationSchema: () => {},
    AccountValidationSchema: () => {},
    prevStep: () => {},
  },
});

export const useBlogContext = () => useContext(BlogContext);
