import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { fetchWithAuth } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('mrg_access_token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('mrg_access_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState(null);

  // login function handling both new and existing user auth handoffs
  const login = (accessToken, userData) => {
    localStorage.setItem('mrg_access_token', accessToken);
    setToken(accessToken);
    setUser(userData);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false); // Close modal on successful login
  };

  const logout = () => {
    localStorage.removeItem('mrg_access_token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const openAuthModal = (message = null) => {
    // Check if message is a React event object and ignore it if so
    if (typeof message === 'object' && message !== null) {
      setAuthModalMessage(null);
    } else {
      setAuthModalMessage(message);
    }
    setIsAuthModalOpen(true);
  };
  
  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setTimeout(() => setAuthModalMessage(null), 300); // Clear after animation
  };

  const refreshUser = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetchWithAuth('/api/v1/auth/me', {
        method: 'GET'
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // Token might be expired or invalid, clear state
        logout();
      }
    } catch (error) {
      console.error("Failed to fetch user profile", error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    isAuthModalOpen,
    authModalMessage,
    openAuthModal,
    closeAuthModal,
    login,
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
