import { Navigate } from 'react-router-dom';

const RequireAdmin = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  if (!adminToken) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default RequireAdmin;
