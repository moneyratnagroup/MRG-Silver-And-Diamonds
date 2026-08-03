import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Search, User, Heart, ShoppingBag, ChevronDown, Sparkles, Watch, Baby, Sun, Coins, Crown, LayoutGrid } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import './Navbar.css';

const MRGNavbar = () => {
  const [expanded, setExpanded] = useState(false);
  const { getCartCount, getWishlistCount, setIsCartOpen, setIsWishlistOpen } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  const handleWishlistClick = () => {
    if (window.innerWidth < 992) {
      setIsWishlistOpen(true);
    } else {
      navigate('/wishlist');
    }
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const [forceClose, setForceClose] = useState(false);

  const closeMenu = () => {
    setExpanded(false);
    setForceClose(true);
    setTimeout(() => setForceClose(false), 300);
  };

  return (
    <Navbar expanded={expanded} onToggle={setExpanded} sticky="top" expand="lg" className="custom-navbar">
      <Container fluid className="px-4 px-lg-5 position-relative d-flex align-items-center justify-content-between">
        
        {/* Mobile Left: Hamburger */}
        <div className="d-flex d-lg-none align-items-center" style={{ flex: '1 1 0%' }}>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler border-0 p-0 me-3" />
        </div>

        <Navbar.Brand as={Link} to="/" className="brand-logo-container mx-auto mx-lg-0 m-0">
          <svg className="brand-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c4-4 4-10 0-14-4 4-4 10 0 14z" />
            <path d="M12 22c-4-4-4-10 0-14 4 4 4 10 0 14z" />
            <path d="M12 8l-4-6 4 2 4-2-4 6z" />
            <path d="M8 2l-6 6c3 3 8 4 10 0" />
            <path d="M16 2l6 6c-3 3-8 4-10 0" />
          </svg>
          <div className="brand-text">
            <span className="brand-name">MONEYRATNA</span>
            <span className="brand-tagline">SILVER AND DIAMONDS</span>
          </div>
        </Navbar.Brand>
        
        <div className="d-flex align-items-center justify-content-end order-lg-last" style={{ flex: '1 1 0%' }}>
          <div className="utilities">
            <button className="utility-btn d-none d-lg-flex" aria-label="User Account">
              <User size={20} strokeWidth={1.5} />
            </button>
            <button className="utility-btn" aria-label="Wishlist" onClick={handleWishlistClick}>
              <Heart size={20} strokeWidth={1.5} />
              {wishlistCount > 0 && <span className="cart-badge" style={{backgroundColor: '#1a1a1a'}}>{wishlistCount}</span>}
            </button>
            <button className="utility-btn d-none d-lg-flex" aria-label="Shopping Bag" onClick={handleCartClick}>
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
          {/* Desktop toggler (hidden on lg, but needed for bootstrap collapse logic sometimes? No, Bootstrap handles it with d-lg-none) */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="d-none" />
        </div>

        <Navbar.Collapse id="basic-navbar-nav" className="custom-collapse">
          <Nav className="mx-auto nav-links-container">
            <Nav.Link as={Link} to="/" className={`nav-link-custom ${currentPath === '/' ? 'active' : ''}`} onClick={closeMenu}>HOME</Nav.Link>
            
            <div className="nav-item-dropdown">
              <div className={`nav-link-custom ${currentPath.startsWith('/silver') || currentPath === '/diamonds' ? 'active-dropdown' : ''}`}>
                SILVER <ChevronDown size={14} className="ms-1" />
              </div>
              <div className={`dropdown-mega-menu ${forceClose ? 'd-none' : ''}`}>
                <Link to="/silver/all" className="dropdown-item-mega" onClick={closeMenu}>
                  <div className="mega-icon-wrapper">
                    <LayoutGrid size={20} />
                  </div>
                  <div className="mega-text-content">
                    <span className="mega-title">ALL COLLECTIONS</span>
                    <span className="mega-subtitle">View Everything</span>
                  </div>
                </Link>
                <Link to="/silver/women" className="dropdown-item-mega" onClick={closeMenu}>
                  <div className="mega-icon-wrapper">
                    <Sparkles size={20} />
                  </div>
                  <div className="mega-text-content">
                    <span className="mega-title">WOMEN</span>
                    <span className="mega-subtitle">Rings, Earrings, Necklaces</span>
                  </div>
                </Link>
                <Link to="/silver/men" className="dropdown-item-mega" onClick={closeMenu}>
                  <div className="mega-icon-wrapper">
                    <Watch size={20} />
                  </div>
                  <div className="mega-text-content">
                    <span className="mega-title">MEN</span>
                    <span className="mega-subtitle">Chains, Bracelets, Rings</span>
                  </div>
                </Link>
                <Link to="/silver/kids" className="dropdown-item-mega" onClick={closeMenu}>
                  <div className="mega-icon-wrapper">
                    <Baby size={20} />
                  </div>
                  <div className="mega-text-content">
                    <span className="mega-title">KIDS</span>
                    <span className="mega-subtitle">Anklets, Tiny Studs</span>
                  </div>
                </Link>
                <Link to="/silver/religious" className="dropdown-item-mega" onClick={closeMenu}>
                  <div className="mega-icon-wrapper">
                    <Sun size={20} />
                  </div>
                  <div className="mega-text-content">
                    <span className="mega-title">RELIGIOUS</span>
                    <span className="mega-subtitle">Idols, Pooja Thalis, Coins</span>
                  </div>
                </Link>
                <Link to="/silver/investment" className="dropdown-item-mega" onClick={closeMenu}>
                  <div className="mega-icon-wrapper">
                    <Coins size={20} />
                  </div>
                  <div className="mega-text-content">
                    <span className="mega-title">INVESTMENT</span>
                    <span className="mega-subtitle">Silver Bars, Bullions</span>
                  </div>
                </Link>
                <Link to="/silver/special" className="dropdown-item-mega" onClick={closeMenu}>
                  <div className="mega-icon-wrapper">
                    <Crown size={20} />
                  </div>
                  <div className="mega-text-content">
                    <span className="mega-title">SPECIAL</span>
                    <span className="mega-subtitle">Diamond Accents, Bridal</span>
                  </div>
                </Link>
              </div>
            </div>
            
            <Nav.Link as={Link} to="/diamonds" className={`nav-link-custom ${currentPath === '/diamonds' ? 'active' : ''}`} onClick={closeMenu}>DIAMONDS</Nav.Link>
            
            <Nav.Link as={Link} to="/about" className={`nav-link-custom ${currentPath === '/about' ? 'active' : ''}`} onClick={closeMenu}>ABOUT US</Nav.Link>
            <Nav.Link as={Link} to="/contact" className={`nav-link-custom ${currentPath === '/contact' ? 'active' : ''}`} onClick={closeMenu}>CONTACT US</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MRGNavbar;
