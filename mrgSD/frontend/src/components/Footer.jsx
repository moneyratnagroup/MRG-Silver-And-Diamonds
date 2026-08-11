import React from 'react';
import {
  MapPin, Phone, Mail, Clock, ChevronRight,
  MessageCircle, Gem,
  BadgeCheck, Lock, Truck, RefreshCw, Headphones
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">

        {/* Top Section */}
        <div className="footer-top">

          {/* Brand & Contact */}
          <div className="footer-col-brand">
            <div className="footer-logo-area">
              <img src="/mrgicon.png" alt="Moneyratna Logo" className="footer-diamond-logo" style={{ width: '56px', height: 'auto', marginBottom: '15px' }} />
              <div className="footer-brand-title">Moneyratna</div>
              <div className="footer-brand-subtitle">Silver & Diamonds</div>
            </div>
            <p className="footer-description">
              Crafting timeless silver jewellery and elegant diamond collections with trusted quality, purity and exceptional craftsmanship.
            </p>
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <MapPin className="footer-contact-icon" size={18} strokeWidth={1.5} />
                <span>Store Address<br />Anakkara,Idukki,<br />Kerala - 673001, India</span>
              </li>
              <li className="footer-contact-item">
                <Phone className="footer-contact-icon" size={18} strokeWidth={1.5} />
                <span>+91 0000000000</span>
              </li>
              <li className="footer-contact-item">
                <Mail className="footer-contact-icon" size={18} strokeWidth={1.5} />
                <span>info@moneyratna.com</span>
              </li>
              <li className="footer-contact-item">
                <Clock className="footer-contact-icon" size={18} strokeWidth={1.5} />
                <span>Mon - Sat: 10:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Shop Links */}
          <div className="footer-col-links">
            <h4 className="footer-heading">SHOP</h4>
            <ul className="footer-links-list">
              <li><Link to="/"><ChevronRight size={14} className="chevron-icon" /> New Arrivals</Link></li>
              <li><Link to="/silver/women"><ChevronRight size={14} className="chevron-icon" /> Women's Collection</Link></li>
              <li><Link to="/silver/men"><ChevronRight size={14} className="chevron-icon" /> Men's Collection</Link></li>
              <li><Link to="/silver/kids"><ChevronRight size={14} className="chevron-icon" /> Kids Collection</Link></li>
              <li><Link to="/silver/couple"><ChevronRight size={14} className="chevron-icon" /> Couple Collection</Link></li>
              <li><Link to="/products"><ChevronRight size={14} className="chevron-icon" /> All Products</Link></li>
              <li><Link to="/diamonds"><ChevronRight size={14} className="chevron-icon" /> Diamond Jewellery</Link></li>
              <li><Link to="/silver/investment"><ChevronRight size={14} className="chevron-icon" /> Silver Coins</Link></li>
              <li><Link to="/silver/religious"><ChevronRight size={14} className="chevron-icon" /> Pooja & Idols</Link></li>
              <li><Link to="/silver/custom"><ChevronRight size={14} className="chevron-icon" /> Customized Jewellery</Link></li>
            </ul>
          </div>

          {/* Customer Care Links */}
          <div className="footer-col-links">
            <h4 className="footer-heading">CUSTOMER CARE</h4>
            <ul className="footer-links-list">
              <li><Link to="/contact"><ChevronRight size={14} className="chevron-icon" /> Contact Us</Link></li>
              <li><Link to="/track-order"><ChevronRight size={14} className="chevron-icon" /> Track Order</Link></li>
              <li><Link to="/shipping"><ChevronRight size={14} className="chevron-icon" /> Shipping Policy</Link></li>
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
              <li><Link to="/about#story"><ChevronRight size={14} className="chevron-icon" /> Our Story</Link></li>
              <li><Link to="/craftsmanship"><ChevronRight size={14} className="chevron-icon" /> Craftsmanship</Link></li>
              <li><Link to="/blogs"><ChevronRight size={14} className="chevron-icon" /> Blogs</Link></li>
              {/* <li><Link to="/testimonials"><ChevronRight size={14} className="chevron-icon" /> Testimonials</Link></li> */}
              <li><Link to="/careers"><ChevronRight size={14} className="chevron-icon" /> Careers</Link></li>
              <li><Link to="/privacy"><ChevronRight size={14} className="chevron-icon" /> Privacy Policy</Link></li>
              <li><Link to="/terms"><ChevronRight size={14} className="chevron-icon" /> Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Subscribe & Social */}
          <div className="footer-col-subscribe">
            <h4 className="footer-heading">STAY UPDATED</h4>
            <p className="subscribe-text">
              Be the first to know about new collections, festive offers and exclusive launches.
            </p>
            <form className="subscribe-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" className="subscribe-input" required />
              <button type="submit" className="subscribe-btn">SUBSCRIBE</button>
            </form>

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

            <h4 className="footer-heading" style={{ marginTop: '30px', marginBottom: '15px' }}>DOWNLOAD OUR APP</h4>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #333', borderRadius: '6px', textDecoration: 'none', flex: 1, minWidth: '130px', justifyContent: 'center' }}>
                <svg width="20" height="24" viewBox="0 0 384 512" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.55rem', lineHeight: '1', color: '#aaa' }}>Download on the</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', lineHeight: '1' }}>App Store</div>
                </div>
              </a>
              
              <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #333', borderRadius: '6px', textDecoration: 'none', flex: 1, minWidth: '130px', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#2196F3" d="M35.1 48c0-3.3 2.1-6.2 5.2-7.5L257.6 256 40.3 471.5C37.2 470.2 35.1 467.3 35.1 464V48z"/>
                  <path fill="#00E676" d="M40.3 40.5L347.1 204.3 257.6 256 40.3 40.5z"/>
                  <path fill="#FF3D00" d="M40.3 471.5L257.6 256l89.5 51.7L40.3 471.5z"/>
                  <path fill="#FFC107" d="M347.1 204.3L464 266.7c7.1 4 7.1 14.5 0 18.5L347.1 307.7l-89.5-51.7 89.5-51.7z"/>
                </svg>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.55rem', lineHeight: '1', color: '#aaa' }}>GET IT ON</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', lineHeight: '1' }}>Google Play</div>
                </div>
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#C7A66A', fontSize: '0.8rem', fontWeight: '500' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#C7A66A', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 'bold', fontStyle: 'italic' }}>i</div>
              <span>For iOS, use Organization Code: <strong>JQTLL</strong></span>
            </div>
          </div>
        </div>

        {/* BOTTOM TRUST BAR */}
        <div className="footer-trust-bar">
          <div className="trust-item">
            <div className="trust-icon-wrapper">
              <BadgeCheck size={32} strokeWidth={1} />
            </div>
            <div className="trust-text">
              <span className="trust-title">Hallmarked Jewellery</span>
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
            <div className="trust-text">
              <span className="trust-title">Fast Delivery</span>
              <span className="trust-subtitle">Pan India Delivery</span>
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
              © 2026 Moneyratna Silver & Diamonds. All Rights Reserved.
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
