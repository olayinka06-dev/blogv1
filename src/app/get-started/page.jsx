"use client";

import { roles } from "@/components/data/data";
import React, { useState } from "react";

const Getstarted = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    username: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
    termsAgreed: false,
    bio: "",
    interests: "",
    connectWith: "",
    updates: "",
    userExperience: "",
    certificates: "",
    challenges: "",
    placeOfWork: "",
    userRole: "",
  });
  const [passwordStrength, setPasswordStrength] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Handling input change for text and checkbox fields
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (name === "password") {
      // Implement your own password strength logic here
      if (value.length >= 8) {
        setPasswordStrength("Strong");
      } else if (value.length >= 6) {
        setPasswordStrength("Moderate");
      } else {
        setPasswordStrength("Weak");
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePicture: file });
  };
  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const nextStep = () => {
    setStep(step + 1);
    scrollUp();
  };

  const prevStep = () => {
    setStep(step - 1);
    scrollUp();
  };

  const submitForm = () => {
    // You can handle form submission logic here, e.g., sending data to the server.
    console.log("Form Data:", formData);
  };

  return (
    <div>
      <div className="flex justify-center w-full min-h-screen items-center">
        <div className="w-2/3 bg-white p-8 rounded shadow-lg">
          <h2 className="text-2xl text-center mb-4">Get Started</h2>
          <div className="bg-gray-100 p-4 rounded mb-4">
            <div className="radial-progress" style={{ "--value": step * 20 }}>
              {step * 20}%
            </div>
          </div>

          {step === 1 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-lg mb-2">Step 1: Personal Information</h3>
              <div className="mb-4">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="input input-bordered input-md w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="input input-bordered input-md w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="input input-bordered input-md w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="input input-bordered input-md w-full"
                />
              </div>
              <button
                onClick={nextStep}
                className="btn btn-accent text-white w-full"
              >
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-lg mb-2">Step 2: Account Information</h3>
              <div className="mb-4">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Username"
                  className="input input-bordered input-md w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="input input-bordered input-md w-full"
                />
                <div>Password Strength: {passwordStrength}</div>
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className="input input-bordered input-md w-full"
                />
              </div>

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
                  onClick={nextStep}
                  disabled={!formData.termsAgreed}
                  className={`${
                    formData.termsAgreed ? "" : "bg-gray-400 cursor-not-allowed"
                  } btn btn-accent text-white w-1/2`}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-lg mb-2">Step 3: About You</h3>
              <div className="mb-4">
                <label htmlFor="media">Profile Picture</label>
                <input
                  type="file"
                  id="media"
                  name="media"
                  onChange={handleFileChange}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="userRole"
                  className="block text-sm font-semibold"
                >
                  Your Role or Title
                </label>
                <select
                  name="userRole"
                  id="userRole"
                  value={formData.userRole}
                  onChange={handleInputChange}
                  className="select w-full select-bordered"
                >
                  <option disabled selected>
                    Pick one
                  </option>
                  {roles.map((role) => (
                    <option value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="bio" className="block text-sm font-semibold">
                  Short Bio
                </label>
                <textarea
                  rows="4"
                  name="bio"
                  id="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="textarea w-full textarea-bordered h-24"
                  placeholder="Tell us a little about yourself"
                ></textarea>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="userExperience"
                  className="block text-sm font-semibold"
                >
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
                <label
                  htmlFor="certificates"
                  className="block text-sm font-semibold"
                >
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
                <label
                  htmlFor="placeOfWork"
                  className="block text-sm font-semibold"
                >
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
                <button
                  onClick={nextStep}
                  className="btn btn-accent text-white w-1/2"
                >
                  Next
                </button>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-lg mb-2">Step 4: Your interest</h3>
              <div className="mb-4">
                <label
                  htmlFor="interests"
                  className="block text-sm font-semibold"
                >
                  Interests
                </label>
                <select
                  name="interests"
                  id="interests"
                  value={formData.interests}
                  onChange={handleInputChange}
                  placeholder="e.g., Web Development, AI, Mobile Apps"
                  className="select w-full select-bordered"
                >
                  <option disabled selected>
                    Pick one
                  </option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="connectWith"
                  className="block text-sm font-semibold"
                >
                  Who you'd like to connect with
                </label>
                <input
                  type="text"
                  name="connectWith"
                  id="connectWith"
                  value={formData.connectWith}
                  onChange={handleInputChange}
                  placeholder="e.g., Front-End Developers, AI Enthusiasts"
                  className="input input-bordered input-md w-full"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="updates"
                  className="block text-sm font-semibold"
                >
                  What updates you're interested in
                </label>
                <input
                  type="text"
                  name="updates"
                  id="updates"
                  value={formData.updates}
                  onChange={handleInputChange}
                  placeholder="e.g., New frameworks, AI research"
                  className="input input-bordered input-md w-full"
                />
              </div>
              <div className="flex flex-row items-center gap-2">
                <button onClick={prevStep} className="btn w-1/2">
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  className="btn btn-accent text-white w-1/2"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h3 className="text-lg mb-2">Step 5: Complete Registration</h3>
              <div className="mb-4">
                <button
                  onClick={submitForm}
                  className="btn btn-accent text-white"
                >
                  Complete Registration
                </button>
                {/* <div className="alert alert-success">
                  <span>Message sent successfully.</span>
                </div> */}
              </div>
              <button onClick={prevStep} className="btn w-1/2">
                Previous
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Getstarted;
