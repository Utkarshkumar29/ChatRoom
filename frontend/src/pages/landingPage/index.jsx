import StickyNavigationBar from "./components/StickyNavigationBar";
import HeroSection from "./components/HeroSection";
import SolutionPreview from "./components/SolutionPreview";
import ProblemSection from "./components/ProblemSection";
import React, { useState } from "react";;

const LandingPage = () => {
  const [section, setSection] = useState("login");
  return (
    <div className=" bg-[#FAFBFC] min-h-screen flex items-center flex-col ">
      <StickyNavigationBar/>

      <main>
        <HeroSection/>
        <ProblemSection/>
        <SolutionPreview/>
      </main>
    </div>
  );
};

export default LandingPage;