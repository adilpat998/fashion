import React from 'react';
import './styles/ClothingDetailImages.css';

const ClothingDetailImages = ({ images }) => (
  <div className="clothing-detail-images">
    {images.map((img, idx) => (
      <img key={idx} src={img} alt="Clothing" className="clothing-detail-img" />
    ))}
  </div>
);

export default ClothingDetailImages;
