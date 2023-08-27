
"use client";
import Nav from "@/app/Shared/Nav";
import "remixicon/fonts/remixicon.css";
import { UserContext } from "@/app/Context/UserContext";
import { useContext, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { makeAuthenticatedGETRequest, makeAuthenticatedPOSTRequest } from "@/utils/serverHelper";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PostDetails from "@/app/Components/PostDetails";
const page = () => {
  const [postOpen, setPostOpen] = useState(false);
  const [user, setUser] = useContext(UserContext);
  const router = useRouter();
  const [postUser, setPostUser] = useState();
  const [postData, setPostData] = useState([]);
  const params = useParams();
  const [postDet, setPostDet] = useState([]);
  const userId = params.id;
  useEffect(() => {
    const getData = async () => {
      const response = await makeAuthenticatedGETRequest("/post/user/"+userId);
      setPostData(response.post);
      setPostUser(response.user);
    };
    getData();
  }, []);

  const follow = async (followId) => {
    const data = {followId }
    const response = await makeAuthenticatedPOSTRequest('/auth/follow', data);
    console.log(response);
    setUser(response.currentUser);
    setPostUser(response.followedUser);
  };
  const unFollow = async (followId) => {
    const data = { followId };
    const response = await makeAuthenticatedPOSTRequest("/auth/unfollow", data);
    console.log(response);
    setUser(response.currentUser);
    setPostUser(response.followedUser);
  };


  
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
      <div className=" w-12/13 h-full bg-black no-scrollbar overflow-auto sm:w-full sm:h-[90%]">
        <div className="flex pl-40 items-center gap-14 w-full sm:px-5 py-5 sm:flex-col sm:gap-0 sm:items-start">
          <div className="w-full font-medium text-white pb-2 sm:flex hidden justify-between items-center">
            <div>{postUser?.username}</div>
          </div>
          <div className="hidden sm:flex items-center w-full justify-between">
            <div className=" h-24 w-24 rounded-full overflow-hidden">
              <img
                className="h-full w-full object-cover cursor-pointer"
                src={postUser?.Image}
                alt="Profile"
              />
            </div>
            <div className="flex items-center gap-5 text-white font-medium">
              <h4 className="flex flex-col items-center">
                <span>{postUser?.posts.length}</span> Posts
              </h4>
              <h4 className="flex flex-col items-center">
                <span>{postUser?.follower.length}</span> Followers
              </h4>
              <h4 className="flex flex-col items-center">
                <span>{postUser?.following.length}</span> Following
              </h4>
            </div>
          </div>
          <div className="text-white w-2/3 mt-2 sm:flex sm:flex-col hidden ">
            <div>{postUser?.name}</div>
            <div className=" max-h-15">{postUser?.bio}</div>
          </div>
          {user.following.includes(postUser?._id) ? (
            <button
              className="bg-[#DBDBDB] text-black font-medium w-full text-center py-1 rounded-md mt-4 hidden sm:flex justify-center"
              onClick={() => {
                unFollow(postUser?._id);
              }}
            >
              Following
            </button>
          ) : (
            <button
              className="bg-[#1877F2] text-white font-medium w-full text-center py-1 rounded-md mt-4 hidden sm:flex justify-center"
              onClick={() => {
                follow(postUser?._id);
              }}
            >
              Follow
            </button>
          )}
          {/*  */}
          <div className=" h-40 w-40 rounded-full overflow-hidden sm:hidden">
            <img
              className="h-full w-full object-cover cursor-pointer"
              src={user.Image}
              alt="Profile"
            />
          </div>
          <div className="flex items-right h-full ml-10 pt-10 gap-3 text-white flex-col justify-center sm:hidden">
            <div className="flex items-center gap-12 sm:hidden">
              <h3>{user.username}</h3>
              <div className="flex items-center gap-4">
                {user.following.includes(postUser?._id) ? (
                  <button
                    className="px-10 py-1 bg-[#DBDBDB] text-black rounded-lg  font-medium border-none"
                    onClick={() => {
                      unFollow(postUser?._id);
                    }}
                  >
                    Following
                  </button>
                ) : (
                  <button
                    className="px-10 py-1 rounded-lg bg-[#1877F2] text-white  font-medium border-none"
                    onClick={() => {
                      follow(postUser?._id);
                    }}
                  >
                    Follow
                  </button>
                )}
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
            <span className=" border-t h-full p-4">POSTS</span>
          </div>

          <div className="w-full grid grid-cols-3 gap-[3px] ">
            {postData.map((p, i) => {
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
}

export default page;
