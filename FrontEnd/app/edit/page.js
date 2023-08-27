"use client";
import React, { useState, useContext, useEffect } from "react";
import Nav from "../Shared/Nav";
import Link from "next/link";
import "remixicon/fonts/remixicon.css";
import { useRouter } from "next/navigation";
import { UserContext } from "../Context/UserContext";
import { makeAuthenticatedPOSTRequest } from "@/utils/serverHelper";
import { uploadCloudinary } from "@/utils/upload";
import redirToSignInIfNoToken from "@/utils/auth";

const page = () => {
  redirToSignInIfNoToken();
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [user, setUser] = useContext(UserContext);
  const [name, setName] = useState(user.name);
  const [username, setUserName] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio);
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [cnfpassword, setCnfPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const updateUser = async () => {
    const data = { email, name, username, bio };
    const response = await makeAuthenticatedPOSTRequest(
      "/auth/update/user",
      data
    );
    if (response && !response.err) {
      setUser(response);
      router.push("/profile");
    } else {
      alert("Failure");
    }
  };

  const resetPassword = async () => {
    const data = { password, newPassword };
    const response = await makeAuthenticatedPOSTRequest(
      "/auth/reset/password",
      data
    );
    if (response._id) {
      setUser(response);
      setShow(false);
    } else {
      console.log('Failed To Reset Password')
    }
  };

  useEffect(() => {
    handlerSubmit();
  }, [images]);

  const selectBtn = () => {
    document.querySelector(".file").click();
  };
  const handlerSubmit = async () => {
    try {
      for (let i = 0; i < images.length; i++) {
        const data = await uploadCloudinary(images[i]);
        const updateData = { Image: data.url };
        console.log(updateData);
        const response = await makeAuthenticatedPOSTRequest(
          "/auth/update/profile",
          updateData
        );
        console.log(response);
        setUser(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" h-screen w-full flex sm:flex-col-reverse">
      <Nav />
      {show && (
        <div
          className=" absolute top-0 left-0 bg-black bg-opacity-25 h-full w-full flex items-center justify-center"
          onClick={() => {
            setShow(false);
          }}
        >
          <div
            className=" sm:h-[62%] sm:rounded-none sm:w-full relative rounded-md w-2/5 h-3/5 bg-[#EEF6FE] p-6 pt-10 flex flex-col justify-between"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <i
              className="ri-close-fill absolute right-3 cursor-pointer top-2 font-semibold text-3xl"
              onClick={() => {
                setShow(false);
              }}
            ></i>
            <div className="text-black font-medium text-2xl">
              Change Password
            </div>
            <div className="flex flex-col space-y-5">
              <input
                type="text"
                className="p-3 rounded-xl bg-white outline-none font-medium"
                placeholder="Current Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <input
                type="text"
                className="p-3 rounded-xl bg-white outline-none font-medium"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
              />
              <input
                type="text"
                className="p-3 rounded-xl bg-white outline-none font-medium"
                placeholder=" Re-Type New Password"
                value={cnfpassword}
                onChange={(e) => {
                  setCnfPassword(e.target.value);
                }}
              />
              <Link href="/forgot">
                <div className="text-[#0064E0] font-medium">
                  Forgot Password?
                </div>
              </Link>
            </div>
            <button
              className="bg-[#8EBBF1] rounded-3xl w-full py-2 sm:mb-5 text-white font-medium "
              onClick={resetPassword}
            >
              Change Password
            </button>
          </div>
        </div>
      )}

      <div className="w-12/13 sm:w-full h-full bg-black">
        <div className="h-full text-white flex items-center justify-between flex-col py-10 pb-20 px-9">
          <div className="flex items-center w-2/6 justify-between sm:w-full ">
            <img
              className=" h-14 w-14 rounded-full object-cover cursor-pointer"
              src={user.Image}
              alt=""
              onClick={selectBtn}
            />
            <input
              className="file hidden"
              type="file"
              onChange={(e) => {
                setImages(e.target.files);
              }}
            />
            <div className="flex flex-col gap-1 w-60">
              <h4 className="font-medium">{user.name}</h4>
              <h5 className="text-[#0065E1] cursor-pointer" onClick={selectBtn}>
                Change profile Photo
              </h5>
            </div>
          </div>

          <div className=" w-2/6 sm:w-full flex items-center justify-between">
            <label>Name</label>
            <input
              onChange={(e) => {
                setName(e.target.value);
              }}
              value={name}
              name="name"
              placeholder="Name"
              className=" w-60 bg-black text-white px-5 py-2 text-base border rounded-md outline-none"
              type="text"
            />
          </div>

          <div className="w-2/6 sm:w-full flex items-center justify-between">
            <label>UserName</label>
            <input
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              value={username}
              placeholder="Username"
              className=" w-60 bg-black text-white px-5 py-2 text-base border rounded-md outline-none"
              type="text"
            />
          </div>

          <div className="w-2/6 sm:w-full flex items-center justify-between">
            <label>Bio</label>
            <textarea
              name="bio"
              placeholder="Bio"
              className=" resize-none h-14 w-60 bg-black text-white px-5 py-2 text-base border rounded-md outline-none"
              onChange={(e) => {
                setBio(e.target.value);
              }}
              value={bio}
            >
              Bio
            </textarea>
          </div>

          <div className="w-2/6 sm:w-full flex items-center justify-between">
            <label>Email</label>
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              name="email"
              className=" w-60 bg-black text-white px-5 py-2 text-base border rounded-md outline-none"
              placeholder="Email"
              type="text"
            />
          </div>
          <div className="w-2/6 sm:w-full flex items-center justify-between">
            <div
              className="text-white no-underline text-xl"
              onClick={() => {
                setShow(true);
              }}
            >
              Change Password
            </div>
            <button
              className=" py-3 px-5 rounded-md bg-[#643FBD] border-none"
              onClick={(e) => {
                e.preventDefault();
                updateUser();
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
