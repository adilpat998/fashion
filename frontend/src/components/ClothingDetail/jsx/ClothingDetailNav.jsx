import React from 'react';
import '../styles/ClothingDetailNav.css';

const ClothingDetailNav = ({ onHome }) => (
  <nav className="clothing-detail-nav">
    <button className="home-btn" onClick={onHome}>Home</button>
  </nav>
);

export default ClothingDetailNav;
