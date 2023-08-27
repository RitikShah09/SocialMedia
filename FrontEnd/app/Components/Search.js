import React, { useState , useContext} from 'react'
import Link from 'next/link';
import { UserContext } from "../Context/UserContext";
import { makeUnauthenticatedPOSTRequest } from '@/utils/serverHelper';
const Search = () => {
  const [user, setUser] = useContext(UserContext);
    const [data, setData] = useState([]);
    const searchUser = async (search) => {
        const data = {search};
        console.log(data.search.trim().length);
        const response = await makeUnauthenticatedPOSTRequest("/auth/search", data);
      setData(response);
      if (data.search.length == 0) {
        setData([]);
      }
    }
  return (
    <div className=" w-1/3 z-10 h-screen top-0 left-[6%] bg-black absolute flex flex-col sm:w-full sm:h-[90.9%] sm:left-0 sm:top-0">
      <div className=" w-full flex flex-col space-y-8 py-7 border-b px-10 border-gray-800 ">
        <h6 className=' font-medium text-2xl'>Search</h6>
              <input
                  onChange={(e)=>{searchUser(e.target.value)}}
            type="text"
            placeholder="Search"
            className="w-full sm:py-3 sm:text-xl font-medium rounded-lg bg-[#262626] text-xl py-1 px-2"
          />
      
      </div>
          <div className=" overflow-auto">
              {
                  data.map((u, i) => {
                      return (
                        <Link
                          href={
                            user._id != u._id ? `/user/${u._id}` : `/profile`
                          }
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
                })
              }
        
      </div>
    </div>
  );
}

export default Search
