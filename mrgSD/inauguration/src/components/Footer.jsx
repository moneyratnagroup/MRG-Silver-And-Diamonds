import React from 'react';
import {
  MapPin, Phone, Mail, Clock, ChevronRight,
  MessageCircle, Gem,
  BadgeCheck, Lock, Truck, RefreshCw, Headphones
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';
import imgbislogo from '../assets/bis_logo.webp';
import imgmrgicon from '../assets/mrgicon.webp';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-wave-bg" aria-hidden="true">
        <svg preserveAspectRatio="none" viewBox="0 0 1440 600" xmlns="http://www.w3.org/2000/svg">
          {/* Top-Left champagne gold waves */}
          <path d="M-50,150 Q150,250 350,-50" fill="none" stroke="rgba(200, 169, 106, 0.12)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <path d="M-50,200 Q250,350 450,-50" fill="none" stroke="rgba(200, 169, 106, 0.08)" strokeWidth="1" vectorEffect="non-scaling-stroke" />

          {/* Bottom-Right champagne gold waves */}
          <path d="M1000,650 Q1150,400 1500,300" fill="none" stroke="rgba(200, 169, 106, 0.1)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <path d="M1100,650 Q1250,450 1500,400" fill="none" stroke="rgba(200, 169, 106, 0.06)" strokeWidth="1" vectorEffect="non-scaling-stroke" />

          {/* Bottom-Left subtle navy waves */}
          <path d="M-50,450 Q200,500 300,650" fill="none" stroke="rgba(15, 30, 50, 0.8)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <path d="M-50,500 Q150,550 200,650" fill="none" stroke="rgba(15, 30, 50, 0.5)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <div className="footer-container">

        {/* Top Section */}
        <div className="footer-top">

          {/* Brand & Contact */}
          <div className="footer-col-brand">
            <div className="footer-logo-area">
              <img loading="lazy" src={imgmrgicon} alt="Moneyratna Logo" className="footer-diamond-logo" width="52" height="52" />
              <div className="footer-brand-text">
                <div className="footer-brand-title">Moneyratna</div>
                <div className="footer-brand-subtitle">Jewellery</div>
              </div>
            </div>
            <p className="footer-description">
              Explore the beauty of gold, the brilliance of diamonds, and the charm of silver. Every piece reflects elegance, quality, and craftsmanship.
            </p>
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <div className="footer-contact-icon-box">
                  <MapPin className="footer-contact-icon" size={16} strokeWidth={1.8} />
                </div>
                <span>Registered Address:<br />Moneyratna Gold and Jewellery Pvt Ltd<br />Door No. 27/79 B, Baburaj Trading Centre<br />Thiruvamady PO, Alappuzha 688002</span>
              </li>
              <li className="footer-contact-item">
                <div className="footer-contact-icon-box">
                  <Phone className="footer-contact-icon" size={16} strokeWidth={1.8} />
                </div>
                <span>+91 7025925916</span>
              </li>
              <li className="footer-contact-item">
                <div className="footer-contact-icon-box">
                  <Mail className="footer-contact-icon" size={16} strokeWidth={1.8} />
                </div>
                <span>info@moneyratna.com</span>
              </li>
              <li className="footer-contact-item">
                <div className="footer-contact-icon-box">
                  <Clock className="footer-contact-icon" size={16} strokeWidth={1.8} />
                </div>
                <span>Mon - Sat: 10:00 AM - 7:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Shop Links */}
          <div className="footer-col-links">
            <h4 className="footer-heading">SHOP</h4>
            <ul className="footer-links-list">
              <li><Link to="/"><ChevronRight size={14} className="chevron-icon" /> New Arrivals</Link></li>
              <li><Link to="/diamonds"><ChevronRight size={14} className="chevron-icon" /> Diamond Jewellery</Link></li>
              {/* <li><Link to="/products?collection=investment"><ChevronRight size={14} className="chevron-icon" /> Silver Coins</Link></li> */}
            </ul>
          </div>

          {/* Customer Care Links */}
          <div className="footer-col-links">
            <h4 className="footer-heading">CUSTOMER CARE</h4>
            <ul className="footer-links-list">
              <li><Link to="/contact"><ChevronRight size={14} className="chevron-icon" /> Contact Us</Link></li>
              <li><Link to="/returns"><ChevronRight size={14} className="chevron-icon" /> Return & Refund Policy</Link></li>
              <li><Link to="/cancellation"><ChevronRight size={14} className="chevron-icon" /> Cancellation Policy</Link></li>
              <li><Link to="/faq"><ChevronRight size={14} className="chevron-icon" /> FAQs</Link></li>
              <li><Link to="/care-guide"><ChevronRight size={14} className="chevron-icon" /> Jewellery Care Guide</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="footer-col-links">
            <h4 className="footer-heading">COMPANY</h4>
            <ul className="footer-links-list">
              <li><Link to="/about"><ChevronRight size={14} className="chevron-icon" /> About Us</Link></li>
              <li><Link to="/careers"><ChevronRight size={14} className="chevron-icon" /> Careers</Link></li>
              <li><Link to="/privacy"><ChevronRight size={14} className="chevron-icon" /> Privacy Policy</Link></li>
              <li><Link to="/terms"><ChevronRight size={14} className="chevron-icon" /> Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Subscribe & Social */}
          <div className="footer-col-subscribe">

            <h4 className="footer-social-title">FOLLOW US</h4>
            <div className="social-icons-row">
              <a href="#" className="social-icon-link" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
              <a href="#" className="social-icon-link" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href="#" className="social-icon-link" aria-label="Youtube">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
              </a>
              <a href="#" className="social-icon-link" aria-label="Whatsapp">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM TRUST BAR */}
        <div className="footer-trust-bar">
          <div className="trust-item">
            <div className="trust-icon-wrapper">
              <img loading="lazy" src={imgbislogo} alt="BIS Hallmark" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            </div>
            <div className="trust-text">
              <span className="trust-title">100% BIS Hallmarked</span>
              <span className="trust-subtitle">Authenticity Guaranteed</span>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-wrapper">
              <Lock size={32} strokeWidth={1} />
            </div>
            <div className="trust-text">
              <span className="trust-title">Secure Payments</span>
              <span className="trust-subtitle">100% Safe & Secure</span>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-wrapper">
              <Truck size={32} strokeWidth={1} />
            </div>

          </div>

          <div className="trust-item">
            <div className="trust-icon-wrapper">
              <RefreshCw size={32} strokeWidth={1} />
            </div>
            <div className="trust-text">
              <span className="trust-title">Easy Returns</span>
              <span className="trust-subtitle">Hassle Free Returns</span>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-wrapper">
              <Headphones size={32} strokeWidth={1} />
            </div>
            <div className="trust-text">
              <span className="trust-title">Dedicated Support</span>
              <span className="trust-subtitle">Always Here for You</span>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR: Copyright & Payments */}
        <div className="footer-bottom-row">
          <div className="footer-payments-wrapper">
            <span className="we-accept-text">WE ACCEPT</span>
            <span className="payment-card visa">VISA</span>
            <span className="payment-card mc"></span>
            <span className="payment-card rupay">RuPay</span>
            <span className="payment-card upi">UPI</span>
            <span className="payment-card gpay">G Pay</span>
            <span className="payment-card phonepe">PhonePe</span>
            <span className="payment-card paytm">Paytm</span>
          </div>

          <div className="footer-legal-section">
            <div className="footer-copyright">
              © 2026 Moneyratna Jewellery. All Rights Reserved.
            </div>
            <div className="footer-legal-links">
              <Link to="/privacy">Privacy Policy</Link>
              <span className="pipe-separator">|</span>
              <Link to="/terms">Terms & Conditions</Link>
              <span className="pipe-separator">|</span>
              <Link to="/shipping">Shipping Policy</Link>
              <span className="pipe-separator">|</span>
              <Link to="/returns">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
