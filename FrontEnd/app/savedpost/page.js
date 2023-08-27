"use client";
import Nav from "../Shared/Nav";
import "remixicon/fonts/remixicon.css";
import { UserContext } from "../Context/UserContext";
import { useContext, useState, useEffect } from "react";
import {
  makeAuthenticatedGETRequest,
  makeAuthenticatedPOSTRequest,
} from "@/utils/serverHelper";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PostDetails from "../Components/PostDetails";
import { uploadCloudinary } from "@/utils/upload";
import Showfollower from "../Components/Showfollower";
import redirToSignInIfNoToken from "@/utils/auth";
const page = () => {
  redirToSignInIfNoToken();
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [ShowFollow, setShowFollow] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    handlerSubmit();
  }, [images]);
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
        setUser(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const selectBtn = () => {
    document.querySelector(".file").click();
  };
  console.log(data);
  const [postOpen, setPostOpen] = useState(false);
  const [postDet, setPostDet] = useState([]);
  const [user, setUser] = useContext(UserContext);
  const [postData, setPostData] = useState([]);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const getData = async () => {
      const response = await makeAuthenticatedGETRequest("/post/mypost");
      setPostData(response.posts);
    };
    getData();
  }, [user]);

  return (
    <div className="h-screen w-full flex sm:flex-col-reverse">
      <Nav postOpen={setPostOpen} />
      {postOpen && (
        <PostDetails
          closeModel={() => {
            setPostOpen(false);
          }}
          Post={postDet}
          setPostData={setPostDet}
        />
      )}
      {show && (
        <div
          className=" h-full absolute bottom-0 left-0 text-white bg-black bg-opacity-10 z-20 w-full"
          onClick={() => {
            setShow(false);
          }}
        >
          <div
            className=" flex flex-col items-center bg-[#262626] w-full absolute bottom-0 left-0 text-2xl font-medium"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className=" h-full text-3xl space-y-8 py-20">
              <div>
                <Link
                  href="/edit"
                  className=" flex items-center space-x-3 cursor-pointer"
                >
                  <i className="ri-settings-2-fill"></i>

                  <h1>Settings</h1>
                </Link>
              </div>

              <div>
                <Link
                  href="/savedpost"
                  className=" flex items-center space-x-3 cursor-pointer"
                >
                  <i className="ri-bookmark-line"></i>
                  <h1>Saved</h1>
                </Link>
              </div>

              <div className=" flex items-center space-x-3 cursor-pointer">
                <i className="ri-logout-circle-line"></i>
                <h1
                  onClick={() => {
                    localStorage.clear();
                    router.push("/login");
                  }}
                >
                  LogOut
                </h1>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className=" w-12/13 h-full bg-black overflow-auto sm:w-full sm:h-[90%]">
        <div className="flex pl-40 items-center gap-14 w-full sm:px-5 py-5 sm:flex-col sm:gap-0 sm:items-start">
          {ShowFollow && (
            <Showfollower
              closeModel={() => {
                setShowFollow(false);
              }}
              data={data}
            />
          )}
          <div className="w-full font-medium text-white pb-2 sm:flex hidden justify-between items-center">
            <div>{user.username}</div>
            <div className="flex items-center space-x-3 text-3xl">
              <div>
                <i
                  className="ri-menu-line cursor-pointer"
                  onClick={() => {
                    setShow(true);
                  }}
                ></i>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center w-full justify-between">
            <div
              className=" h-24 w-24 rounded-full overflow-hidden"
              onClick={selectBtn}
            >
              <img
                className="h-full w-full object-cover cursor-pointer"
                src={user.Image}
                alt="Profile"
              />
              <input
                className="file"
                type="file"
                onChange={(e) => {
                  setImages(e.target.files);
                }}
              />
            </div>
            <div className="flex items-center gap-5 text-white font-medium">
              <h4 className="flex flex-col items-center">
                <span>{user.posts.length}</span> Posts
              </h4>
              <div className="flex flex-col items-center cursor-pointer">
                <span>{user.follower.length}</span>
                Followers
              </div>
              <div className="flex flex-col items-center cursor-pointer">
                <span>{user.following.length}</span> Following
              </div>
            </div>
          </div>
          <div className="text-white w-2/3 mt-2 sm:flex sm:flex-col hidden ">
            <div>{user.name}</div>
            <div className=" max-h-15">{user.bio}</div>
          </div>
          <Link
            href="/edit"
            className="bg-gray-100 text-black font-medium w-full text-center py-1 rounded-md mt-4 hidden sm:flex justify-center"
          >
            Edit Profile{" "}
          </Link>
          <div
            className=" h-40 w-40 rounded-full overflow-hidden sm:hidden"
            onClick={selectBtn}
          >
            <img
              className="h-full w-full object-cover cursor-pointer"
              src={user.Image}
              alt="Profile"
            />
            <input
              className="file"
              type="file"
              onChange={(e) => {
                setImages(e.target.files);
              }}
            />
          </div>
          <div className="flex items-right h-full ml-10 pt-10 gap-3 text-white flex-col justify-center sm:hidden">
            <div className="flex items-center gap-12 sm:hidden">
              <h3>{user.username}</h3>
              <div className="flex items-center gap-4">
                <Link href="/edit">
                  <button className="px-4 py-1 rounded-lg text-black font-medium border-none bg-gray-200">
                    Edit Profile
                  </button>
                </Link>
                <div className="font-medium text-white text-2xl">
                  <i className="ri-settings-2-fill"></i>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-white font-medium">
              <h4>
                <span>{user.posts.length}</span> Posts
              </h4>
              <h4>
                <span>{user.follower.length}</span> Followers
              </h4>
              <h4>
                <span>{user.following.length}</span> Following
              </h4>
            </div>
            <div className=" overflow-hidden h-32 w-44 text-white text-left sm:hidden">
              <span className="font-medium text-base">{user.name}</span>
              <br />
              <h3 className="text-sm font-thin">{user.bio}</h3>
            </div>
          </div>
        </div>
        <div className="relative w-full h-2/3 px-24 sm:px-0">
          <div className="text-center text-white bg-black flex gap-14 items-center justify-center border-t">
            <Link href="/profile" className=" h-full p-4">
              POSTS
            </Link>
            <Link href="/savedpost" className=" border-t h-full p-4">
              SAVED
            </Link>
          </div>

          <div className="w-full grid grid-cols-3 gap-[3px] ">
            {user.savedPost.map((p, i) => {
              return (
                <div
                  key={i}
                  className=" overflow-hidden w-[31] h-[30]"
                  onClick={() => {
                    setPostDet(p);
                    setPostOpen(true);
                  }}
                >
                  <img
                    className="h-full w-full object-cover cursor-pointer"
                    src={p.post}
                    alt="Image"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
