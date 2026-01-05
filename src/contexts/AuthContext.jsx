import React, { createContext, useContext, useState, useEffect } from 'react';
import API_ENDPOINTS from '../config/apiEndpoints';
import toast from 'react-hot-toast';
import { axiosinstance } from '../axiosinstance';

const AuthContext = createContext(null);



export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        axiosinstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axiosinstance.get(API_ENDPOINTS.AUTH.ME);
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      localStorage.removeItem('token');
      delete axiosinstance.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axiosinstance.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password
      });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axiosinstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setIsAuthenticated(true);
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await axiosinstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Silent fail
    } finally {
      localStorage.removeItem('token');
      delete axiosinstance.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    }
  };

  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions) => {
    if (!user || !user.permissions) return false;
    return permissions.some(p => user.permissions.includes(p));
  };

  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    hasRole,
    refreshUser: checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
