import React from 'react';
import '../styles/passion-section.css'; // Adjust the path as needed

const PassionSection = () => {
  return (
    <div className="passion-section">
      <div className="passion-header">
        <h1>BIOTECHNOLOGY</h1>
        <p className="subheader-quote">
          "The Last to Die, or the first to Live Forever.
        </p>
        <p className="subheader-quote">
        In our lifetimes, it will be decided which our generation will be known for"
        </p>
      </div>
      <div className="ticker-container">
        <div className="ticker">
          <span>LONGEVITY</span>
          <span>NEUROSCIENCE</span>
          <span>CONNECTOMICS</span>
          <span>COMPUTATIONAL BIOLOGY</span>
          <span>MEDICINE</span>
          {/* Duplicate the sequence for a seamless loop */}
          <span>LONGEVITY</span>
          <span>NEUROSCIENCE</span>
          <span>CONNECTOMICS</span>
          <span>COMPUTATIONAL BIOLOGY</span>
          <span>MEDICINE</span>
        </div>
      </div>
    </div>
  );
};

export default PassionSection;