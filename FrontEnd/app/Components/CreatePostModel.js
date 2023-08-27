import React from "react";
import { useContext, useState } from "react";
import { UserContext } from "../Context/UserContext";
import { uploadCloudinary } from "@/utils/upload";
import { makeAuthenticatedPOSTRequest } from "@/utils/serverHelper";

const CreatePostModel = ({ closeModel }) => {
  const [user, setUser] = useContext(UserContext);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
    const selectBtn = () => {
    document.querySelector(".file").click();
  }
  const [images, setImages] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState([]);
  const handlerSubmit = async (e) => {
    e.preventDefault();
    closeModel();
    try {
      let arr = [];
      setLoading(true);
      for (let i = 0; i < images.length; i++) {
        const data = await uploadCloudinary(images[i]);
        arr.push(data);
        console.log(data);
      }
      setLoading(false);
      setLink(arr);
      console.log(arr[0].url);
      const post = arr[0].url;
      const public_id = arr[0].publicId;
      console.log(public_id)
      const postData = { text, post, public_id }
      
      const response = await makeAuthenticatedPOSTRequest('/post/create', postData);
      setUser(response.user);
      console.log(response);
      closeModel();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const onImageChange = (event) => {
    setShow(true);
  if (event.target.files && event.target.files[0]) {
   setImage(URL.createObjectURL(event.target.files[0]));
 }
}

  return (
    <div
      className=" z-20 top-0 left-0 absolute w-screen h-screen bg-black bg-opacity-40 text-white flex justify-center items-center sm:h-[90.9%] "
      onClick={closeModel}
    >
      <form
        className=" w-3/5 h-4/5 bg-white flex relative rounded-md overflow-hidden flex-col sm:h-full sm:rounded-none sm:w-full "
        onClick={(e) => {
          e.stopPropagation();
        }}
        onSubmit={handlerSubmit}
      >
        <div className=" h-[10%] flex items-center border-b justify-between py-1 px-3 text-xl font-medium">
          <i
            className="ri-arrow-left-line text-black text-3xl"
            onClick={closeModel}
          ></i>
          <h1 className="text-black">Create New Post</h1>
          <button type="submit" className="text-[#1877F2] cursor-pointer">
            Share
          </button>
        </div>
        <div className=" h-[90%] w-full flex sm:flex-col">
          {!show && (
            <div className=" w-3/5 h-full bg-white flex items-center justify-center flex-col sm:w-full">
              <svg
                className="bg-white"
                aria-label="Icon to represent media such as images or videos"
                color="rgb(0, 0, 0)"
                fill="rgb(0, 0, 0)"
                height="77"
                role="img"
                viewBox="0 0 97.6 77.3"
                width="96"
              >
                <title>Icon to represent media such as images or videos</title>
                <path
                  d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"
                  fill="currentColor"
                ></path>
                <path
                  d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"
                  fill="currentColor"
                ></path>
                <path
                  d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"
                  fill="currentColor"
                ></path>
              </svg>
              <h1
                className="bg-[#1877F2] cursor-pointer text-white text-base px-5 py-1 rounded-lg mt-5"
                onClick={selectBtn}
              >
                Select From Computer
              </h1>
              <input
                onChange={(e) => {
                  setImages(e.target.files);
                  onImageChange(e);
                }}
                className="file hidden"
                type="file"
                multiple={true}
              />
            </div>
          )}
          {show && (
            <div className="w-3/5 h-full sm:w-full">
              <img
                className="img h-full w-full object-contain"
                src={image}
                alt=""
              />
            </div>
          )}

          <div className=" sm:w-full w-2/5 h-full bg-white flex flex-col py-6 px-3 space-y-3 border-l-2 border-gray-100">
            <div className="flex items-center space-x-1">
              <img className="w-9 h-9 rounded-full" src={user.Image} alt="" />
              <h6 className=" text-base text-black font-medium">{user.name}</h6>
            </div>
            <input
              className=" outline-none border-none px-1 text-base text-black"
              onChange={(e) => {
                setText(e.target.value);
              }}
              value={text}
              type="text"
              placeholder="Write a caption..."
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePostModel;
