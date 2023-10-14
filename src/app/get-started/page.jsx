"use client";

import { useBlogContext } from "@/provider/Context";
import React, { useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import { firebaseConfig } from "@/utils";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app, "gs://blog-website-a3ed3.appspot.com"); // Corrected a typo: "stroage" to "storage"

function createUniqueFileName(fileName) {
  const timeStamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 12);

  return `${fileName}-${timeStamp}-${randomString}`;
}

async function handleImageSaveToFireBase(file) {
  const extractUniqueFileName = createUniqueFileName(file?.name);
  const storageRef = ref(storage, `blog/${extractUniqueFileName}`);
  const uploadImg = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadImg.on(
      "state_changed",
      (snapshot) => {},
      (error) => reject(error),
      () => {
        getDownloadURL(uploadImg.snapshot.ref)
          .then((url) => resolve(url))
          .catch((error) => reject(error));
      }
    );
  });
}

const Getstarted = () => {
  const { blogData } = useBlogContext();
  const { formData, setFormData, setErrors, step, setStep, errors } = blogData;
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Handling input change for text and checkbox fields
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setErrors((prev) => ({
      ...prev,
      [name]:
        name === "email" && value.length > 0 && !/\S+@\S+\.\S+/.test(value)
          ? "Invalid Email Address"
          : name === "password" &&
            !/^(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{5,11}$/.test(value)
          ? "Password should contain both numbers and special characters and have a length between 5 and 11 characters."
          : name === "confirmPassword" &&
            formData.password !== formData.confirmPassword
          ? "Password do not match!"
          : "",
    }));
  };

  const handleFileChange = async (e) => {
    const { name } = e.target;
    if (!e.target.files) return;
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 500 * 1024;

    if (!allowedTypes.includes(file?.type)) {
      setErrors((prev) => ({
        ...prev,
        [name]: name === "profilePicture" && "PNG, JPG and PDF files only",
      }));
    } else if (file && file?.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        [name]:
          name === "profilePicture" && "File size exceeds the limit (500 KB)",
      }));
    } else if (allowedTypes.includes(file?.type) && file?.size < maxSize) {
      setImageLoading(true);
      const saveImageToFirebase = await handleImageSaveToFireBase(file);
      setImageLoading(false);
      console.log(saveImageToFirebase, "saveImageToFirebase");
      saveImageToFirebase !== "" &&
        setFormData({ ...formData, profilePicture: saveImageToFirebase });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({
        ...prev,
        [name]: name === "profilePicture" && "",
      }));
    } else {
      setImagePreviewUrl("");
      return true;
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const submitForm = async () => {
    console.log("formdata", formData);
    try {
      const BASE_URL = "/api/get-started";
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
        alert(message);
        // setMessage(message);
        // router.push("/login")
      } else {
        alert(message);
        console.log({ message, status });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex justify-center w-full min-h-screen items-center">
        <div className="w-2/3 bg-white p-8 rounded shadow-lg">
          <h2 className="text-2xl text-center mb-4">Get Started</h2>
          <div className="bg-gray-100 p-4 rounded mb-4">
            <div className="radial-progress" style={{ "--value": step * 20 }}>
              {step * 20}%
            </div>
          </div>

          {step === 1 && <StepOne handleInputChange={handleInputChange} />}

          {step === 2 && <StepTwo handleInputChange={handleInputChange} />}

          {step === 3 && (
            <StepThree
              imagePreviewUrl={imagePreviewUrl}
              handleInputChange={handleInputChange}
              handleFileChange={handleFileChange}
              imageLoading={imageLoading}
            />
          )}
          {step === 4 && <StepFour handleInputChange={handleInputChange} />}

          {step === 5 && (
            <div>
              <h3 className="text-lg mb-2">Step 5: Complete Registration</h3>
              <div className="mb-4">
                <button
                  onClick={submitForm}
                  className="btn btn-accent text-white"
                >
                  Complete Registration
                </button>
                {/* <div className="alert alert-success">
                  <span>Message sent successfully.</span>
                </div> */}
              </div>
              <button onClick={prevStep} className="btn w-1/2">
                Previous
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Getstarted;
