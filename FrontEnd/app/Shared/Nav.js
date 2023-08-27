'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import "remixicon/fonts/remixicon.css";
import CreatePostModel from '../Components/CreatePostModel';
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "../Context/UserContext";
import Search from '../Components/Search';

const Nav = ({postOpen}) => {
  const router = useRouter();
  const [createPostModelOpen, setCreatePostModelOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [user, setUser] = useContext(UserContext);
  const [searchOpen, setSearchOpen] = useState(false);
  
    return (
      <div className=" py-20 text-3xl text-white flex flex-col justify-between items-center w-1/13 border-r border-gray-600 bg-black h-screen sm:h-[10%] sm:w-full sm:py-0">
        {createPostModelOpen && (
          <CreatePostModel
            closeModel={() => {
              setCreatePostModelOpen(false);
            }}
          />
        )}
        {searchOpen && <Search />}
        <i className="ri-instagram-line cursor-pointer sm:hidden"></i>
        <div className="flex gap-7 items-center flex-col text-white sm:flex-row sm:bg-black sm:w-full sm:h-full sm:justify-between sm:px-6 sm:items-center">
          <Link className="text-white m-0 p-0" href="/home">
            <i
              className="ri-home-5-line"
              onClick={() => {
                setCreatePostModelOpen(false);
                setSearchOpen(false);
                if (postOpen) {
                  postOpen(false)
                }
              }}
            ></i>
          </Link>
          <i
            className="ri-search-line cursor-pointer"
            onClick={() => {
              setCreatePostModelOpen(false);
              if (postOpen) {
                postOpen(false);
              }
              if (searchOpen) {
                setSearchOpen(false);
              } else {
                setSearchOpen(true);
              }
            }}
          ></i>
          {/* <Link href="/chat">
            <i
              className="ri-messenger-line"
              onClick={() => {
                if (postOpen) {
                  postOpen(false);
                }
                setCreatePostModelOpen(false);
                searchOpen(false);
              }}
            ></i>
          </Link> */}
          <i
            className="ri-add-circle-line cursor-pointer"
            onClick={() => {
              if (postOpen) {
                postOpen(false);
              }
              setSearchOpen(false);
              setCreatePostModelOpen(true);
            }}
          ></i>
          <Link
            href="/profile"
            onClick={() => {
              if (postOpen) {
                postOpen(false);
              }
              setCreatePostModelOpen(false);
              setSearchOpen(false);
            }}
          >
            <img
              className="h-7 w-7 rounded-full object-cover"
              src={user.Image}
              alt=""
            />
          </Link>
        </div>
        <i
          className="ri-menu-line cursor-pointer sm:hidden"
          onClick={() => {
            if (moreOpen) {
              setMoreOpen(false);
            } else {
              setMoreOpen(true);
            }
          }}
        ></i>
        {moreOpen && (
          <div className=" sm:hidden text-lg bg-[#262626] absolute bottom-20 left-16 shadow-sm rounded-md px-4 py-6 space-y-4 pr-16 pl-6 z-10">
            <div className=" flex flex-col gap-5 pb-5">
              <div className=" flex items-center space-x-3 cursor-pointer">
                <i className="ri-settings-2-fill"></i>
                <Link href="/edit">
                  <h1>Settings</h1>
                </Link>
              </div>
              <Link href="/savedpost">
                <div className=" flex items-center space-x-3 cursor-pointer">
                  <i className="ri-bookmark-line"></i>
                  <h1>Saved</h1>
                </div>
              </Link>
            </div>
            <div
              className=" cursor-pointer px-1"
              onClick={() => {
                localStorage.clear();
                router.push("/login");
              }}
            >
              LogOut
            </div>
          </div>
        )}
      </div>
    );
}

export default Nav;
