import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Package, Users, Settings, LogOut, Home, MessageSquare, Tags, Ticket, ShoppingBag, Archive, ChevronDown, ChevronRight, X, Star } from 'lucide-react';
import './AdminSidebar.css';
import { useAdminAccess } from '../../context/AdminAccessContext';

const AdminSidebar = ({ onMobileClose }) => {
  const location = useLocation();
  const { canAccess, account } = useAdminAccess();
  const [isSettingsOpen, setIsSettingsOpen] = useState(location.pathname.includes('/admin/settings'));
  const [isProductsOpen, setIsProductsOpen] = useState(location.pathname.includes('/admin/products') || location.pathname.includes('/admin/categories'));
  const [isInventoryOpen, setIsInventoryOpen] = useState(location.pathname.includes('/admin/inventory'));
  const [isRatesOpen, setIsRatesOpen] = useState(location.pathname.includes('/admin/rates'));

  const toggleProducts = () => setIsProductsOpen(!isProductsOpen);
  const toggleInventory = () => setIsInventoryOpen(!isInventoryOpen);
  const toggleRates = () => setIsRatesOpen(!isRatesOpen);

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <div className="admin-brand-text">
          <h2>MRG Admin</h2>
          <p>Dashboard</p>
        </div>
        <button className="mobile-close-btn" onClick={onMobileClose}>
          <X size={24} />
        </button>
      </div>
      
      <nav className="admin-nav">
        {canAccess('dashboard') && (
        <NavLink to="/admin" end className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        )}
        {canAccess('orders') && (
        <NavLink to="/admin/orders" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <ShoppingBag size={20} />
          <span>Orders</span>
        </NavLink>
        )}

        {/* Inventory Group */}
        {canAccess('inventory') && (
        <div className="admin-nav-group">
          <div className={`admin-nav-item-header ${location.pathname.includes('/admin/inventory') ? 'active' : ''}`} onClick={toggleInventory}>
            <div className="admin-nav-header-left">
              <Archive size={20} />
              <span>Inventory</span>
            </div>
            {isInventoryOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
          {isInventoryOpen && (
            <div className="admin-subnav">
              <NavLink to="/admin/inventory?tab=overview" className={() => (location.search === '?tab=overview' || (location.pathname === '/admin/inventory' && !location.search)) ? 'admin-subnav-link active' : 'admin-subnav-link'} onClick={onMobileClose}>
                Overview
              </NavLink>
              <NavLink to="/admin/inventory?tab=management" className={() => location.search === '?tab=management' ? 'admin-subnav-link active' : 'admin-subnav-link'} onClick={onMobileClose}>
                Stock Management
              </NavLink>
              <NavLink to="/admin/inventory?tab=history" className={() => location.search === '?tab=history' ? 'admin-subnav-link active' : 'admin-subnav-link'} onClick={onMobileClose}>
                Stock History
              </NavLink>
              <NavLink to="/admin/inventory?tab=reports" className={() => location.search === '?tab=reports' ? 'admin-subnav-link active' : 'admin-subnav-link'} onClick={onMobileClose}>
                Reports
              </NavLink>
            </div>
          )}
        </div>
        )}

        {canAccess('homepage') && (
        <NavLink to="/admin/homepage" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <Home size={20} />
          <span>Homepage</span>
        </NavLink>
        )}

        {/* Metal Rates Group */}
        {canAccess('rates') && (
        <div className="admin-nav-group">
          <div className={`admin-nav-item-header ${location.pathname.includes('/admin/rates') ? 'active' : ''}`} onClick={toggleRates}>
            <div className="admin-nav-header-left">
              <TrendingUp size={20} />
              <span>Metal Rates</span>
            </div>
            {isRatesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
          {isRatesOpen && (
            <div className="admin-subnav">
              <NavLink to="/admin/rates/new" className={({ isActive }) => `admin-subnav-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
                Add Metal Type
              </NavLink>
              <NavLink to="/admin/rates" end className={({ isActive }) => `admin-subnav-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
                Manage Rates / Metals
              </NavLink>
            </div>
          )}
        </div>
        )}

        {/* Products Group */}
        {canAccess('products') && (
        <div className="admin-nav-group">
          <div className={`admin-nav-item-header ${(location.pathname.includes('/admin/products') || location.pathname.includes('/admin/categories')) ? 'active' : ''}`} onClick={toggleProducts}>
            <div className="admin-nav-header-left">
              <Package size={20} />
              <span>Products</span>
            </div>
            {isProductsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
          {isProductsOpen && (
            <div className="admin-subnav">
              <NavLink to="/admin/products" end className={({ isActive }) => `admin-subnav-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
                All Products
              </NavLink>
              <NavLink to="/admin/products/new" className={({ isActive }) => `admin-subnav-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
                Add Product
              </NavLink>
              <NavLink to="/admin/categories" className={({ isActive }) => `admin-subnav-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
                Categories
              </NavLink>
            </div>
          )}
        </div>
        )}

        {canAccess('users') && (
        <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <Users size={20} />
          <span>Users</span>
        </NavLink>
        )}
        {canAccess('testimonials') && (
        <NavLink to="/admin/testimonials" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <MessageSquare size={20} />
          <span>Testimonials</span>
        </NavLink>
        )}
        {canAccess('reviews') && (
        <NavLink to="/admin/reviews" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <Star size={20} />
          <span>Product Reviews</span>
        </NavLink>
        )}
        {canAccess('coupons') && (
        <NavLink to="/admin/coupons" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <Ticket size={20} />
          <span>Coupons</span>
        </NavLink>
        )}
        {canAccess('settings') && (
        <div className="admin-nav-group">
          <button type="button"
            className={`admin-nav-item-header ${location.pathname.includes('/admin/settings') ? 'active' : ''}`}
            style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', textAlign: 'left' }}
            aria-expanded={isSettingsOpen} aria-controls="admin-settings-subnav"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
            <div className="admin-nav-header-left"><Settings size={20} /><span>Settings</span></div>
            {isSettingsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {isSettingsOpen && <div className="admin-subnav" id="admin-settings-subnav">
            <NavLink to="/admin/settings/password" className={({ isActive }) => `admin-subnav-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
              Change Password
            </NavLink>
            {account.is_owner && <NavLink to="/admin/settings/permissions" className={({ isActive }) => `admin-subnav-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
              User Role and Permissions
            </NavLink>}
          </div>}
        </div>
        )}
      </nav>

      <div className="admin-logout">
        <button 
          className="btn-logout" 
          onClick={() => {
            localStorage.removeItem('mrg_admin_token');
            window.location.href = '/admin/login';
          }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
