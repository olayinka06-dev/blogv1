"use client";
import React, { useEffect, useState } from "react";
import BackButton from "@/components/buttons/BackButton";
import FormPost from "@/components/formpost/FormPost";
import axios from "axios";
import { useRouter } from "next/navigation";

const EditPostPage = ({ params }) => {
  const id = params.id;
  const router = useRouter();
  const [formPost, setformPost] = useState({
    title: "",
    content: "",
    tagId: "",
  });
  const [info, setInfo] = useState({
    tagInfo: "",
    message: "",
    loading: false,
  });

  useEffect(() => {
    const getPost = async () => {
      const BASE_URL = `/api/post/crud?id=${id}`;
      try {
        const resp = await axios.get(BASE_URL);
        const result = await resp.data;

        if (resp.status === 200) {
          setformPost({
            title: result?.title,
            content: result?.content,
            tagId: result?.tagId,
          });
        }
        else{
          setInfo({...info, message: result?.message})
        }
      } catch (error) {
        console.log(error);
      }
    };
    getPost();
  }, []);

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    setInfo({ ...info, loading: true });
    // console.log(formPost);

    try {
      const BASE_URL = `/api/post/crud?id=${id}`;
      const resp = await axios.patch(BASE_URL, formPost);
      const result = await resp.data;
      console.log(result);

      if (resp.status === 200) {
        router.push("/");
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
      <h2 className="mx-auto text-center">Edit Post</h2>
      <FormPost
        isEdit={true}
        setInfo={setInfo}
        setformPost={setformPost}
        handleSubmitPost={handleSubmitPost}
        info={info}
        formPost={formPost}
      />
    </section>
  );
};

export default EditPostPage;
