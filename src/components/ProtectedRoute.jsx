import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../getSession';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = getToken() !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
