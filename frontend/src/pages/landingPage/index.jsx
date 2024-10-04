import React, { useState } from "react";
import Login from "../../components/login";
import SignUp from "../../components/signUp";

const LandingPage = () => {
  const [section, setSection] = useState("login");
  return (
    <div className="bg-white w-[full] h-[100vh] justify-center items-center px-[100px] py-[100px] flex ">
      <div className=" border boder-[#D7D7D8] flex rounded-3xl ">
        {section == "login" && (
          <>
            <Login />
            <div className={` transition-all duration-500 ease-in-out transform ${
        section === "login" ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      } p-[60px] gap-[12px] rounded-l-[150px] text-center text-white flex flex-col justify-center items-center bg-[#1660CD] `}>
              <h1 className=" whitespace-nowrap  text-[32px] font-semibold  ">
                Hello, Subscriber!
              </h1>
              <p>
                Register with your personal details to use all of site features.
              </p>
              <button
                className=" text-[14px] leading-[21px] border border-[#1660CD] bg-white text-[#1660CD] rounded-xl py-[16px] px-[24px] max-h-[44px] flex justify-center items-center "
                id="register"
                onClick={()=>setSection("sign")}
              >
                Sign Up
              </button>
            </div>
          </>
        )}
        {section == "sign" && (
            <>
             <div className={`transition-all duration-500 ease-in-out transform ${
        section === "sign" ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      } p-[60px] gap-[12px] rounded-r-[150px] text-center text-white flex flex-col justify-center items-center bg-[#1660CD]`}>
              <h1 className=" whitespace-nowrap  text-[32px] font-semibold  ">
                Hello, Subscriber!
              </h1>
              <p>
                Register with your personal details to use all of site features.
              </p>
              <button
                className=" text-[14px] leading-[21px] border border-[#1660CD] bg-white text-[#1660CD] rounded-xl py-[16px] px-[24px] max-h-[44px] flex justify-center items-center "
                id="register"
                onClick={()=>setSection("login")}
              >
                Sign In
              </button>
            </div>
            <SignUp/>
               
            </>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
