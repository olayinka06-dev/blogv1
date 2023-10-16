import SignInForm from "@/components/sign-in/SignInForm";
import React from "react";

const SignIn = () => {
  return (
    <section>
      <div className="flex justify-center w-full min-h-[90vh] items-center">
        <div className="w-[50%] bg-white p-8 border rounded shadow-lg">
          <h2 className="text-2xl text-center mb-4">Sign In</h2>
          <SignInForm />
        </div>
      </div>
    </section>
  );
};

export default SignIn;
