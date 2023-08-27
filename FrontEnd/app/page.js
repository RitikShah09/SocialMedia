"use client";
import React from "react";
import Link from "next/link";
import TextInput from "./Shared/TextInput";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import { UserContext } from "./Context/UserContext";
import { useContext } from "react";
import { makeUnauthenticatedPOSTRequest } from "@/utils/serverHelper";
import { redirectToHome } from "@/utils/auth";

const page = () => {
  redirectToHome();
  const [user, setUser] = useContext(UserContext);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [cookie, setCookie] = useCookies(["token"]);

  const signUp = async () => {
    const data = { email, password, username, name };
    const response = await makeUnauthenticatedPOSTRequest(
      "/auth/register",
      data
    );
    if (response && !response.err) {
      const token = response.token;
      setUser(response);
      const date = new Date();
      date.setDate(date.getDate() + 30);
      setCookie("token", token, { path: "/", expires: date });
      router.push("/profile");
      console.log(response);
    } else {
      alert("Failure");
    }
  };
  return (
    <div className=" h-screen w-full flex rounded-sm overflow-hidden">
      <div className="h-full sm:hidden w-1/2 bg-[#F3F5F9] relative flex items-center justify-center">
        <div className="w-44 h-44 rounded-full bg-[#5851DB]"></div>
        <div className="w-full h-1/2 backdrop-blur-sm absolute bottom-0"></div>
      </div>
      <div className="h-full w-1/2 sm:w-full relative">
        <div className="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-5 px-12 flex flex-col items-center justify-center">
          <h6 className=" text-2xl mb-4 font-medium w-64 text-left">
            Sign<span className="text-[#5851DB]">Up</span>
          </h6>

          <TextInput
            className="mb-3 mt-1 flex flex-col"
            label="Email"
            type="email"
            placeholder="Email"
            value={email}
            setValue={setEmail}
          />
          <TextInput
            className="mb-3 flex flex-col"
            label="Name"
            type="text"
            placeholder="Name"
            value={name}
            setValue={setName}
          />
          <TextInput
            label="UserName"
            type="Text"
            placeholder="UserName"
            className="mb-3 flex flex-col"
            value={username}
            setValue={setUsername}
          />
          <TextInput
            label="Password"
            type="password"
            placeholder="Password"
            className="mb-3 mt-1 flex flex-col"
            value={password}
            setValue={setPassword}
          />

          <button
            className="mt-3 w-64 bg-[#5851DB] text-white py-2 rounded-md border-none font-medium"
            onClick={(e) => {
              e.preventDefault();
              signUp();
            }}
          >
            SignUp
          </button>
          <h5 className=" text-base mt-6">
            Already have an account?
            <Link
              className=" no-underline text-[#5851DB] font-medium"
              href="/login"
            >
              Login
            </Link>
          </h5>
        </div>
      </div>
    </div>
  );
};

export default page;
