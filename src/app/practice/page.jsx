"use client";
import React from "react";
import { useData } from './useData';


const Practice =  () => {
  // const user = await useUser();
  // console.log("session",user?.user?.username);


  const { data: post, isLoading, isError } = useData();

  if (isLoading) {
    // You can render a loading indicator here if needed.
    return <div>Loading...</div>;
  }

  if (isError) {
    // Handle the error, e.g., display an error message.
    return <div>Error: {isError.message}</div>;
  }
  console.log(post);
  return <div>Practice</div>;
};

export default Practice;
