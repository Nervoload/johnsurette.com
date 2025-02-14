// src/components/navbar/NavBar.jsx
import React, { useState, useEffect } from 'react';
import './nav-Bar.css';

const NavBar = ({ animationType = 'glow', isHidden }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Handler to check if mouse is near the top 10% of the viewport.
    const handleMouseMove = (e) => {
      if (e.clientY <= window.innerHeight * 0.1) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <nav className={`navbar ${visible ? 'visible' : ''} ${animationType} ${isHidden ? 'navbar-hidden' : ''}`}>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/connect">Connect</a></li>
      </ul>
    </nav>
  );
};

export default NavBar;