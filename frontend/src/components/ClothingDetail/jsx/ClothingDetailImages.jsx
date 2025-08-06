import React from 'react';
import '../styles/ClothingDetailImages.css';

const ClothingDetailImages = ({ images }) => {
  // Fallback if images is not an array or is empty
  const validImages = Array.isArray(images) && images.length > 0
    ? images
    : ['https://via.placeholder.com/320x400?text=No+Image'];
  return (
    <div className="clothing-detail-images">
      {validImages.map((img, idx) => (
        <img key={idx} src={img} alt={`Clothing ${idx + 1}`} className="clothing-detail-img" />
      ))}
    </div>
  );
};

export default ClothingDetailImages;
