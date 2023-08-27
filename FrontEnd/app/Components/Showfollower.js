import React,{useState, useContext} from 'react'
import { UserContext } from "../Context/UserContext";
const Showfollower = ({ data }) => {
  const [user, setUser] = useContext(UserContext);
  console.log(data);
  return (
    <div className=" h-screen w-screen top-0 left-0 absolute z-20 bg-black bg-opacity-20">
      <div className=" overflow-auto">
        {/* {data.map((u, i) => {
          return (
            <Link
              href={user._id != u._id ? `/user/${u._id}` : `/profile`}
              key={i}
            >
              <div className=" flex items-center mt-2 px-10 space-x-2 py-1 hover:bg-[#161616c4]">
                <img
                  src={u.Image}
                  className="h-12 w-12 rounded-full bg-slate-600 object-cover"
                  alt=""
                />
                <div className=" text-lg">{u.username}</div>
              </div>
            </Link>
          );
        })} */}
      </div>
    </div>
  );
}

export default Showfollower
