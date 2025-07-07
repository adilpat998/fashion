import "./Navigation.css";
import { useNavigate } from 'react-router-dom';

function Navigation() {
  const navigate = useNavigate();
  const adminLoggedIn = !!localStorage.getItem('adminToken');

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

  return (
    <nav className="main-nav">
      <div className="nav-left-buttons vertical-stack">
        <button className="nav-btn" onClick={() => navigate('/')}>Home</button>
        {adminLoggedIn && (
          <button className="nav-btn" onClick={() => navigate('/admin/manage')}>Manage</button>
        )}
        <button className="nav-btn nav-admin" onClick={handleAdminClick}>
          {adminLoggedIn ? 'Log Out (Admin)' : 'Admin Login'}
        </button>
      </div>
      <div className="nav-title-wrapper">
        <h1 className="splash-header nav-title">Shadmani Fashion</h1>
      </div>
      <div className="nav-right-placeholder"></div>
    </nav>
  );
}

export default Navigation;
