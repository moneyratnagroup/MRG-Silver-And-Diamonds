import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, User, ShoppingCart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './MobileBottomNav.css';

const MobileBottomNav = () => {
  const { getCartCount, setIsCartOpen } = useShop();
  const location = useLocation();
  const cartCount = getCartCount();

  const handleCartClick = (e) => {
    e.preventDefault();
    setIsCartOpen(true);
  };

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
      
      <button className="bottom-nav-item" onClick={handleCartClick}>
        <div className="bottom-cart-wrapper">
          <ShoppingCart size={22} className="bottom-nav-icon" strokeWidth={1.5} />
          {cartCount > 0 && <span className="bottom-cart-badge">{cartCount}</span>}
        </div>
        <span>Cart</span>
      </button>
    </div>
  );
};

export default MobileBottomNav;
