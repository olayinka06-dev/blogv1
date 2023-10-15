"use client";
import { interests, roles, updates } from "@/components/data/data";
import { InputForm, InputSelect } from "@/components/formgroup/Forms";
import { useBlogContext } from "@/provider/Context";
import React from "react";

const StepFour = () => {
  const { blogData } = useBlogContext();
  const { errors, setStep, step, prevStep } = blogData;
  const nextStep = () => {
    setStep(step + 1);
  };
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg mb-2">Step 4: Your interest</h3>
      <div className="mb-4">
        <label htmlFor="interests" className="block text-sm font-semibold">
          Interests
        </label>
        <InputSelect
          payload={"interests"}
          placeholder={"e.g., Web Development, AI, Mobile Apps"}
          roles={interests}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="connectWith" className="block text-sm font-semibold">
          Who you'd like to connect with
        </label>
        <InputSelect
          payload={"connect"}
          placeholder={"e.g., Front-End Developers, AI Enthusiasts"}
          roles={roles}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="updates" className="block text-sm font-semibold">
          What updates you're interested in
        </label>
        <InputSelect
          payload={"updates"}
          placeholder={"Select Updates"}
          roles={updates}
        />
      </div>
      <div className="flex flex-row items-center gap-2">
        <button onClick={prevStep} className="btn w-1/2">
          Previous
        </button>
        <button onClick={nextStep} className="btn btn-accent text-white w-1/2">
          Next
        </button>
      </div>
    </div>
  );
};

export default StepFour;
