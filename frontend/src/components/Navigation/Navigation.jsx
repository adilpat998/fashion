import "./styles/NavigationRoot.css";
import "./styles/MainNav.css";
import "./styles/NavButtons.css";
import "./styles/CategoryTabsNav.css";
import "./styles/GoldTopBar.css";
import "./styles/SplashHeaderNav.css";
import "./styles/MediaQueriesNav.css";
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';


function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const adminLoggedIn = !!localStorage.getItem('adminToken');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategories);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
    window.location.reload();
  };

  const handleAdminClick = () => {
    if (adminLoggedIn) {
      handleLogout();
    } else {
      // Open admin login modal logic (as before)
      const event = new CustomEvent('openAdminLoginModal');
      window.dispatchEvent(event);
    }
  };

  // Scroll to category section on Splash
  const handleCategoryTabClick = (categoryId) => {
    const scrollToSection = () => {
      const section = document.getElementById(`category-section-${categoryId}`);
      const navHeight = document.querySelector('.main-nav')?.offsetHeight || 80;
      if (section) {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: sectionTop - navHeight,
          behavior: 'smooth'
        });
      }
    };
    const section = document.getElementById(`category-section-${categoryId}`);
    if (section) {
      scrollToSection();
    } else {
      navigate('/');
      setTimeout(scrollToSection, 400);
    }
  };

  return (
    <>
      <nav className="main-nav navigation-root nav-large">
        <div className="nav-left-buttons vertical-stack">
          {adminLoggedIn && (
            <button className="nav-btn" onClick={() => navigate('/admin/manage')}>Manage</button>
          )}
          {/* Only show Admin Login/Logout on home page */}
          {location.pathname === '/' && (
            <button className="nav-btn nav-admin" onClick={handleAdminClick}>
              {adminLoggedIn ? 'Log Out (Admin)' : 'Admin Login'}
            </button>
          )}
        </div>
        <div className="nav-title-wrapper nav-title-compact">
          <h1 className="splash-header">Shadmani Fashion</h1>
        </div>
        <div className="nav-right-placeholder"></div>
        {categories.length > 0 && (
          <div className="category-tabs-row nav-category-tabs-row nav-category-tabs-large nav-category-tabs-row-spaced">
            {[...categories].sort((a, b) => {
              if (a.name.toLowerCase() === 'new') return -1;
              if (b.name.toLowerCase() === 'new') return 1;
              return a.name.localeCompare(b.name);
            }).map(category => (
              <button
                key={category.id}
                className="category-tab"
                onClick={() => handleCategoryTabClick(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}

export default Navigation;
