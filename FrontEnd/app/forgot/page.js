import React from 'react'
import "remixicon/fonts/remixicon.css";
import Link from 'next/link';
import redirToSignInIfNoToken from '@/utils/auth';
const page = () => {
  redirToSignInIfNoToken();
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className=" py-14 px-28 h-5/6 border flex flex-col items-center justify-center rounded-xl gap-5">
        <i className=" p-5 border border-gray-400 rounded-full text-6xl text-black ri-lock-line"></i>
        <h6 className="text-xl font-medium">Trouble logging in?</h6>
        <p className=" text-base">
          Enter your email and we'll send you <br />a link to get back into your
          account.
        </p>
        <input
          className="border outline-none text-base rounded-lg w-64 py-2 px-3"
          placeholder="Email"
          name="email"
          type="email"
        />
        <button className=" py-2 w-64 font-medium rounded-lg border-none bg-gray-200">
          Send Login Link
        </button>
        <div className="flex items-center gap-5">
          <div className="w-20 h-[2px] bg-[#c3c3c3]"></div>
          <h6>OR</h6>
          <div className="w-20 h-[2px] bg-[#c3c3c3]"></div>
        </div>
        <Link
          className="w-64 font-medium text-sm no-underline py-2 rounded-lg text-white text-center bg-[#4CB5F9]"
          href="signup"
        >
          Create New Account
        </Link>
        <Link
          className="w-64 font-medium text-sm no-underline py-2 text-center rounded-lg bg-[#5851DB] text-white"
          href="/login"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default page
