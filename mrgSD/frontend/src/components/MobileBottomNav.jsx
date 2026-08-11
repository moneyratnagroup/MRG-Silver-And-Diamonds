import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, User } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './MobileBottomNav.css';

const MobileBottomNav = () => {
  const location = useLocation();

  return (
    <div className="mobile-bottom-nav">
      <Link to="/" className={`bottom-nav-item ${location.pathname === '/' ? 'active' : ''}`}>
        <Home size={22} className="bottom-nav-icon" strokeWidth={1.5} />
        <span>Home</span>
      </Link>
      
      <Link to="/silver/all" className={`bottom-nav-item ${location.pathname.includes('/silver') ? 'active' : ''}`}>
        <LayoutGrid size={22} className="bottom-nav-icon" strokeWidth={1.5} />
        <span>Collection</span>
      </Link>
      
      <Link to="/admin" className={`bottom-nav-item ${location.pathname.includes('/admin') ? 'active' : ''}`}>
        <User size={22} className="bottom-nav-icon" strokeWidth={1.5} />
        <span>Account</span>
      </Link>
      
    </div>
  );
};

export default MobileBottomNav;
