"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { MdModeEditOutline } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";

const ActionButtons = ({id}) => {
  const router = useRouter();
  const handleDeletePost = async () => {
    console.log(id);
    try {
      const response = await axios.delete(`/api/post/crud?id=${id}`);
      if (response.status === 204) {
        alert('Item deleted successfully')
        console.log('Item deleted successfully');
        router.push("/")
        router.refresh()
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('An error occurred while deleting the item', error);
    }
  }
  return (
    <div className="flex items-center gap-3">
      <Link
        href={`/edit-post/${id}`}
        className="variant flex flex-row items-center gap-2"
      >
        <span>
          <MdModeEditOutline />
        </span>
        Edit
      </Link>
      <button onClick={handleDeletePost} className="danger flex flex-row items-center gap-2">
        <span>
          <RiDeleteBin5Line />
        </span>
        Delete
      </button>
    </div>
  );
};

export default ActionButtons;
