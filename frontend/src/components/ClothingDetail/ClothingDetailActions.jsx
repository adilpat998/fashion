import React from 'react';
import './styles/ClothingDetailActions.css';

const ClothingDetailActions = ({ onBuy, onShare }) => (
  <div className="clothing-detail-actions">
    <button className="buy-btn" onClick={onBuy}>Buy</button>
    <button className="share-btn" onClick={onShare}>Share</button>
  </div>
);

export default ClothingDetailActions;
