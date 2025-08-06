import React from 'react';
import './styles/ClothingDetailInfo.css';

const ClothingDetailInfo = ({ name, description, price, sizes, colors }) => (
  <div className="clothing-detail-info">
    <div className="item-label">Name:</div>
    <div className="item-value item-name">{name}</div>
    <div className="item-label">Description:</div>
    <div className="item-value item-desc">{description}</div>
    <div className="item-label">Price:</div>
    <div className="item-value item-price">${price}</div>
    <div className="item-label">Sizes:</div>
    <div className="item-value item-sizes">{sizes}</div>
    <div className="item-label">Colors:</div>
    <div className="item-value item-colors">{colors}</div>
  </div>
);

export default ClothingDetailInfo;
