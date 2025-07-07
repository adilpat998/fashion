import { useEffect, useState } from 'react';
import './Splash.css';

const Splash = () => {
  const [clothes, setClothes] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [adminError, setAdminError] = useState('');

  useEffect(() => {
    fetch('/api/genres')
      .then(res => res.json())
      .then(setGenres);
  }, []);

  useEffect(() => {
    setLoading(true);
    let url = '/api/clothes';
    if (selectedGenre) url += `?genreId=${selectedGenre}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setClothes(data);
        } else if (Array.isArray(data.clothes)) {
          setClothes(data.clothes);
        } else {
          setClothes([]);
        }
        setLoading(false);
      });
  }, [selectedGenre]);

  // Listen for openAdminLoginModal event from Navigation
  useEffect(() => {
    const openModal = () => setShowAdminModal(true);
    window.addEventListener('openAdminLoginModal', openModal);
    return () => window.removeEventListener('openAdminLoginModal', openModal);
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
      setShowAdminModal(false);
      setPasskey('');
      window.location.reload(); // Refresh the page after successful login
    } else {
      const err = await res.json();
      setAdminError(err.error || 'Invalid passkey');
    }
  };

  return (
    <div className="splash-root">
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
      {loading ? (
        <p style={{ color: '#2d2d2d', fontSize: '1.2rem' }}>Loading clothing items...</p>
      ) : (
        <>
          {genres.length > 0 && (
            <div className="genre-tabs-row">
              {genres.map(genre => (
                <button
                  key={genre.id}
                  className={`genre-tab${selectedGenre === genre.id ? ' selected' : ''}`}
                  onClick={() => setSelectedGenre(selectedGenre === genre.id ? null : genre.id)}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          )}
          <div className="clothes-grid">
            {clothes.map(item => (
              <div className="clothing-card" key={item.id}>
                <div className="clothing-image-wrapper">
                  <img
                    className="clothing-image"
                    src={item.imageUrl || (item.images && item.images[0]?.imageUrl) || 'https://via.placeholder.com/220x260?text=No+Image'}
                    alt={item.name}
                  />
                </div>
                <div className="clothing-info">
                  <div className="clothing-name">{item.name}</div>
                  <div className="clothing-description">{item.description}</div>
                  <div className="clothing-price">${Number(item.price).toFixed(2)}</div>
                  <div className="clothing-sizes">Sizes: {item.sizes}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Splash;
