import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Search, User, Heart, ShoppingCart, ChevronDown, Sparkles, Watch, Baby, Sun, Coins, Crown, LayoutGrid, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import './Navbar.css';

const MRGNavbar = () => {
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const { getWishlistCount, setIsWishlistOpen, getCartCount, setIsCartOpen } = useShop();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const { isAuthenticated, user, logout, isLoading, isAuthModalOpen, openAuthModal, closeAuthModal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const wishlistCount = getWishlistCount();
  const cartCount = getCartCount();

  const getFirstName = () => {
    return user?.full_name ? user.full_name.split(' ')[0] : 'User';
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleWishlistClick = () => {
    if (window.innerWidth < 992) {
      setIsWishlistOpen(true);
    } else {
      navigate('/wishlist');
    }
  };

  const [forceClose, setForceClose] = useState(false);

  const closeMenu = () => {
    setExpanded(false);
    setForceClose(true);
    setTimeout(() => setForceClose(false), 300);
  };

  return (
    <Navbar expanded={expanded} onToggle={setExpanded} sticky="top" expand="lg" className={`custom-navbar ${scrolled ? 'scrolled' : ''}`}>
      <Container fluid className={`px-4 px-lg-5 flex-column custom-navbar-container ${scrolled ? 'desktop-scrolled-layout' : ''}`}>

        {/* Top Row */}
        <div className="navbar-top-row d-flex w-100 justify-content-between align-items-center pb-2 pb-lg-3">

          {/* Left: Hamburger Spacer */}
          <div className="d-flex align-items-center justify-content-start" style={{ flex: '1 1 0%' }}>
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler border-0 p-0 me-3 d-lg-none" />
          </div>

          {/* Center: Brand Logo */}
          <div className="d-flex align-items-center justify-content-center" style={{ flex: '1 1 0%' }}>
            <Navbar.Brand as={Link} to="/" className="brand-logo-container m-0">
              <img src="/mrgicon.png" alt="Moneyratna Logo" className="brand-icon-img" style={{ width: '48px', height: 'auto', marginRight: '10px' }} />
              <div className="brand-text">
                <span className="brand-name">MONEYRATNA</span>
                <span className="brand-tagline">GOLD AND JEWELLERY</span>
              </div>
            </Navbar.Brand>
          </div>

          {/* Right: Utilities */}
          <div className="d-flex align-items-center justify-content-end" style={{ flex: '1 1 0%' }}>
            <div className="utilities">
              <button className="utility-btn" aria-label="Search">
                <Search size={20} strokeWidth={1.5} />
              </button>

              <button className="utility-btn d-none d-lg-flex" aria-label="Wishlist" onClick={handleWishlistClick}>
                <Heart size={20} strokeWidth={1.5} />
                {wishlistCount > 0 && <span className="cart-badge" style={{ backgroundColor: '#1a1a1a' }}>{wishlistCount}</span>}
              </button>

              <button className="utility-btn d-none d-lg-flex" aria-label="Cart" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart size={20} strokeWidth={1.5} />
                {cartCount > 0 && <span className="cart-badge" style={{ backgroundColor: '#1a1a1a' }}>{cartCount}</span>}
              </button>

              {isLoading ? (
                <div className="utility-btn d-none d-lg-flex" aria-label="Loading Account">
                  <User size={20} strokeWidth={1.5} style={{ opacity: 0.5 }} />
                </div>
              ) : isAuthenticated ? (
                <div className="d-none d-lg-flex align-items-center h-100" style={{ position: 'relative' }} ref={profileMenuRef}>
                  <div
                    className="d-flex align-items-center utility-btn px-2"
                    aria-label="User Account"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="profile-avatar-btn" style={{ border: '1px solid #111' }}>
                      {getFirstName().charAt(0)}
                    </div>
                  </div>

                  <div
                    className={`dropdown-simple-menu ${forceClose ? 'd-none' : ''}`}
                    style={{
                      right: 0,
                      left: 'auto',
                      minWidth: '220px',
                      padding: 0,
                      marginTop: '10px',
                      opacity: isProfileMenuOpen ? 1 : 0,
                      visibility: isProfileMenuOpen ? 'visible' : 'hidden',
                      transform: isProfileMenuOpen ? 'translateY(0)' : 'translateY(10px)',
                      pointerEvents: isProfileMenuOpen ? 'auto' : 'none',
                      transition: 'all 0.3s ease',
                      zIndex: 1050
                    }}
                  >
                    <div style={{ padding: '16px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#ffd6d6',
                        border: '1px solid #111',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#111',
                        fontWeight: '600',
                        fontSize: '1.2rem',
                        textTransform: 'uppercase',
                        flexShrink: 0
                      }}>
                        {getFirstName().charAt(0)}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          Hi, {user?.full_name || 'User'}
                        </span>
                        {user?.email && (
                          <span style={{ fontSize: '0.75rem', color: '#666', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {user.email}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ padding: '0.5rem 0' }}>
                      <div className="dropdown-item-simple" style={{ color: '#999', cursor: 'default', textAlign: 'left' }}>My Account</div>
                      <Link to="/wishlist" className="dropdown-item-simple" style={{ textAlign: 'left' }} onClick={() => { closeMenu(); setIsProfileMenuOpen(false); }}>My Wishlist</Link>
                      <div className="dropdown-item-simple" style={{ cursor: 'pointer', borderTop: '1px solid #eee', marginTop: '0.25rem', paddingTop: '0.75rem', textAlign: 'left' }} onClick={() => { logout(); closeMenu(); setIsProfileMenuOpen(false); }}>
                        Logout
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <button className="utility-btn d-none d-lg-flex" aria-label="User Account" onClick={openAuthModal}>
                  <User size={20} strokeWidth={1.5} />
                </button>
              )}
            </div>
          </div>
          {/* Desktop toggler (hidden on lg) */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="d-none" />
        </div>

      <Navbar.Collapse id="basic-navbar-nav" className="custom-collapse w-100 justify-content-center pb-2">
        <div className="d-flex justify-content-between align-items-center p-3 d-lg-none border-bottom mb-2 w-100">
          <span className="brand-name" style={{ fontSize: '1.2rem', color: '#B89146' }}>MENU</span>
          <button onClick={() => setExpanded(false)} className="utility-btn" aria-label="Close menu">
            <X size={24} />
          </button>
        </div>
        <Nav className="nav-links-container">
            <Nav.Link as={Link} to="/" className={`nav-link-custom hide-on-scroll ${currentPath === '/' ? 'active' : ''}`} onClick={closeMenu}>HOME</Nav.Link>
            
            <div className="nav-item-dropdown">
              <div className={`nav-link-custom ${currentPath.startsWith('/silver') ? 'active-dropdown' : ''}`}>
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

            <div className="nav-item-dropdown">
              <div className={`nav-link-custom ${currentPath.startsWith('/diamonds') ? 'active-dropdown' : ''}`}>
                DIAMONDS <ChevronDown size={14} className="ms-1" />
              </div>
              <div className={`dropdown-mega-menu ${forceClose ? 'd-none' : ''}`}>
                <Link to="/diamonds/all" className="dropdown-item-mega" onClick={closeMenu}>
                  <div className="mega-icon-wrapper">
                    <LayoutGrid size={20} />
                  </div>
                  <div className="mega-text-content">
                    <span className="mega-title">ALL COLLECTIONS</span>
                    <span className="mega-subtitle">View Everything</span>
                  </div>
                </Link>
                <Link to="/diamonds/women" className="dropdown-item-mega" onClick={closeMenu}>
                  <div className="mega-icon-wrapper">
                    <Sparkles size={20} />
                  </div>
                  <div className="mega-text-content">
                    <span className="mega-title">WOMEN</span>
                    <span className="mega-subtitle">Rings, Earrings, Necklaces</span>
                  </div>
                </Link>
                <Link to="/diamonds/men" className="dropdown-item-mega" onClick={closeMenu}>
                  <div className="mega-icon-wrapper">
                    <Watch size={20} />
                  </div>
                  <div className="mega-text-content">
                    <span className="mega-title">MEN</span>
                    <span className="mega-subtitle">Chains, Bracelets, Rings</span>
                  </div>
                </Link>
                <Link to="/diamonds/kids" className="dropdown-item-mega" onClick={closeMenu}>
                  <div className="mega-icon-wrapper">
                    <Baby size={20} />
                  </div>
                  <div className="mega-text-content">
                    <span className="mega-title">KIDS</span>
                    <span className="mega-subtitle">Anklets, Tiny Studs</span>
                  </div>
                </Link>
              </div>
            </div>

            <Nav.Link as={Link} to="/gold" className={`nav-link-custom ${currentPath.startsWith('/gold') ? 'active' : ''}`} onClick={closeMenu}>GOLD</Nav.Link>
            <div className="nav-item-dropdown">
              <div className={`nav-link-custom ${currentPath.startsWith('/coins-and-bars') || currentPath.startsWith('/investment') ? 'active-dropdown' : ''}`}>
                COINS & BARS <ChevronDown size={14} className="ms-1" />
              </div>
              <div className={`dropdown-mega-menu ${forceClose ? 'd-none' : ''}`}>
                <Link to="/investment/all" className="dropdown-item-mega" onClick={closeMenu}>
                  <div className="mega-icon-wrapper">
                    <LayoutGrid size={20} />
                  </div>
                  <div className="mega-text-content">
                    <span className="mega-title">ALL COLLECTIONS</span>
                    <span className="mega-subtitle">View Everything</span>
                  </div>
                </Link>
                <Link to="/investment/999-gold" className="dropdown-item-mega" onClick={closeMenu}>
                  <div className="mega-icon-wrapper">
                    <Coins size={20} />
                  </div>
                  <div className="mega-text-content">
                    <span className="mega-title">999 GOLD</span>
                    <span className="mega-subtitle">24k Pure Investment Gold</span>
                  </div>
                </Link>
                <Link to="/investment/995-gold" className="dropdown-item-mega" onClick={closeMenu}>
                  <div className="mega-icon-wrapper">
                    <Coins size={20} />
                  </div>
                  <div className="mega-text-content">
                    <span className="mega-title">995 GOLD</span>
                    <span className="mega-subtitle">Standard Investment Gold</span>
                  </div>
                </Link>
                <Link to="/investment/999-silver" className="dropdown-item-mega" onClick={closeMenu}>
                  <div className="mega-icon-wrapper">
                    <Sparkles size={20} />
                  </div>
                  <div className="mega-text-content">
                    <span className="mega-title">999 SILVER</span>
                    <span className="mega-subtitle">Pure Silver Bullion</span>
                  </div>
                </Link>
                <Link to="/investment/999-copper" className="dropdown-item-mega" onClick={closeMenu}>
                  <div className="mega-icon-wrapper">
                    <Sun size={20} />
                  </div>
                  <div className="mega-text-content">
                    <span className="mega-title">999 COPPER</span>
                    <span className="mega-subtitle">Pure Copper Investment</span>
                  </div>
                </Link>
              </div>
            </div>

            <Nav.Link as={Link} to="/about" className={`nav-link-custom ${currentPath === '/about' ? 'active' : ''}`} onClick={closeMenu}>ABOUT US</Nav.Link>
            <Nav.Link as={Link} to="/contact" className={`nav-link-custom ${currentPath === '/contact' ? 'active' : ''}`} onClick={closeMenu}>CONTACT US</Nav.Link>
            <Nav.Link as={Link} to="/careers" className={`nav-link-custom ${currentPath === '/careers' ? 'active' : ''}`} onClick={closeMenu}>CAREERS</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* Authentication Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </Navbar>
  );
};

export default MRGNavbar;
