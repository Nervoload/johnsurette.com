// src/pages/landing/sections/SectionWrapper.jsx
import React from 'react';
import PropTypes from 'prop-types';
import '../styles/sectionWrapper.css'; // Ensure this path matches your file structure

const SectionWrapper = ({ lockScroll, children, className }) => {
  // Combine classes for styling and conditional scroll-lock
  const wrapperClass = `section-wrapper ${lockScroll ? 'lock-scroll' : ''} ${className || ''}`;
  return <div className={wrapperClass}>{children}</div>;
};

SectionWrapper.propTypes = {
  lockScroll: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default SectionWrapper;