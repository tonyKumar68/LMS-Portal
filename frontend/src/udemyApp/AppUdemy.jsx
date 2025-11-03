import React from "react";
import Navbar from "./components/Home_pages/Navbar";
import HeroSection from "./components/Home_pages/HeroSection";
import SkillsSection from "./components/Home_pages/SkillsSection";
import "./App.css"; // optional — if you had Udemy styles

function AppUdemy() {
  return (
    <div className="udemy-app">
      <Navbar />
      <HeroSection />
      <SkillsSection />
    </div>
  );
}

export default AppUdemy;
