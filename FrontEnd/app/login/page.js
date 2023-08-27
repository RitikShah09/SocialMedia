'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import TextInput from '../Shared/TextInput';
import { makeUnauthenticatedPOSTRequest } from '@/utils/serverHelper';
import { useRouter } from 'next/navigation';
import { UserContext } from '../Context/UserContext';
import { useContext } from 'react';
import { redirectToHome } from "@/utils/auth";

const page = () => {
  redirectToHome();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookie, setCookie] = useCookies(["token"]);
  const [user, setUser] = useContext(UserContext);

  const logIn = async () => {
    const data = { email, password };
    console.log(data);
    const response = await makeUnauthenticatedPOSTRequest("/auth/login", data);
    if (response && !response.err) {
      setUser(response);
      const token = response.token;
      const date = new Date();
      date.setDate(date.getDate() + 30);
      setCookie("token", token, { path: "/", expires: date });
      router.push('/profile');
    } else {
      alert("Failure");
    }
  };
  return (
      <div className=" h-screen w-full flex rounded-sm overflow-hidden">
        <div className="h-full w-1/2 sm:w-full relative">
          <div className="w-full h-full absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] flex py-5 px-12 items-center flex-col justify-center">
            <div className="text-left w-64 ">
              <h6 className=" text-xl font-medium">
                Welcome, <span className="text-[#5851DB]">Back</span>
              </h6>
              <p className=" text-sm">
                Welcome back! Please enter your details.
              </p>
            </div>
            <TextInput
              placeholder="Enter Your Email"
              type="text"
              label="Email"
              className="my-2 flex flex-col"
              value={email}
              setValue={setEmail}
            />
            <TextInput
              placeholder="Enter Your Password"
              type="password"
              label="Password"
              className="mb-3 mt-3 flex flex-col"
              value={password}
              setValue={setPassword}
            />
            <button
              className=" my-3 w-64 font-medium border-none rounded-md py-2 px-0 bg-[#5851DB] text-white"
              onClick={(e) => {
                e.preventDefault();
                logIn();
              }}
            >
              Login
            </button>

            {/* <Link
              className=" mb-4 text no-underline text-black font-extralight"
              href="/forgot"
            >
              Forgot Password?
            </Link> */}
            <h5 className=" text-base">
              Don't have an account?
              <Link className=" no-underline text-[#5851DB] font-medium" href="/signup">
                SignUp
              </Link>
            </h5>
          </div>
        </div>

        <div className="h-full sm:hidden w-1/2 bg-[#f3f5f9] relative flex items-center justify-center">
          <div className=" h-44 w-44 rounded-full bg-[#5851DB]"></div>
          <div className="w-full h-1/2 backdrop-blur-sm absolute bottom-0"></div>
        </div>
      </div>
  );
};

export default page;
