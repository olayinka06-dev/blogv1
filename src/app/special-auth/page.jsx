"use client";
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/utils";

const AuthButton = () => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const email = "saaduabdulrahman@gmail.com"; // Replace with user input
      const password = "Idiagbon77$"; // Replace with user input

      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing in:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      const email = "saaduabdulrahman@gmail.com"; // Replace with user input
      const password = "Idiagbon77$"; // Replace with user input

      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing up:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <button className="btn" onClick={handleSignIn} disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
        <button className="btn" onClick={handleSignUp} disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        <button className="btn" onClick={handleSignOut} disabled={loading}>
          {loading ? "Signing Out..." : "Sign Out"}
        </button>
      </div>
    </div>
  );
};

export default AuthButton;
