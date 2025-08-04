import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Splash.css';

const Splash = () => {
  const navigate = useNavigate();
  const [clothes, setClothes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [adminError, setAdminError] = useState('');
  const sectionRefs = useRef({});

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch('/api/clothes')
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
  }, []);

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

  // Group clothes by categoryId
  const clothesByCategory = {};
  clothes.forEach(item => {
    if (!clothesByCategory[item.categoryId]) clothesByCategory[item.categoryId] = [];
    clothesByCategory[item.categoryId].push(item);
  });

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
      <div style={{ height: '350px', width: '100%' }} className="nav-spacer"></div>
      {loading ? (
        <p style={{ color: '#2d2d2d', fontSize: '1.2rem' }}>Loading clothing items...</p>
      ) : (
        <>
          <div className="about-shadmani-section">
            <h2 className="about-shadmani-title">About Shadmani Fashion</h2>
            <p className="about-shadmani-bio">
              Mussarat Pathan is the heart behind our boutique — a family-owned Pakistani clothing business based in Hasbrouck Heights, New Jersey. Founded in 2020, this venture began as a creative outlet and has since blossomed into a full-fledged passion project that blends elegance, tradition, and accessibility.<br/><br/>
              A practicing full-time dentist by profession, Mussarat has always had a deep love for fashion — especially the rich textures, vibrant colors, and intricate craftsmanship of South Asian clothing. Redesigning and curating dresses was once a hobby, but her dream was always to bring modest, culturally rooted fashion to women at an affordable price.<br/><br/>
              What started as a side venture quickly became her creative escape. Today, it’s a brand that reflects her values: elegance, cultural pride, and empowerment through clothing. Through this journey, Mussarat has traveled across the world to carefully handpick and design pieces that celebrate femininity and modesty.<br/><br/>
              Her mission is simple — to help women feel beautiful, confident, and connected to their heritage, all while wearing clothing that tells a story.
            </p>
          </div>
          <div className="categories-sections">
            {[...categories].sort((a, b) => {
              if (a.name.toLowerCase() === 'new') return -1;
              if (b.name.toLowerCase() === 'new') return 1;
              return a.name.localeCompare(b.name);
            }).map(category => (
              <div
                key={category.id}
                ref={el => (sectionRefs.current[category.id] = el)}
                id={`category-section-${category.id}`}
                className="category-section"
              >
                <h2 className="category-section-title">
                  {category.name.toLowerCase() === 'new' ? "What's New?" : category.name}
                </h2>
                <div className="clothes-grid">
                  {(clothesByCategory[category.id] || []).length === 0 ? (
                    <div className="no-items">No items in this category.</div>
                  ) : (
                    clothesByCategory[category.id].map(item => (
                      <div className="clothing-card" key={item.id} onClick={() => navigate(`/clothes/${item.id}`)} style={{cursor:'pointer'}}>
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
                    ))
                  )}
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
