import React from 'react';
import '../styles/ClothingDetailRoot.css';

const ClothingDetailRoot = ({ children }) => (
  <div className="clothing-detail-root">
    {/* Nav spacer for top navigation. Adjust height as needed. */}
    <div style={{ height: '20rem' }} />
    {children}
  </div>
);

export default ClothingDetailRoot;
