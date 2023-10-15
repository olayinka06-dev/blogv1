"use client";
import { useBlogContext } from "@/provider/Context";
import React, { useEffect, useState } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { BsEyeSlash, BsEye } from "react-icons/bs";

export const InputSelect = ({ placeholder, roles, payload }) => {
  const { blogData } = useBlogContext();
  const { formData, setFormData } = blogData;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDatas, setSelectedDatas] = useState([]);

  const handleSelect = (select) => {
    if (selectedDatas.length < 3 && !selectedDatas.includes(select)) {
      const updatedUserRoles = [...selectedDatas, select];
      setSelectedDatas(updatedUserRoles);

      if (payload === "role") {
        setFormData((prevFormData) => ({
          ...prevFormData,
          userRole: updatedUserRoles,
        }));
      } else if (payload === "updates") {
        setFormData((prevFormData) => ({
          ...prevFormData,
          updates: updatedUserRoles,
        }));
      } else if (payload === "connect") {
        setFormData((prevFormData) => ({
          ...prevFormData,
          connectWith: updatedUserRoles,
        }));
      } else if (payload === "interests") {
        setFormData((prevFormData) => ({
          ...prevFormData,
          interests: updatedUserRoles,
        }));
      }
    }
  };

  const handleRemoveSelect = (select) => {
    const updatedSelect = selectedDatas.filter(
      (selectedData) => selectedData !== select
    );
    setSelectedDatas(updatedSelect);
  };

  useEffect(() => {
    if (selectedDatas.length === 0) {
      setIsOpen(false);
    }
  }, [selectedDatas]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <div className="select relative flex flex-row gap-2 text-white items-center w-full select-bordered">
        {selectedDatas.length > 0 ? (
          selectedDatas.map((selectedData) => (
            <div
              className="badge text-white badge-accent gap-2"
              key={selectedData}
            >
              {selectedData}
              <svg
                onClick={() => handleRemoveSelect(selectedData)}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-4 h-4 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
          ))
        ) : (
          <span className="text-black">{placeholder}</span>
        )}
        <span
          onClick={toggleDropdown}
          className="absolute right-2 text-[20px] text-black cursor-pointer"
        >
          <MdArrowDropDown />
        </span>
      </div>
      {isOpen && (
        <div className="absolute z-[500] bg-white w-full shadow-2xl px-3 border rounded-xl h-36 overflow-y-scroll">
          <div className="flex flex-col gap-1">
            {roles.map((role) => (
              <span
                key={role}
                onClick={() => handleSelect(role)}
                className="cursor-pointer"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const InputForm = ({
  htmlFor,
  labelValue,
  type,
  id,
  name,
  value,
  onChange,
  placeholder,
  className,
  error,
  toggleVisibility,
}) => {
  const [visibility, setVisibility] = useState(false);
  return (
    <div className="mb-4 flex flex-col">
      <label htmlFor={htmlFor}>{labelValue}</label>
      <div className="w-full relative">
        <input
          type={toggleVisibility && (visibility ? "text" : type)}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${className} relative`}
        />
        {toggleVisibility && (
          <span
            onClick={() => setVisibility(!visibility)}
            className="absolute right-3 opacity-60 top-[14px] cursor-pointer"
          >
            {visibility ? <BsEye /> : <BsEyeSlash />}
          </span>
        )}
      </div>
      {error && (
        <span className="text-[hsl(354,84%,57%)] text-[12px] mt-2">
          {error}
        </span>
      )}
    </div>
  );
};
