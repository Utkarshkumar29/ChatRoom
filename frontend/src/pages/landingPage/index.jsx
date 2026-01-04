import React, { useState } from "react";
import Login from "../../components/login";
import SignUp from "../../components/signUp";
import StickyNavigationBar from "./components/StickyNavigationBar";

const LandingPage = () => {
  const [section, setSection] = useState("login");
  return (
    <div className=" bg-[#FAFBFC] min-h-screen flex items-center flex-col ">
      <StickyNavigationBar/>

      <main>
        
      </main>
    </div>
  );
};

export default LandingPage;