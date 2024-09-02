import { createContext, useState } from "react";

const UserContext=createContext()

const UserContextProvider =({children})=>{
    const [user,setUser]=useState()
    const [token,setToken]=useState()
    return(
        <UserContext.Provider value={{user,setUser,token,setToken}}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserContextProvider };