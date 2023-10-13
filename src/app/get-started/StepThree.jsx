import React, { useState } from "react";
import { roles } from "@/components/data/data";
import { InputForm, InputSelect } from "@/components/formgroup/Forms";
import { useBlogContext } from "@/provider/Context";

const StepThree = ({
  handleInputChange,
  handleFileChange,
  imagePreviewUrl,
}) => {
  const { blogData } = useBlogContext();
  const { formData, errors, prevStep, setStep, step } = blogData;
  const [counter, setCounter] = useState(formData.bio ? formData.bio.length : 0); // Initialize counter with existing bio length
  const nextStep = () => {
    setStep(step + 1);
  };

  // Function to handle changes in the bio text area
  const handleBioChange = (event) => {
    const bioText = event.target.value;
    setCounter(bioText.length); // Update the character count
    // Update the form data
    handleInputChange(event);
  };
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg mb-2">Step 3: About You</h3>
      <div className="mb-4">
        {imagePreviewUrl ? (
          <label htmlFor="profilePicture">
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
            title="Upload your profile picture"
            htmlFor="profilePicture"
          >
            <span className="block text-sm font-semibold">Profile Picture</span>
            <div
              className={`flex flex-col w-full items-center justify-center  pt-5 pb-6`}
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
          id="profilePicture"
          name="profilePicture"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {errors.profilePicture && (
          <span className="text-[hsl(354,84%,57%)] text-[12px] mt-2">
            {errors.profilePicture}
          </span>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="userRole" className="block text-sm font-semibold">
          Your Role or Title
        </label>
        <InputSelect
          payload={"role"}
          placeholder={"Select your role"}
          roles={roles}
        />
      </div>
      <div className="mb-4">
          <div className="flex justify-between items-center">
            <label htmlFor="bio" className="block text-sm font-semibold">
              Short Bio
            </label>
            <span>
              {counter}/200
            </span>
          </div>
          <textarea
            rows="4"
            name="bio"
            id="bio"
            value={formData.bio}
            onChange={handleBioChange} 
            className="textarea w-full textarea-bordered h-24"
            placeholder="Tell us a little about yourself"
          ></textarea>
        </div>

      <div className="mb-4">
        <label htmlFor="userExperience" className="block text-sm font-semibold">
          Years of Experience
        </label>
        <input
          type="text"
          id="userExperience"
          name="userExperience"
          value={formData.userExperience}
          onChange={handleInputChange}
          placeholder="e.g., 5 years"
          className="input input-bordered input-md w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="certificates" className="block text-sm font-semibold">
          Certifications
        </label>
        <input
          type="text"
          name="certificates"
          id="certificates"
          value={formData.certificates}
          onChange={handleInputChange}
          placeholder="e.g., Certified Web Developer"
          className="input input-bordered input-md w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="placeOfWork" className="block text-sm font-semibold">
          Place of Work
        </label>
        <input
          type="text"
          name="placeOfWork"
          id="placeOfWork"
          value={formData.placeOfWork}
          onChange={handleInputChange}
          placeholder="e.g., ABC Tech Inc."
          className="input input-bordered input-md w-full"
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

export default StepThree;
