
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ClothingDetailNav = () => {
  const navigate = useNavigate();
  const [navLeft, setNavLeft] = useState(null);

  useEffect(() => {
    setNavLeft(document.querySelector('.nav-left-buttons'));
  }, []);

  if (!navLeft) return null;

  return (
    <nav className="clothing-detail-nav">
      <button className="home-btn" onClick={() => navigate('/')}>Home</button>
    </nav>
  );
};

export default ClothingDetailNav;
