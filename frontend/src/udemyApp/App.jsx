import React from "react";
import Navbar from "./components/Home_pages/Navbar";
import HeroSection from "./components/Home_pages/HeroSection";
import SkillsSection from "./components/Home_pages/SkillsSection";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <HeroSection />
      <SkillsSection />
    </div>
  );
}

export default App;
