// src/pages/landing/LandingPage.jsx
import React, { useRef, useEffect, useState } from 'react';
import SectionWrapper from './sections/SectionWrapper';
import InteractiveBackground from '../../components/backgrounds/InteractiveBackground';
import CustomScrollBar from '../../components/cursor&scroll/CustomScrollBar';
import WelcomeSection from './sections/WelcomeSection';
import PassionSection from './sections/PassionSection';
import './landing.css';

const LandingPage = () => {
  const scrollContainerRef = useRef(null);
  const sectionCount = 4;
  const [totalHeight, setTotalHeight] = useState(window.innerHeight * sectionCount);

  useEffect(() => {
    const handleResize = () => {
      setTotalHeight(window.innerHeight * sectionCount);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sectionCount]);

  return (
    <div className="landing-page">
      <InteractiveBackground sensitivity={0.01} />
      <div className="foreground" ref={scrollContainerRef}>
        <section className="section locked">
          <SectionWrapper className="welcome-section">
            <WelcomeSection />
          </SectionWrapper>
        </section>
        <section className="section locked">
          <SectionWrapper className="skills-section">
            <PassionSection />
          </SectionWrapper>
        </section>
        <section className="section unlocked">
          <SectionWrapper className="experience-section">
            <h1>Experience & Education</h1>
            <p>Learn about my education, experience, and projects here.</p>
          </SectionWrapper>
        </section>
        <section className="section locked">
          <SectionWrapper className="contact-section">
            <h1>Contact</h1>
            <p>Interested in connecting? Let's chat!</p>
          </SectionWrapper>
        </section>
      </div>
      <CustomScrollBar
        scrollContainerRef={scrollContainerRef}
        sectionCount={sectionCount}
        scrollColors={['#fff', '#000', '#000', '#fff']}
      />
    </div>
  );
};

export default LandingPage;