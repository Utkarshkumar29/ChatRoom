import React, { useState } from "react";
import Login from "../../components/login";
import SignUp from "../../components/signUp";

const LandingPage=()=>{
    return(
        <div className="bg-white w-[full] h-[100vh] justify-center items-center px-[100px] py-[100px] flex ">
            <div className=" border boder-[#D7D7D8] ">
            <Login/>
            <SignUp/>
            </div>
        </div>
    )
}

export default LandingPage