import React, { useState } from "react";
import Login from "../../components/login";
import SignUp from "../../components/signUp";
import StickyNavigationBar from "./components/StickyNavigationBar";
import HeroSection from "./components/HeroSection";

const LandingPage = () => {
  const [section, setSection] = useState("login");
  return (
    <div className=" bg-[#FAFBFC] min-h-screen flex items-center flex-col ">
      <StickyNavigationBar/>

      <main>
        <HeroSection/>
      </main>
    </div>
  );
};

export default LandingPage;