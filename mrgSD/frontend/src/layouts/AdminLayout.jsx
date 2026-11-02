import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import { Menu } from 'lucide-react';
import { ADMIN_IDLE_TIMEOUT_MS, isTokenExpired, logoutAdmin } from '../utils/api';
import './AdminLayout.css';

const ACTIVITY_THROTTLE_MS = 10 * 1000; // Update activity timestamp at most every 10 seconds
const SESSION_CHECK_INTERVAL_MS = 15 * 1000; // Check session validity every 15 seconds

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const validateSession = useCallback(
    (showNotification = false) => {
      const adminToken = localStorage.getItem('mrg_admin_token');

      if (!adminToken) {
        navigate('/admin/login', { replace: true });
        return false;
      }

      if (isTokenExpired(adminToken)) {
        logoutAdmin(showNotification ? 'Your session has expired. Please log in again.' : null);
        navigate('/admin/login', { replace: true });
        return false;
      }

      const lastActivityStr = localStorage.getItem('mrg_admin_last_activity');
      if (lastActivityStr) {
        const lastActivity = parseInt(lastActivityStr, 10);
        if (!Number.isNaN(lastActivity) && Date.now() - lastActivity >= ADMIN_IDLE_TIMEOUT_MS) {
          logoutAdmin('Logged out due to 30 minutes of inactivity. Please log in again.');
          navigate('/admin/login', { replace: true });
          return false;
        }
      } else {
        localStorage.setItem('mrg_admin_last_activity', String(Date.now()));
      }

      return true;
    },
    [navigate]
  );

  // Check session on initial load and route transitions
  useEffect(() => {
    validateSession(true);
  }, [location.pathname, validateSession]);

  // Monitor user activity & enforce 30-minute idle timeout
  useEffect(() => {
    let lastRecorded = Date.now();

    const handleUserActivity = () => {
      const now = Date.now();
      if (now - lastRecorded < ACTIVITY_THROTTLE_MS) return;

      const lastActivityStr = localStorage.getItem('mrg_admin_last_activity');
      const lastActivity = lastActivityStr ? parseInt(lastActivityStr, 10) : now;

      // If already past the 30-minute idle threshold, trigger logout instead of extending
      if (!Number.isNaN(lastActivity) && now - lastActivity >= ADMIN_IDLE_TIMEOUT_MS) {
        validateSession(true);
        return;
      }

      lastRecorded = now;
      localStorage.setItem('mrg_admin_last_activity', String(now));
    };

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        validateSession(true);
      }
    };

    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    activityEvents.forEach((event) =>
      window.addEventListener(event, handleUserActivity, { passive: true })
    );
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    const intervalId = setInterval(() => {
      validateSession(true);
    }, SESSION_CHECK_INTERVAL_MS);

    return () => {
      activityEvents.forEach((event) =>
        window.removeEventListener(event, handleUserActivity)
      );
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      clearInterval(intervalId);
    };
  }, [validateSession]);

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

  const adminToken = localStorage.getItem('mrg_admin_token');
  if (!adminToken || isTokenExpired(adminToken)) {
    return null;
  }

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
