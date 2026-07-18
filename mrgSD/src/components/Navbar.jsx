import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Search, User, Heart, ShoppingBag, ChevronDown, Sparkles, Watch, Baby, Sun, Coins, Crown } from 'lucide-react';
import './Navbar.css';

const MRGNavbar = () => {
  const [cartCount, setCartCount] = useState(0);

  return (
    <Navbar sticky="top" className="custom-navbar">
      <Container fluid className="px-4 px-lg-5">
        <Navbar.Brand href="/" className="brand-logo-container">
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
        
        <Nav className="mx-auto nav-links-container">
          <Nav.Link href="/" className="nav-link-custom active">HOME</Nav.Link>
          
          <div className="nav-item-dropdown">
            <div className="nav-link-custom active-dropdown">
              COLLECTIONS <ChevronDown size={14} className="ms-1" />
            </div>
            <div className="dropdown-mega-menu">
              <a href="/women" className="dropdown-item-mega">
                <div className="mega-icon-wrapper">
                  <Sparkles size={20} />
                </div>
                <div className="mega-text-content">
                  <span className="mega-title">WOMEN</span>
                  <span className="mega-subtitle">Rings, Earrings, Necklaces</span>
                </div>
              </a>
              <a href="/men" className="dropdown-item-mega">
                <div className="mega-icon-wrapper">
                  <Watch size={20} />
                </div>
                <div className="mega-text-content">
                  <span className="mega-title">MEN</span>
                  <span className="mega-subtitle">Chains, Bracelets, Rings</span>
                </div>
              </a>
              <a href="/kids" className="dropdown-item-mega">
                <div className="mega-icon-wrapper">
                  <Baby size={20} />
                </div>
                <div className="mega-text-content">
                  <span className="mega-title">KIDS</span>
                  <span className="mega-subtitle">Anklets, Tiny Studs</span>
                </div>
              </a>
              <a href="/religious" className="dropdown-item-mega">
                <div className="mega-icon-wrapper">
                  <Sun size={20} />
                </div>
                <div className="mega-text-content">
                  <span className="mega-title">RELIGIOUS</span>
                  <span className="mega-subtitle">Idols, Pooja Thalis, Coins</span>
                </div>
              </a>
              <a href="/investment" className="dropdown-item-mega">
                <div className="mega-icon-wrapper">
                  <Coins size={20} />
                </div>
                <div className="mega-text-content">
                  <span className="mega-title">INVESTMENT</span>
                  <span className="mega-subtitle">Silver Bars, Bullions</span>
                </div>
              </a>
              <a href="/special" className="dropdown-item-mega">
                <div className="mega-icon-wrapper">
                  <Crown size={20} />
                </div>
                <div className="mega-text-content">
                  <span className="mega-title">SPECIAL</span>
                  <span className="mega-subtitle">Diamond Accents, Bridal</span>
                </div>
              </a>
            </div>
          </div>
          
          <Nav.Link href="/about" className="nav-link-custom">ABOUT US</Nav.Link>
          <Nav.Link href="/contact" className="nav-link-custom">CONTACT US</Nav.Link>
        </Nav>
        
        <div className="utilities">
          <button className="utility-btn" aria-label="Search">
            <Search size={20} strokeWidth={1.5} />
          </button>
          <button className="utility-btn" aria-label="User Account">
            <User size={20} strokeWidth={1.5} />
          </button>
          <button className="utility-btn" aria-label="Wishlist">
            <Heart size={20} strokeWidth={1.5} />
          </button>
          <button className="utility-btn" aria-label="Shopping Bag">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </Container>
    </Navbar>
  );
};

export default MRGNavbar;
