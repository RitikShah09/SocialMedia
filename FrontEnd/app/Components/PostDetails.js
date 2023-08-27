import React, { useContext, useEffect, useState } from "react";
import "remixicon/fonts/remixicon.css";
import { UserContext } from "../Context/UserContext";
import { makeAuthenticatedPOSTRequest } from "@/utils/serverHelper";
import More from "./More";
const PostDetails = ({ closeModel, Post, setPostData }) => {
  const [user, setUser] = useContext(UserContext);
  const [moreOpen, setMoreOpen] = useState(false);
  const [postDet, setPostDet] = useState([]);
   const makeComment = async (text, postId) => {
     const data = { text, postId };
     const response = await makeAuthenticatedPOSTRequest("/comment/create", data);
     document.querySelector(".comment").value = '';
     setPostData(response);
     console.log(response);
  };
  const savePost = async (postId) => {
    const data = { postId };
    const response = await makeAuthenticatedPOSTRequest("/post/savepost", data);
    console.log(response);
    setUser(response);
  };

   const likePost = async (postId) => {
     const data = { postId };
     const response = await makeAuthenticatedPOSTRequest("/post/like", data);
     console.log(response);
     setPostData(response)
   };

   const unlikePost = async (postId) => {
     const data = { postId };
     const response = await makeAuthenticatedPOSTRequest("/post/unlike", data);
     setPostData(response);
  };

  useEffect(() => {
    
  },[Post.comment])
  
    return (
      <div
        className="sm:h-[90.9%] h-full absolute top-0 left-0 w-full bg-black text-white bg-opacity-60 flex items-center justify-center z-20"
        onClick={() => {
          closeModel();
        }}
      >
        <i
          className="ri-close-line absolute top-3 right-4 text-white text-3xl sm:hidden cursor-pointer"
          onClick={() => {
            closeModel();
          }}
        ></i>
        <div
          className=" h-[90%] sm:w-full sm:h-full w-4/5 sm:flex-col flex bg-black rounded-md  overflow-hidden"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {moreOpen && (
            <More
              closeModel={() => {
                setMoreOpen(false);
              }}
              Post={postDet}
              setPostData={setPostDet}
              close={closeModel}
            />
          )}
          <div className=" w-1/2 sm:flex sm:flex-col  sm:w-full h-full">
            <div className=" py-3 text-xl hidden sm:flex items-center h-[10%] px-2 justify-between border-b  border-[#dadada4d]">
              <div className="flex items-center space-x-2">
                <img
                  className="h-9 w-9 object-cover rounded-full"
                  src={Post.userid.Image}
                  alt=""
                />
                <div>{Post.userid.name}</div>
              </div>
              <i
                className="ri-more-fill font-medium text-2xl cursor-pointer"
                onClick={() => {
                  setPostDet(Post);
                  setMoreOpen(true);
                }}
              ></i>
            </div>
            <img
              className=" h-full w-full object-contain"
              src={Post.post}
              alt=""
            />
          </div>
          <div className=" w-1/2 sm:w-full  h-full flex flex-col relative border-l  border-[#dadada4d]">
            <div className="flex items-center sm:hidden h-[10%] px-2 justify-between border-b  border-[#dadada4d]">
              <div className="flex items-center space-x-2">
                <img
                  className="h-9 w-9 object-cover rounded-full"
                  src={Post.userid.Image}
                  alt=""
                />
                <div>{Post.userid.name}</div>
              </div>
              <i
                className="ri-more-fill font-medium text-2xl cursor-pointer"
                onClick={() => {
                  setPostDet(Post);
                  setMoreOpen(true);
                }}
              ></i>
            </div>
            <div className="flex sm:hidden flex-col px-2 h-[65%] border-b no-scrollbar border-[#dadada4d] overflow-auto">
              {Post.comment.map((c, i) => {
                return (
                  <div key={i}>
                    <div className="flex items-center space-x-2 py-2">
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={c?.userid?.Image}
                        alt=""
                      />
                      <div className="flex items-center space-x-2">
                        <div className="font-medium">{c?.userid?.name}</div>
                        <div>{c.text}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col h-[25%] ">
              <div className="flex justify-between items-center text-2xl py-2 px-2">
                <div className="flex items-center  space-x-2">
                  <div>
                    {Post.like.includes(user._id) ? (
                      <i
                        className="ri-heart-3-fill text-[#FF3040] cursor-pointer "
                        onClick={() => {
                          unlikePost(Post._id);
                        }}
                      ></i>
                    ) : (
                      <i
                        className="ri-heart-3-line cursor-pointer "
                        onClick={() => {
                          likePost(Post._id);
                        }}
                      ></i>
                    )}
                  </div>

                  <i className="ri-chat-3-line cursor-pointer "></i>

                  <i className="ri-send-plane-fill cursor-pointer "></i>
                </div>
                {user.savedPost.includes(Post._id) ? (
                  <i
                    className="ri-bookmark-line cursor-pointer"
                    onClick={() => {
                      savePost(Post._id);
                    }}
                  ></i>
                ) : (
                  <i
                    className="ri-bookmark-fill cursor-pointer"
                    onClick={() => {
                      savePost(Post._id);
                    }}
                  ></i>
                )}
              </div>
              {Post.like.length === 1 && (
                <div className="font-medium pb-3 px-2">
                  {Post.like.length} Like
                </div>
              )}
              {Post.like.length > 1 && (
                <div className="font-medium pb-3 px-2">
                  {Post.like.length} Likes
                </div>
              )}
              {Post.comment.length == 1 && (
                <div className=" font-normal pb-3 px-2 sm:pb-0 cursor-pointer sm:px-2">
                  View {Post.comment.length} Comment
                </div>
              )}
              {Post.comment.length > 2 && (
                <div className=" font-normal pb-3 sm:p-0 px-2 sm:px-2">
                  View All {Post.comment.length} Comment
                </div>
              )}
              <div className="border-t sm:mt-2  border-[#dadada4d]">
                <form
                  className="w-full flex justify-between "
                  onSubmit={(e) => {
                    e.preventDefault();
                    makeComment(e.target[0].value, Post._id);
                  }}
                >
                  <input
                    placeholder="Add a comment..."
                    className=" comment w-full outline-none border-none text-white  bg-black py-1 px-2 rounded font-normal commentInput"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default PostDetails;
