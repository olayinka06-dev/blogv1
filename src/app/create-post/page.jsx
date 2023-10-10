"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import BackButton from "@/components/buttons/BackButton";
import FormPost from "@/components/formpost/FormPost";

const page = () => {
  const router = useRouter();
  const [formPost, setformPost] = useState({
    title: "",
    content: "",
    tagId: "",
    media: null, // Initialize the media field as null
  });

  const [info, setInfo] = useState({
    tagInfo: "",
    message: "",
    loading: false,
  });
  // Add this function inside your FormPost component
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    setformPost((prev) => ({ ...prev, media: file }));
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    setInfo({ ...info, loading: true });
    // console.log(formPost);

    try {
      const BASE_URL = "/api/post/create";

      const formData = new FormData();
      formData.append("title", formPost.title);
      formData.append("content", formPost.content);
      formData.append("tagId", formPost.tagId);
      formData.append("media", formPost.media); // Append the media file

      console.log(formData);

      const resp = await axios.post(BASE_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the content type to form data
        },
      });
      console.log(resp);
      const result = await resp.data;
      console.log(result);

      if (resp.status === 200) {
        router.push("/");
        router.refresh();
        setInfo({ ...info, message: result.message });
        setInfo({ ...info, loading: false });
      } else {
        setInfo({ ...info, message: result.message });
        setInfo({ ...info, loading: false });
      }
    } catch (error) {
      console.log(error.message);
      if (error.request) {
        setInfo({ ...info, message: "Bad Network Could not create post" });
      }
    }
  };
  return (
    <section className="container px-10">
      <div className="">
        <BackButton />
      </div>
      <h2 className="mx-auto text-center">Add New Post</h2>
      <FormPost
        isEdit={false}
        setInfo={setInfo}
        setformPost={setformPost}
        handleSubmitPost={handleSubmitPost}
        info={info}
        formPost={formPost}
        handleMediaChange={handleMediaChange}
      />
    </section>
  );
};

export default page;
