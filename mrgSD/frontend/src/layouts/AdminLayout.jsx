import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import { Menu } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  return (
    <div className="admin-layout-container">
      {/* Mobile Header (visible only on small screens) */}
      <div className="admin-mobile-header">
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <Menu size={24} />
        </button>
      </div>

      <div className="admin-layout-body">
        {/* Overlay for mobile */}
        {isMobileMenuOpen && (
          <div className="admin-sidebar-overlay" onClick={closeMobileMenu}></div>
        )}
        
        {/* Sidebar */}
        <div className={`admin-sidebar-wrapper ${isMobileMenuOpen ? 'open' : ''}`}>
          <AdminSidebar onMobileClose={closeMobileMenu} />
        </div>

        {/* Main Content */}
        <main className="admin-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
