import StickyNavigationBar from "./components/StickyNavigationBar";
import HeroSection from "./components/HeroSection";
import SolutionPreview from "./components/SolutionPreview";
import ProblemSection from "./components/ProblemSection";
import React, { useState } from "react";import BenefitGrid from "./components/BenefitsGrid";
import LiveDemo from "./components/LiveDemo";
import TestimonialsCarousel from "./components/TestimonialsCarousel";
import ComparisonTable from "./components/ComparisonTable";
import PricingCalculator from "./components/PricingCalculato";
import SecuritySection from "./components/SecuritySection";
import FAQSection from "./components/FAQSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";


const LandingPage = () => {
  const [section, setSection] = useState("login");
  return (
    <div className=" bg-[#FAFBFC] min-h-screen flex items-center flex-col ">
      <StickyNavigationBar/>

      <main>
        <HeroSection/>
        <ProblemSection/>
        <SolutionPreview/>
        <BenefitGrid/>
        <LiveDemo/>
        <TestimonialsCarousel/>
        <ComparisonTable/>
        <PricingCalculator/>
        <SecuritySection/>
        <FAQSection/>
        <ContactSection/>
        <Footer/>
      </main>
    </div>
  );
};

export default LandingPage;