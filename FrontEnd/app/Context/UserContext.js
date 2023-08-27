"use client";

import { createContext, useEffect, useState, } from "react";

export const UserContext = createContext({});


export default function UserProvider({ children }) {

    const getLocalData = () => {
        let userData = localStorage.getItem("UserDetails");
        if (userData === {}) {
            return {}
        }
        else {
            return JSON.parse(userData);
        }
    };

    const initialState = getLocalData();

    const [user, setUser] = useState(initialState);
    useEffect(() => {
      localStorage.setItem("UserDetails", JSON.stringify(user));
    }, [user]);
    
     return (
         <UserContext.Provider value={[user, setUser]}>{children}</UserContext.Provider>
     );
};