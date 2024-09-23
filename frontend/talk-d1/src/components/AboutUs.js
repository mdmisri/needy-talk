import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css'; // Assuming your CSS is in this file

const AboutUs = () => {
  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container">
        <Link to="/" className="logo">CareChat</Link>
          <div className="nav-links">
          <Link to="/about-us">About Us</Link>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-register">Register</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Banner Section */}
        <div className="banner" id="about">
          <h1 className="banner-text">About Us</h1>
          <p className="sub-text">
          <h3>We are dedicated to providing support and guidance in mental health through our platform.</h3>  
          </p>
        </div>
            
             {/* Contact Us Section */}
                <div className="contact-us-section" id="contact">
          <h1>Contact Us</h1>
          <h3>Email: carechat@gmail.com</h3>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 CareChat. All rights reserved.<strong>MSKUARE</strong></p>
      </footer>
    </div>
  );
};

export default AboutUs;
