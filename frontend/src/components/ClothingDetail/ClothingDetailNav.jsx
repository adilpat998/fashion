
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ClothingDetailNav = () => {
  const navigate = useNavigate();
  const [navLeft, setNavLeft] = useState(null);

  useEffect(() => {
    setNavLeft(document.querySelector('.nav-left-buttons'));
  }, []);

  if (!navLeft) return null;

  return (
    navLeft &&
      window.ReactDOM &&
      window.ReactDOM.createPortal(
        <button className="nav-btn home-btn" onClick={() => navigate('/')}>Home</button>,
        navLeft
      )
  );
};

export default ClothingDetailNav;
