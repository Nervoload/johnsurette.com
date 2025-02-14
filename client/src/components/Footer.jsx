// src/components/Footer.jsx
import React, { useState, useEffect } from 'react';
import './FooterStyle.css';

const Footer = ({ active, onClose }) => {
  const [scrollAttempts, setScrollAttempts] = useState(0);
  const threshold = 2;

  useEffect(() => {
    if (!active) {
      setScrollAttempts(0);
      return;
    }

    const handleWheel = (e) => {
      e.preventDefault();

      if (e.deltaY < 0) { // Scrolling up
        const newAttempts = scrollAttempts + 1;
        setScrollAttempts(newAttempts);
        
        if (newAttempts >= threshold) {
          onClose();
          setScrollAttempts(0);
        }
      } else {
        setScrollAttempts(0);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    // Disable body scroll when footer is active
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      document.body.style.overflow = 'auto';
    };
  }, [active, scrollAttempts, threshold, onClose]);

  if (!active) return null;

  return (
    <footer className={`footer ${active ? 'active' : ''}`}>
      <div className="footer-content">
        <div className="footer-top">
          {/* Top area: navigation, contacts, socials */}
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/connect">Connect</a></li>
          </ul>
          <div className="footer-contacts">
            <p>Email: example@example.com</p>
            <p>Phone: 123-456-7890</p>
            <p>Social: @example</p>
          </div>
        </div>
        <div className="footer-bottom">
          {/* Bottom area: fixed copyright text */}
          <p>&copy; 2025 Your Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;