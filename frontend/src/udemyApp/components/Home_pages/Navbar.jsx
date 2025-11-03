import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="apical-navbar">
      <div className="nav-left">
        <h2 className="nav-logo">Apical Soft</h2>
      </div>

      <div className="nav-center">
        <input
          type="text"
          className="search-bar"
          placeholder="Search for anything"
        />
      </div>

      <div className="nav-right">
        <a href="#pricing">Plans & Pricing</a>
        <a href="#business">Apical Business</a>
        <a href="#teach">Teach on Apical</a>
        <Link to="/login" className="login-btn">
          Log in
        </Link>
        <Link to="/signup" className="signup-btn">
          Sign up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
