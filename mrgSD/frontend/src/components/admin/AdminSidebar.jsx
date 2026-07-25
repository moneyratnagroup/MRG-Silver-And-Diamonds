import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Package, Users, Settings, LogOut, Home, MessageSquare, Tags, Ticket, ShoppingBag, Archive, ChevronDown, ChevronRight } from 'lucide-react';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const location = useLocation();
  const [isProductsOpen, setIsProductsOpen] = useState(location.pathname.includes('/admin/products') || location.pathname.includes('/admin/categories'));
  const [isInventoryOpen, setIsInventoryOpen] = useState(location.pathname.includes('/admin/inventory'));
  const [isRatesOpen, setIsRatesOpen] = useState(location.pathname.includes('/admin/rates'));

  const toggleProducts = () => setIsProductsOpen(!isProductsOpen);
  const toggleInventory = () => setIsInventoryOpen(!isInventoryOpen);
  const toggleRates = () => setIsRatesOpen(!isRatesOpen);

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <h2>MRG Admin</h2>
        <p>Dashboard</p>
      </div>
      
      <nav className="admin-nav">
        <NavLink to="/admin" end className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
          <ShoppingBag size={20} />
          <span>Orders</span>
        </NavLink>

        {/* Inventory Group */}
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
              <NavLink to="/admin/inventory?tab=overview" className={() => (location.search === '?tab=overview' || (location.pathname === '/admin/inventory' && !location.search)) ? 'admin-subnav-link active' : 'admin-subnav-link'}>
                Overview
              </NavLink>
              <NavLink to="/admin/inventory?tab=management" className={() => location.search === '?tab=management' ? 'admin-subnav-link active' : 'admin-subnav-link'}>
                Stock Management
              </NavLink>
              <NavLink to="/admin/inventory?tab=history" className={() => location.search === '?tab=history' ? 'admin-subnav-link active' : 'admin-subnav-link'}>
                Stock History
              </NavLink>
              <NavLink to="/admin/inventory?tab=reports" className={() => location.search === '?tab=reports' ? 'admin-subnav-link active' : 'admin-subnav-link'}>
                Reports
              </NavLink>
            </div>
          )}
        </div>

        <NavLink to="/admin/homepage" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
          <Home size={20} />
          <span>Homepage</span>
        </NavLink>

        {/* Metal Rates Group */}
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
              <NavLink to="/admin/rates/new" className={({ isActive }) => `admin-subnav-link ${isActive ? 'active' : ''}`}>
                Add Metal Type
              </NavLink>
              <NavLink to="/admin/rates" end className={({ isActive }) => `admin-subnav-link ${isActive ? 'active' : ''}`}>
                Manage Rates
              </NavLink>
            </div>
          )}
        </div>

        {/* Products Group */}
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
              <NavLink to="/admin/products" end className={({ isActive }) => `admin-subnav-link ${isActive ? 'active' : ''}`}>
                All Products
              </NavLink>
              <NavLink to="/admin/products/new" className={({ isActive }) => `admin-subnav-link ${isActive ? 'active' : ''}`}>
                Add Product
              </NavLink>
              <NavLink to="/admin/categories" className={({ isActive }) => `admin-subnav-link ${isActive ? 'active' : ''}`}>
                Categories
              </NavLink>
            </div>
          )}
        </div>

        <NavLink to="/admin/customers" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          <span>Customers</span>
        </NavLink>
        <NavLink to="/admin/testimonials" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
          <MessageSquare size={20} />
          <span>Testimonials</span>
        </NavLink>
        <NavLink to="/admin/coupons" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
          <Ticket size={20} />
          <span>Coupons</span>
        </NavLink>
        <NavLink to="/admin/settings" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="admin-logout">
        <button className="btn-logout">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
