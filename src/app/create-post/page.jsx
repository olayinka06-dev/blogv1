"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/buttons/BackButton";
import FormPost from "@/components/formpost/FormPost";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleImageSaveToFireBase } from "@/lib/__hs";

const page = () => {
  const router = useRouter();
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [formPost, setformPost] = useState({
    title: "",
    description: "",
    tagId: "",
    media: null, // Initialize the media field as null
  });

  const [info, setInfo] = useState({
    tagInfo: "",
    message: "",
    loading: false,
  });

  async function handleBlogImageChange(event) {
    // Removed type annotation for event
    const file = event.target.files[0];
    if (!event.target.files) return;
    setImageLoading(true);
    const saveImageToFirebase = await handleImageSaveToFireBase(
      event.target.files[0]
    );

    if (saveImageToFirebase !== "") {
      setImageLoading(false);
      console.log(saveImageToFirebase, "saveImageToFirebase");
      setformPost({
        ...formPost,
        media: saveImageToFirebase,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl("");
      setImageLoading(true);
      toast.error("Unable to upload please check your network", {
        position: "top-right",
        autoClose: 3000,
      });
      return true;
    }
  }

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    setInfo({ ...info, loading: true });
    try {
      console.log("formPost", formPost);
      const BASE_URL = "/api/post/create";
      const resp = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formPost),
      });
      const result = await resp.json();
        const { message } = result;
      if (resp.ok) {
        toast.success(message, {
          position: "top-right",
          autoClose: 3000,
        });
        router.refresh();
        router.push("/blog");
        setInfo({ ...info, loading: false });
      } else {
        toast.error(message, {
          position: "top-right",
          autoClose: 3000,
        });
        setInfo({ ...info, loading: false });
      }
    } catch (error) {
      console.log(error);
      toast.error(error, {
        position: "top-right",
        autoClose: 1000,
      });
      // "Bad Network Could not create post"
      setInfo({ ...info, loading: false });
    }
  };
  return (
    <section className="container px-10 py-3">
      <div className="">
        <BackButton />
      </div>
      <h2 className="mx-auto text-center mb-2">Add New Post</h2>
      <FormPost
        isEdit={false}
        setInfo={setInfo}
        setformPost={setformPost}
        handleSubmitPost={handleSubmitPost}
        info={info}
        formPost={formPost}
        handleBlogImageChange={handleBlogImageChange}
        imageLoading={imageLoading}
        imagePreviewUrl={imagePreviewUrl}
      />
      <ToastContainer />
    </section>
  );
};

export default page;
