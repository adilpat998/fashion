import React from 'react';

const AdminClothingManagerNav = ({ navigate }) => (
  <div className="admin-nav-container">
    <button className="admin-nav-btn" onClick={() => navigate('/')}>Home</button>
    <button className="admin-nav-btn" onClick={() => {
      localStorage.removeItem('adminToken');
      navigate('/');
      window.location.reload();
    }}>Logout</button>
  </div>
);

export default AdminClothingManagerNav;
