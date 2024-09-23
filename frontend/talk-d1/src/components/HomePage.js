import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const words = ['"breakup?"', '"breakdown?"', '"hurt?"', '"lonely?"', '"suicidal thoughts?"'];
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prevWord) => (prevWord + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="homepage">
      <header className="navbar">
        <div className="container">
        <Link to="/" className="logo">CareChat</Link>
          <nav className="nav-links">
            <Link to="/about-us">About Us</Link>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-register">Register</Link>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <section className="banner">
          <h1 className="banner-text">
            Are you going through <span className="highlighted-text">{words[currentWord]}</span>
          </h1>
          <p className="sub-text">You're not alone. We're here to help.🙋‍♀️</p>
        </section>

        <section className="features">
            <h1 className='feature-heading'>Features</h1>
          <div className="container">
            <div className="feature">
              <h2>end-to-end encryption🔒</h2>
              <p>your texts are safe!</p>
            </div>
            <div className="feature">
              <h2>Professional Counselors</h2>
              <p>Experienced and caring professionals</p>
            </div>
            <div className="feature">
              <h2>Free</h2>
              <p>It's Free !</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Logo. All rights reserved. <strong>MSKUARE</strong></p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;