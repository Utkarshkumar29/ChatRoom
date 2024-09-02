import React, { useState } from "react";
import Login from "../../components/login";
import SignUp from "../../components/signUp";

const LandingPage=()=>{
    return(
        <div className=" bg-teal-700 w-[full] h-[100vh] justify-center items-center px-[100px] py-[100px] flex ">
            <Login/>
            <SignUp/>
        </div>
    )
}

export default LandingPage