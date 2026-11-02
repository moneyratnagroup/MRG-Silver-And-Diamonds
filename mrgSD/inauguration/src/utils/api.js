import { toast } from 'react-toastify';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const ADMIN_IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Decodes a JWT token and checks if its `exp` claim has passed.
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const { exp } = JSON.parse(jsonPayload);
    if (!exp) return false;
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};

/**
 * Clears admin session data from localStorage and optionally shows a toast message.
 */
export const logoutAdmin = (message) => {
  localStorage.removeItem('mrg_admin_token');
  localStorage.removeItem('mrg_admin_last_activity');
  if (message) {
    toast.warning(message, { toastId: 'admin-session-expired' });
  }
};

export const fetchWithAuth = async (endpoint, options = {}) => {
  const adminToken = localStorage.getItem('mrg_admin_token');
  const token = adminToken || localStorage.getItem('mrg_access_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 && adminToken && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
    logoutAdmin('Your admin session has expired. Please log in again.');
    window.location.replace('/admin/login');
  }

  return response;
};
