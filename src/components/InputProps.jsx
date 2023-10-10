import React, { useState } from "react";
import { BsEyeSlash, BsEye } from "react-icons/bs";

export const FormField = ({
  type,
  htmlfor,
  id,
  name,
  label,
  onChange,
  value,
  toggleVisiblity,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative mb-4">
      <label htmlFor={htmlfor} className="leading-7 text-sm text-gray-600">
        {label}
      </label>
      <div className="w-full relative">
        <input
          type={toggleVisiblity && (showPassword ? "text" : type)}
          id={id}
          name={name}
          onChange={onChange}
          value={value}
          className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
        {toggleVisiblity && (
          <span
            className="absolute right-3 opacity-60 top-[14px] cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <BsEyeSlash /> : <BsEye />}
          </span>
        )}
        {error && (
          <span className="text-[hsl(354,84%,57%)] text-[12px] mt-2">
            {error}
          </span>
        )}
      </div>
    </div>
  );
};

export const Button = ({ btn }) => {
  return (
    <button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
      {btn}
    </button>
  );
};
