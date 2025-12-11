import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginApi, logout as logoutApi } from '../api/userApi';
import api from '../api/axios'; // Import the axios instance

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On initial load, check localStorage for user and token
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Set the token for all subsequent axios requests
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
    } catch (error) {
      console.error('Failed to parse auth data from localStorage', error);
      // Clear potentially corrupted storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (memberId, password) => {
    try {
      const response = await loginApi(memberId, password);
      if (response.success) {
        const { user, token } = response;
        // Store user and token
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        setUser(user);
        setToken(token);
        // Set default auth header for axios
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '로그인에 실패했습니다.' 
      };
    }
  };

  const logout = async () => {
    try {
      await logoutApi(); // Call the backend logout to invalidate the token if needed
    } catch (error) {
      console.error('Backend logout failed, proceeding with frontend logout:', error);
    } finally {
      // Clear everything from state and storage
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      // Remove auth header from axios defaults
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
