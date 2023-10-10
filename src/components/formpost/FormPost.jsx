"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

const FormPost = ({
  isEdit,
  setInfo,
  setformPost,
  handleSubmitPost,
  formPost,
  info,
  handleMediaChange
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
    <form onSubmit={handleSubmitPost} className="">
      {info?.message && <p>{info?.message}</p>}
      <div className="relative mb-4">
        <label
          htmlFor="title"
          placeholder="post title..."
          className="leading-7 text-sm text-gray-600"
        >
          Title
        </label>
        <input
          type="text"
          onChange={handleFormChange}
          value={formPost.title}
          placeholder="post title..."
          id="title"
          name="title"
          className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
      </div>
      <div className="relative mb-4">
        <label
          htmlFor="content"
          placeholder="post content..."
          className="leading-7 text-sm text-gray-600"
        >
          Content
        </label>
        <textarea
          id="content"
          name="content"
          onChange={handleFormChange}
          value={formPost.content}
          placeholder="post content..."
          className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        ></textarea>
      </div>
      <div className="relative mb-4">
        <label
          htmlFor="title"
          placeholder="post content..."
          className="leading-7 text-sm text-gray-600"
        >
          Content
        </label>
        <select
          id="tagId"
          name="tagId"
          onChange={handleFormChange}
          value={formPost.tagId}
          className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
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
        <label htmlFor="media" className="leading-7 text-sm text-gray-600">
          Media (Image/Video)
        </label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleMediaChange}
          id="media"
          name="media"
          className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
      </div>
      <div className="relative mb-4">
        <button
          className={`w-full relative text-white bg-indigo-500 border-0  py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg`}
        >
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
  );
};

export default FormPost;
