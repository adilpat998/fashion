import React, { useEffect, useState } from 'react';
import './Splash.css';

const Splash = () => {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminLoggedIn, setAdminLoggedIn] = useState(!!localStorage.getItem('adminToken'));

  useEffect(() => {
    fetch('/api/clothes')
      .then(res => res.json())
      .then(data => {
        setClothes(data);
        setLoading(false);
      });
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passkey })
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('adminToken', data.token);
      setAdminLoggedIn(true);
      setShowAdminModal(false);
      setPasskey('');
    } else {
      const err = await res.json();
      setAdminError(err.error || 'Invalid passkey');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminLoggedIn(false);
  };

  return (
    <div className="splash-root">
      <button className="admin-login-btn" onClick={() => adminLoggedIn ? handleLogout() : setShowAdminModal(true)}>
        {adminLoggedIn ? 'Log Out (Admin)' : 'Admin Login'}
      </button>
      {showAdminModal && (
        <div className="admin-modal-bg" onClick={() => setShowAdminModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h2>Admin Login</h2>
            <form onSubmit={handleAdminLogin}>
              <input
                type="password"
                placeholder="Enter admin passkey"
                value={passkey}
                onChange={e => setPasskey(e.target.value)}
                autoFocus
              />
              {adminError && <div className="error">{adminError}</div>}
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      )}
      <h1 className="splash-header">Shadmani Fashion</h1>
      {loading ? (
        <p style={{ color: '#2d2d2d', fontSize: '1.2rem' }}>Loading clothing items...</p>
      ) : (
        <div className="clothes-grid">
          {clothes.map(item => (
            <div className="clothing-card" key={item.id}>
              <img
                className="clothing-image"
                src={item.imageUrl || (item.images && item.images[0]?.imageUrl) || 'https://via.placeholder.com/220x260?text=No+Image'}
                alt={item.name}
              />
              <div className="clothing-info">
                <div className="clothing-name">{item.name}</div>
                <div className="clothing-description">{item.description}</div>
                <div className="clothing-price">${Number(item.price).toFixed(2)}</div>
                <div className="clothing-sizes">Sizes: {item.sizes}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Splash;
