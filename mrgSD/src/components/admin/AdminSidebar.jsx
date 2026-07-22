import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Package, Users, Settings, LogOut, Home, MessageSquare, Tags, Ticket, ShoppingBag, Archive } from 'lucide-react';
import './AdminSidebar.css';

const AdminSidebar = () => {
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
        <NavLink to="/admin/inventory" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
          <Archive size={20} />
          <span>Inventory</span>
        </NavLink>
        <NavLink to="/admin/homepage" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
          <Home size={20} />
          <span>Homepage</span>
        </NavLink>
        <NavLink to="/admin/rates" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
          <TrendingUp size={20} />
          <span>Metal Rates</span>
        </NavLink>
        <NavLink to="/admin/products" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
          <Package size={20} />
          <span>Products</span>
        </NavLink>
        <NavLink to="/admin/customers" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          <span>Customers</span>
        </NavLink>
        <NavLink to="/admin/categories" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
          <Tags size={20} />
          <span>Categories</span>
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
