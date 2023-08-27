import React, { useContext, useState } from "react";
import { makeAuthenticatedGETRequest, makeAuthenticatedPOSTRequest } from "@/utils/serverHelper";
import { UserContext } from "../Context/UserContext";
import Link from "next/link";
import PostDetails from "./PostDetails";
import { useRouter } from "next/navigation";

const More = ({ Post, setPostData, closeModel }) => {
  const router = useRouter();
  const [user, setUser] = useContext(UserContext);
  const [postOpen, setPostOpen] = useState(false);
  const unFollow = async (followId) => {
    const data = { followId };
    const response = await makeAuthenticatedPOSTRequest("/auth/unfollow", data);
    setUser(response.currentUser);
    closeModel();
  };
  const savePost = async (postId) => {
    const data = { postId };
    const response = await makeAuthenticatedPOSTRequest("/post/savepost", data);
    console.log(response);
    setUser(response);
  };
  const deletePost = async (postId) => {
    const response = await makeAuthenticatedGETRequest(
      `/post/delete/${postId}`
    );
    console.log(response);
  };
  return (
    <div
      className="w-full top-0 left-0 z-10 bg-opacity-30 h-full bg-black flex items-center justify-center absolute"
      onClick={() => closeModel()}
    >
      {postOpen && (
        <PostDetails
          closeModel={() => {
            setPostOpen(false);
          }}
          Post={Post}
          setPostData={setPostData}
        />
      )}
      <div
        className="font-medium w-1/3 sm:w-full bg-[#262626] text-white rounded-md overflow-hidden"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {Post.userid._id == user._id ? (
          <>
            <div
              className=" text-red-600 border-b-[0.3px] cursor-pointer border-[#dadada2c] text-center py-3 "
              onClick={() => {
                closeModel();
                deletePost(Post._id);
              }}
            >
              Delete
            </div>
            <div
              className="border-b-[0.3px] border-[#dadada2c] cursor-pointer text-center py-3 "
              onClick={() => {
                closeModel();
              }}
            >
              Edit
            </div>
            <div
              className="border-b-[0.3px] border-[#dadada2c] cursor-pointer text-center py-3"
              onClick={() => {
                closeModel();
              }}
            >
              Go To Post
            </div>
            <Link href="/profile">
              <div
                className="border-b-[0.3px] border-[#dadada2c] cursor-pointer text-center py-3"
                onClick={() => {
                  closeModel();
                }}
              >
                About This Account
              </div>
            </Link>
            <div
              className=" text-center py-3 cursor-pointer"
              onClick={() => {
                closeModel();
              }}
            >
              Cancel
            </div>
          </>
        ) : (
          <>
            <div
              className=" text-red-600 border-b-[0.3px] border-[#dadada2c] cursor-pointer text-center py-3 "
              onClick={() => {
                unFollow(Post.userid._id);
                closeModel();
              }}
            >
              Unfollow
            </div>
            <div
              className="border-b-[0.3px] cursor-pointer border-[#dadada2c] text-center py-3 "
              onClick={() => {
                savePost(Post._id);
                closeModel();
              }}
            >
              Save
            </div>
            <div
              className="border-b-[0.3px] cursor-pointer border-[#dadada2c] text-center py-3"
              onClick={() => {
                setPostOpen(true);
              }}
            >
              Go To Post
            </div>
            <Link href={`user/${Post.userid._id}`}>
              <div className="border-b-[0.3px] border-[#dadada2c] text-center py-3">
                About This Account
              </div>
            </Link>
            <div
              className=" text-center py-3 cursor-pointer"
              onClick={() => {
                closeModel();
              }}
            >
              Cancel
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default More;
