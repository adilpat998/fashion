import React from 'react';

const ClothingList = ({ clothes, categories, handleEdit, handleDelete }) => (
  <div className="clothes-list">
    {clothes.map(item => (
      <div className="clothing-admin-card" key={item.id}>
        <img src={item.imageUrl || (item.images && item.images[0]?.imageUrl) || 'https://via.placeholder.com/220x260?text=No+Image'} alt={item.name} />
        <div><b>{item.name}</b></div>
        <div>{item.description}</div>
        <div>Sizes: {item.sizes}</div>
        <div>Price: ${Number(item.price).toFixed(2)}</div>
        <div>Category: {categories.find(c => c.id === item.categoryId)?.name || 'None'}</div>
        <div>Colors: {(item.colors ? (Array.isArray(item.colors) ? item.colors : item.colors.split(',')) : []).join(', ')}</div>
        <button className="edit-btn" onClick={() => handleEdit(item)}>Edit</button>
        <button className="delete-btn" onClick={() => handleDelete(item)}>Delete</button>
      </div>
    ))}
  </div>
);

export default ClothingList;
