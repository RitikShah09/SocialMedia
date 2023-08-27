'use client'
import React, { useState } from 'react';
import { uploadCloudinary } from '@/utils/upload';

const upload = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
    const [link, setLink] = useState([]);
    const handlerSubmit = async (e) => {
        e.preventDefault();
       try {
         let arr = []
         setLoading(true)
         for (let i = 0; i < images.length; i++){
           const data = await uploadCloudinary(images[i])
           arr.push(data)
         }
         setLoading(false)
         setLink(arr)
       } catch (error) {
         setLoading(false);
        console.log(error);
       }
}
  return (
    <div>
          <form onSubmit={handlerSubmit} >
              <input
                  multiple={true}
                  onChange={(e)=>setImages(e.target.files)}
                  type="file" />
        <button disabled={loading} type='submit'>{ loading ? "loading...1" : "Upload!"}</button>
      </form>
      {
        link && link.length > 0 && link.map(link => {
          return (
            <div key={link.publicId}>
              <p>publicId : {link?.publicId}</p>
              <p>url : {link?.url}</p>
              <img className=' w-80' src={link?.url} alt="" />
            </div>
          );
        })
      }
    </div>
  )
}

export default upload
