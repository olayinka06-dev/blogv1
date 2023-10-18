"use client";
import { signOut } from 'next-auth/react'
import React from 'react'

const SignOut = () => {
  return (
    <button onClick={() => signOut({
      redirect: true,
      callbackUrl: `${window.location.origin}/sign-in`
    })} className="btn btn-neutral">
      Sign Out
    </button>
  )
}

export default SignOut;

