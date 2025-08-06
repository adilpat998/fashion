import React from 'react';
import './styles/ClothingDetailRelatedList.css';

const ClothingDetailRelatedList = ({ related }) => (
  <div className="clothing-detail-related-list">
    {related.map(item => (
      <div className="clothing-card" key={item.id}>
        <img src={item.image} alt={item.name} className="clothing-image" />
        <div>{item.name}</div>
      </div>
    ))}
  </div>
);

export default ClothingDetailRelatedList;
