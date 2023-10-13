"use client";
import { InputForm } from "@/components/formgroup/Forms";
import { useBlogContext } from "@/provider/Context";
import React from "react";

const StepOne = ({handleInputChange}) => {
    const { blogData } = useBlogContext();
    const {
      formData,
      setFormData,
      errors,
      setErrors,
      validationSchema,
      step,
      setStep,
      AccountValidationSchema,
    } = blogData;
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg mb-2">Step 1: Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <InputForm
          htmlFor="firstName"
          labelValue="First Name"
          type="text"
          name="firstName"
          error={errors.firstName}
          id="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          placeholder="First Name"
          className="input input-bordered input-md w-full"
        />
        <InputForm
          htmlFor="lastName"
          labelValue="Last Name"
          type="text"
          name="lastName"
          id="lastName"
          value={formData.lastName}
          error={errors.lastName}
          onChange={handleInputChange}
          placeholder="Last Name"
          className="input input-bordered input-md w-full"
        />
      </div>
      <InputForm
        htmlFor="email"
        labelValue="Email"
        type="text"
        id="email"
        name="email"
        value={formData.email}
        error={errors.email}
        onChange={handleInputChange}
        placeholder="Email"
        className="input input-bordered input-md w-full"
      />
      <InputForm
        htmlFor="phoneNumber"
        labelValue="Phone Number"
        type="tel"
        name="phoneNumber"
        id="phoneNumber"
        value={formData.phoneNumber}
        error={errors.phoneNumber}
        onChange={handleInputChange}
        placeholder="Phone Number"
        className="input input-bordered input-md w-full"
      />
      <button
        onClick={validationSchema}
        className="btn btn-accent text-white w-full"
      >
        Next
      </button>
    </div>
  );
};

export default StepOne;
