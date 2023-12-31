"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { InputForm } from "../formgroup/Forms";

const FormPost = ({
  isEdit,
  setInfo,
  setformPost,
  handleSubmitPost,
  formPost,
  info,
  handleBlogImageChange,
  imageLoading,
  imagePreviewUrl,
}) => {
  useEffect(() => {
    const availableTags = async () => {
      try {
        const resp = await axios.get("/api/tags");
        setInfo({ ...info, tagInfo: resp.data });
      } catch (error) {
        console.log(error.message);
        if (error.request) {
          setInfo({ ...info, message: "Bad Network Could not fetch Tags" });
        }
      }
    };
    availableTags();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setformPost((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex items-center justify-center">
      <form onSubmit={handleSubmitPost} className="w-[50%]">
        {info?.message && <p>{info?.message}</p>}
        {/* <div className="">
          <div
            className={`flex gap-3 relative mb-4 bg-[#f2f2f2] rounded-xl cursor-pointer`}
          >
            <label
              className={`mb-3 cursor-pointer block text-sm font-medium ${
                imageLoading ? "w-1/2" : "w-full"
              }  text-dark dark:text-white`}
            >
              <div
                className={`flex cursor-pointer flex-col w-full items-center justify-center  pt-5 pb-6`}
              >
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG or JPEG (MAX. 1mb)
                </p>
              </div>
              <input
                id="media"
                name="media"
                accept="image/*,video/*"
                max={1000000}
                onChange={handleBlogImageChange}
                type="file"
                className="w-full hidden mb-8 rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
              />
            </label>
            {imageLoading ? (
              <div className="w-1/2">
                <div>
                  <span className="loading loading-spinner loading-md"></span>
                  <span>loading...</span>
                </div>
              </div>
            ) : null}
          </div>
        </div> */}

        <div className="mb-4 relative bg-[#f2f2f2] rounded-xl cursor-pointer">
          {imageLoading && (
            <div className="absolute rounded p-2 z-[500] bg-black text-white">
              <div className="flex items-center gap-1">
                <span className="loading loading-spinner loading-md"></span>
                <span>loading...</span>
              </div>
            </div>
          )}
          {imagePreviewUrl ? (
            <label htmlFor="media">
              <figure className="max-w-lg mb-2 ">
                {imagePreviewUrl.includes("image") ? (
                  <img
                    className="max-h-[200px] max-w-full rounded-lg"
                    src={imagePreviewUrl}
                    alt="Image Preview"
                  />
                ) : (
                  <video
                    controls
                    className="max-h-[200px] max-w-full rounded-lg"
                    src={imagePreviewUrl}
                  ></video>
                )}
              </figure>
            </label>
          ) : (
            <label
              className=" cursor-pointer"
              title="Upload your blog post"
              htmlFor="media"
            >
              <div
                className={`flex flex-col w-full items-center justify-center py-10`}
              >
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG or JPEG (MAX. 1mb)
                </p>
              </div>
            </label>
          )}
          <input
            type="file"
            id="media"
            name="media"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleBlogImageChange}
          />
        </div>

        <InputForm
          htmlFor={"title"}
          labelValue={"Title"}
          type="text"
          onChange={handleFormChange}
          value={formPost.title}
          placeholder="post title..."
          id="title"
          name="title"
          className="input input-bordered input-md w-full"
        />
        <div className="relative mb-4">
          <label
            htmlFor="description"
            className="leading-7 text-sm text-gray-600"
          >
            Blog Description
          </label>
          <textarea
            id="description"
            name="description"
            onChange={handleFormChange}
            value={formPost.description}
            placeholder="blog description..."
            className="w-full textarea textarea-bordered"
          ></textarea>
        </div>
        <div className="relative mb-4">
          <label htmlFor="tagId" className="leading-7 text-sm text-gray-600">
            Select a tag
          </label>
          <select
            id="tagId"
            name="tagId"
            onChange={handleFormChange}
            value={formPost.tagId}
            className="select select-bordered w-full"
          >
            <option value="">Select a Tag</option>
            {info.tagInfo &&
              info.tagInfo?.map((ti) => (
                <option key={ti.id} value={ti.id}>
                  {ti?.name}
                </option>
              ))}
          </select>
        </div>

        <div className="relative mb-4">
          <button className={`w-full relative text-white btn btn-accent`}>
            {isEdit ? (
              <div>
                {info.loading && (
                  <span className="loading absolute ml-6 bottom-[-3.5px] loading-spinner loading-md">
                    Editing Post...
                  </span>
                )}
                <span className="">
                  {info.loading ? "Editing Post" : "Edit Post"}
                </span>
              </div>
            ) : (
              <div>
                {info.loading && (
                  <span className="loading absolute ml-9 bottom-[-3.5px] loading-spinner loading-md">
                    Creating Post...
                  </span>
                )}
                <span className="">
                  {info.loading ? "Creating Post..." : "Create Post"}
                </span>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormPost;
