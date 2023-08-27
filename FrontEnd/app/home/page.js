"use client"
import React, { useEffect, useState, useContext } from "react";
import Nav from '../Shared/Nav';
import Link from "next/link";
import { makeAuthenticatedPOSTRequest } from '@/utils/serverHelper';
import "remixicon/fonts/remixicon.css";
import { makeAuthenticatedGETRequest } from '@/utils/serverHelper';
import { UserContext } from "../Context/UserContext";
import PostDetails from "../Components/PostDetails";
import More from "../Components/More";
import redirToSignInIfNoToken from "@/utils/auth";
const page = () => {
  redirToSignInIfNoToken();
  const [moreOpen, setMoreOpen] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [user, setUser] = useContext(UserContext);
  const [postData, setPostData] = useState([]);
  const [postOpen, setPostOpen] = useState(false);
  const [postDet, setPostDet] = useState([]);
  
  useEffect(() => {
    const getData = async() => {
      const response = await makeAuthenticatedGETRequest("/post/allpost");
      setPostData(response.posts);
    }
    getData();
  }, [user.following])

  const makeComment = async (text, postId) => {
    document.querySelector(".commentInput").value = '';
    const data = { text, postId }
    const response = await makeAuthenticatedPOSTRequest("/comment/create", data);
    console.log(response);
    const newData = postData.map((item) => {
      if (item._id == response._id) {
        return response;
      } else {
        return item;
      }
    });
    setPostData(newData);
  };

  const savePost = async (postId) => {
    const data = { postId };
    const response = await makeAuthenticatedPOSTRequest('/post/savepost', data);
    console.log(response);
    setUser(response)
  };

   const likePost = async (postId) => {
    const data = { postId }
    const response = await makeAuthenticatedPOSTRequest("/post/like", data);
    const newData = postData.map((item) => {
      if (item._id == response._id) {
        return response;
      } else {
        return item;
      }
    });
    setPostData(newData);
  };

   const unlikePost = async (postId) => {
     const data = { postId };
     const response = await makeAuthenticatedPOSTRequest("/post/unlike", data);
     const newData = postData.map((item) => {
       if (item._id == response._id) {
         return response;
       } else {
         return item;
       }
     });
     setPostData(newData);
  };
  
  const clickOnComment = () => {
    document.querySelector(".commentInput").focus();
  }
  return (
    <div className="h-screen w-full flex sm:h-screen sm:flex-col-reverse">
      <Nav postOpen={setPostOpen} />
      {moreOpen && (
        <More
          closeModel={() => {
            setMoreOpen(false);
          }}
          Post={postDet}
          setPostData={setPostDet}
        />
      )}
      {postOpen && (
        <PostDetails
          closeModel={() => {
            setPostOpen(false);
          }}
          Post={postDet}
          setPostData={setPostDet}
        />
      )}
      <div className=" pl-16 sm:pl-0 w-full h-full no-scrollbar bg-black overflow-auto ">
        {/* <div className=" w-1/2 py-6 space-x-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className=" h-16 w-16 rounded-full border border-[#DD02D8] inline-block"></div>
          <div className=" h-16 w-16 rounded-full border border-[#DD02D8] inline-block"></div>
          <div className=" h-16 w-16 rounded-full border border-[#DD02D8] inline-block"></div>
          <div className=" h-16 w-16 rounded-full border border-[#DD02D8] inline-block"></div>
          <div className=" h-16 w-16 rounded-full border border-[#DD02D8] inline-block"></div>
          <div className=" h-16 w-16 rounded-full border border-[#DD02D8] inline-block"></div>
          <div className=" h-16 w-16 rounded-full border border-[#DD02D8] inline-block"></div>
          <div className=" h-16 w-16 rounded-full border border-[#DD02D8] inline-block"></div>
        </div> */}
        <div className="text-white w-1/2 sm:w-full sm:px-0 pl-20">
          {postData.map((p, i) => {
            return (
              <div
                key={i}
                className="w-full relative py-4 border-b border-b-gray-200 border-opacity-20"
              >
                <div className="flex py-2 px-2 justify-between items-center">
                  <Link
                    href={
                      user._id != p.userid._id
                        ? `/user/${p.userid._id}`
                        : `/profile`
                    }
                  >
                    <div className="flex items-center space-x-1 cursor-pointer">
                      <img
                        className="h-9 w-9 rounded-full object-cover"
                        src={p.userid.Image}
                        alt=""
                      />
                      <h1 className=" font-medium ">{p.userid.name}</h1>
                    </div>
                  </Link>

                  <i
                    className="ri-more-fill font-medium text-2xl cursor-pointer"
                    onClick={() => {
                      setPostDet(p);
                      setMoreOpen(true);
                    }}
                  ></i>
                </div>
                <img src={p.post} alt="" />
                <div className="flex justify-between items-center text-2xl sm:px-2">
                  <div className="flex items-center  space-x-2">
                    <div>
                      {p.like.includes(user._id) ? (
                        <i
                          className="ri-heart-3-fill text-[#FF3040] cursor-pointer "
                          onClick={() => {
                            unlikePost(p._id);
                          }}
                        ></i>
                      ) : (
                        <i
                          className="ri-heart-3-line cursor-pointer "
                          onClick={() => {
                            likePost(p._id);
                          }}
                        ></i>
                      )}
                    </div>
                    <i
                      className="ri-chat-3-line cursor-pointer "
                      onClick={clickOnComment}
                    ></i>

                    <i className="ri-send-plane-fill cursor-pointer "></i>
                  </div>
                  {user.savedPost.includes(p._id) ? (
                    <i
                      className="ri-bookmark-fill cursor-pointer"
                      onClick={() => {
                        savePost(p._id);
                      }}
                    ></i>
                  ) : (
                    <i
                      className="ri-bookmark-line cursor-pointer"
                      onClick={() => {
                        savePost(p._id);
                      }}
                    ></i>
                  )}
                </div>
                {p.like.length !== 0 && (
                  <div className="font-medium pt-1 sm:px-2">
                    Liked by {p.like.length}
                  </div>
                )}
                <div className="font-normal pb-1 cursor-pointer sm:px-2">
                  {p.text}
                </div>
                {p.comment.length == 1 && (
                  <div
                    className=" font-normal cursor-pointer sm:px-2"
                    onClick={() => {
                      setPostDet(p);
                      setPostOpen(true);
                    }}
                  >
                    View {p.comment.length} Comment
                  </div>
                )}
                {p.comment.length > 2 && (
                  <div
                    className=" font-normal sm:px-2"
                    onClick={() => {
                      setPostDet(p);
                      setPostOpen(true);
                    }}
                  >
                    View All {p.comment.length} Comment
                  </div>
                )}
                <div className="flex sm:px-2 justify-between w-full bg-black rounded mt-2">
                  <form
                    className="w-full flex justify-between "
                    onSubmit={(e) => {
                      e.preventDefault();
                      makeComment(e.target[0].value, p._id);
                    }}
                  >
                    <input
                      placeholder="Add a comment..."
                      onChange={(e) => {
                        if (e.target.value == 0) {
                          setShowBtn(false);
                        } else {
                          setShowBtn(true);
                        }
                      }}
                      className=" w-5/6 outline-none border-none text-white  bg-black py-1 rounded font-normal commentInput"
                    />
                    {showBtn && (
                      <button className="w-1/6 text-blue-600 font-medium py-1">
                        Post
                      </button>
                    )}
                  </form>
                </div>
                {/* <div>
                    {p.comment.map((c, i) => {
                      return (
                        <div>
                          <h1 key={c.text}>{c.text}</h1>
                          <div className="pl-5 border  border-l-black ml-5">
                            {c.reply.map((r, i) => (
                              <div>
                                <h1 key={i}>{r.text}</h1>
                                <div>
                                  {r.replyReplyId.map((rr, i) => (
                                    <h1 key={i}>{rr.text}</h1>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div> */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default page;
