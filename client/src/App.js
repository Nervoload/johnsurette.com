// src/App.js
import React from 'react';
import './styles/App.css';
import LandingPage from './pages/landing/LandingPage';
import NavBar from './components/navbar/NavBar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <NavBar animationType="glow" />
      <LandingPage />
      <Footer />
    </div>
  );
}

export default App;