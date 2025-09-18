import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole, requiredRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  console.log('[ProtectedRoute] user:', user);
  console.log('[ProtectedRoute] user.Job_role:', user?.Job_role);
  console.log('[ProtectedRoute] requiredRole:', requiredRole, 'requiredRoles:', requiredRoles);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  console.log("👤 ProtectedRoute user:", user);
  console.log("🔑 Required Role:", requiredRole);


  // Role-based guard (case-insensitive)
  const userRole = (user?.Job_role || '').toString().toLowerCase();
  const singleRequired = (requiredRole || '').toString().toLowerCase();
  const multiRequired = Array.isArray(requiredRoles)
    ? requiredRoles.map((r) => (r || '').toString().toLowerCase())
    : null;

  // If a roles array is provided, require membership in that set
  if (multiRequired && multiRequired.length > 0) {
    if (!multiRequired.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  } else if (singleRequired) {
    // Backward compatibility: when 'manager' is required, allow 'manager' or 'admin'
    if (singleRequired === 'manager') {
      if (!(userRole === 'manager' || userRole === 'admin')) {
        return <Navigate to="/unauthorized" replace />;
      }
    } else if (userRole !== singleRequired) {
      return <Navigate to="/unauthorized" replace />;
    }
  }


  return children;
};

export default ProtectedRoute;
