// import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";
// import {authOptions} from "../"



const Home = async () => {
  // const session = await getServerSession(authOptions)
  return (
    <section className="w-full h-screen flex justify-center items-center">
      <div className="">
        <h2>Welcome to Home Page</h2>
        <Link href={"/blog"} className="btn">Explore our Blog</Link>
      </div>
    </section>
  );
};

export default Home;
