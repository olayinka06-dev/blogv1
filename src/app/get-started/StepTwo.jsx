"use client";
import { InputForm } from "@/components/formgroup/Forms";
import { useBlogContext } from "@/provider/Context";
import React from "react";

const StepTwo = ({ handleInputChange }) => {
  const { blogData } = useBlogContext();
  const { formData, errors, AccountValidationSchema, prevStep } = blogData;
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg mb-2">Step 2: Account Information</h3>
      {/* <InputSelect /> */}
      <InputForm
        htmlFor="username"
        labelValue="Username"
        type="text"
        id="username"
        name="username"
        value={formData.username}
        error={errors.username}
        onChange={handleInputChange}
        placeholder="Username"
        className="input input-bordered input-md w-full"
      />
      <InputForm
        htmlFor="password"
        labelValue="Password"
        type="password"
        id="password"
        name="password"
        value={formData.password}
        error={errors.password}
        onChange={handleInputChange}
        placeholder="Password"
        className="input input-bordered input-md w-full"
      />
      <InputForm
        htmlFor="confirmPassword"
        labelValue="Confirm Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        error={errors.confirmPassword}
        onChange={handleInputChange}
        placeholder="Confirm Password"
        className="input input-bordered input-md w-full"
      />

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="termsAgreed"
            checked={formData.termsAgreed}
            onChange={handleInputChange}
            className="mr-2 checkbox"
          />
          I agree to the Terms of Service and Privacy Policy
        </label>
      </div>
      <div className="flex flex-row items-center gap-2">
        <button onClick={prevStep} className="btn w-1/2">
          Previous
        </button>
        <button
          onClick={AccountValidationSchema}
          disabled={!formData.termsAgreed}
          className={`${
            formData.termsAgreed ? "" : "bg-gray-400 cursor-not-allowed"
          } btn btn-accent text-white w-1/2`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StepTwo;
