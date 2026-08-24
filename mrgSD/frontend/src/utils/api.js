const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('mrg_access_token');
  
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

  return response;
};
