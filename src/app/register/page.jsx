import React from 'react';
import RegisterForm from "@/components/register/RegisterForm"

const page = () => {
    return (
        <section>
          <div className="flex justify-center w-full min-h-[90vh] items-center">
            <div className="w-[50%] bg-white p-8 border rounded shadow-lg">
              <h2 className="text-2xl text-center mb-4">Sign Up</h2>
              <RegisterForm/>
            </div>
          </div>
        </section>
      );
}

export default page