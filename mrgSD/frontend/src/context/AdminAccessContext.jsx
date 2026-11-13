import { createContext, useContext } from 'react';

export const AdminAccessContext = createContext(null);
export const useAdminAccess = () => useContext(AdminAccessContext);
export const adminModuleForPath = (path) => {
  const part = path.split('/')[2] || 'dashboard';
  return part === 'categories' ? 'products' : part;
};
