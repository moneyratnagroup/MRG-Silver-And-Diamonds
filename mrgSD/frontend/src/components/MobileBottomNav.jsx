import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, User, Heart, ShoppingCart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import './MobileBottomNav.css';

const MobileBottomNav = () => {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const { isAuthenticated, user, logout, isLoading, isAuthModalOpen, openAuthModal, closeAuthModal } = useAuth();
  const { getWishlistCount, getCartCount, setIsWishlistOpen, setIsCartOpen } = useShop();
  const menuRef = useRef(null);

  const wishlistCount = getWishlistCount();
  const cartCount = getCartCount();

  const getFirstName = () => {
    if (user && user.full_name) {
      return user.full_name.split(' ')[0];
    }
    return 'Account';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAccountClick = (e) => {
    if (isAuthenticated) {
      setShowMenu(!showMenu);
    } else {
      openAuthModal();
    }
  };

  return (
    <>
      <div className="mobile-bottom-nav">
        <Link to="/" className={`bottom-nav-item ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setShowMenu(false)}>
          <Home size={22} className="bottom-nav-icon" strokeWidth={1.5} />
          <span>Home</span>
        </Link>

        <Link to="/products" className={`bottom-nav-item ${location.pathname.includes('/products') || location.pathname.includes('/silver') ? 'active' : ''}`} onClick={() => setShowMenu(false)}>
          <LayoutGrid size={22} className="bottom-nav-icon" strokeWidth={1.5} />
          <span>Collection</span>
        </Link>

        <button className="bottom-nav-item" onClick={() => { setIsWishlistOpen(true); setShowMenu(false); }}>
          <div className="bottom-cart-wrapper">
            <Heart size={22} className="bottom-nav-icon" strokeWidth={1.5} />
            {wishlistCount > 0 && <span className="bottom-cart-badge">{wishlistCount}</span>}
          </div>
          <span>Wishlist</span>
        </button>

        <button className="bottom-nav-item" onClick={() => { setIsCartOpen(true); setShowMenu(false); }}>
          <div className="bottom-cart-wrapper">
            <ShoppingCart size={22} className="bottom-nav-icon" strokeWidth={1.5} />
            {cartCount > 0 && <span className="bottom-cart-badge">{cartCount}</span>}
          </div>
          <span>Cart</span>
        </button>

        <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center' }} ref={menuRef}>
          <button
            className="bottom-nav-item"
            onClick={handleAccountClick}
            style={{ background: 'none', border: 'none', padding: 0, width: '100%' }}
            disabled={isLoading}
          >
            <User size={22} className="bottom-nav-icon" strokeWidth={1.5} style={{ opacity: isLoading ? 0.5 : 1 }} />
            <span style={{ opacity: isLoading ? 0.5 : 1 }}>{isLoading ? '...' : (isAuthenticated ? getFirstName() : 'Account')}</span>
          </button>

          {showMenu && isAuthenticated && (
            <div className="mobile-account-menu" style={{
              position: 'absolute', bottom: '100%', right: '10px',
              backgroundColor: '#fff', padding: '10px 0', borderRadius: '8px',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.1)', minWidth: '150px',
              border: '1px solid #eee', marginBottom: '15px', zIndex: 1050,
              textAlign: 'left'
            }}>
              <div style={{ padding: '8px 16px', color: '#999', fontSize: '0.85rem', fontWeight: 500 }}>My Account</div>
              <div style={{ padding: '12px 16px', color: '#111', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }} onClick={() => { logout(); setShowMenu(false); }}>Logout</div>
            </div>
          )}
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </>
  );
};

export default MobileBottomNav;
