"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import BackButton from "@/components/buttons/BackButton";
import FormPost from "@/components/formpost/FormPost";
import { firebaseConfig } from "@/utils";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { handleImageSaveToFireBase } from "@/lib/__hs";

// const app = initializeApp(firebaseConfig);
// const storage = getStorage(app, "gs://blog-website-a3ed3.appspot.com"); // Corrected a typo: "stroage" to "storage"

// function createUniqueFileName(fileName) {
//   const timeStamp = Date.now();
//   const randomString = Math.random().toString(36).substring(2, 12);

//   return `${fileName}-${timeStamp}-${randomString}`;
// }

// async function handleImageSaveToFireBase(file) {
//   const extractUniqueFileName = createUniqueFileName(file?.name);
//   const storageRef = ref(storage, `blog/${extractUniqueFileName}`);
//   const uploadImg = uploadBytesResumable(storageRef, file);

//   return new Promise((resolve, reject) => {
//     uploadImg.on(
//       "state_changed",
//       (snapshot) => {},
//       (error) => reject(error),
//       () => {
//         getDownloadURL(uploadImg.snapshot.ref)
//           .then((url) => resolve(url))
//           .catch((error) => reject(error));
//       }
//     );
//   });
// }

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
      return true;
    }
  }

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    setInfo({ ...info, loading: true });

    try {
      const BASE_URL = "/api/post/create";
      console.log(formPost);

      const resp = await axios.post(BASE_URL, formPost);
      console.log(resp);
      const result = await resp.data;
      console.log(result);

      if (resp.status === 200) {
        router.refresh();
        router.push("/blog");
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
    </section>
  );
};

export default page;
