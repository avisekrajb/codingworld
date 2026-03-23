import { Navigate } from 'react-router-dom';

// Simple admin check - in production, this should verify JWT token
const isAdmin = () => {
  return localStorage.getItem('adminToken') === 'true';
};

export default function AdminRoute({ children }) {
  if (!isAdmin()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}