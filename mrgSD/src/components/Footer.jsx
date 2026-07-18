import React from 'react';
import { Gem, MapPin, Phone, Mail } from 'lucide-react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <Container fluid className="px-4 px-lg-5">
        <Row className="footer-top">
          <Col lg={4} md={12} className="footer-brand-col">
            <div className="footer-brand">
              <div className="footer-logo-circle">
                <Gem size={20} color="#ffffff" strokeWidth={1.5} />
              </div>
              <div className="footer-brand-text">
                <span className="footer-brand-name">Moneyratna</span>
                <span className="footer-brand-tag">JEWELLERY</span>
              </div>
            </div>
            <p className="footer-description">
              Silver, diamond and sacred jewellery —<br />
              crafted for the moments that matter.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" aria-label="Youtube">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
            </div>
          </Col>
          
          <Col lg={2} md={4} sm={6} className="footer-links-col">
            <h4 className="footer-heading">SHOP</h4>
            <ul className="footer-links">
              <li><a href="/shop/silver">Silver Collection</a></li>
              <li><a href="/shop/diamond">Diamond Collection</a></li>
              <li><a href="/shop/couples">Couples</a></li>
              <li><a href="/shop/kids">Kids</a></li>
              <li><a href="/shop/pooja">Pooja Idols</a></li>
              <li><a href="/shop/investment">Investment</a></li>
            </ul>
          </Col>

          <Col lg={2} md={4} sm={6} className="footer-links-col">
            <h4 className="footer-heading">COMPANY</h4>
            <ul className="footer-links">
              <li><a href="/about">Our Story</a></li>
              <li><a href="/craftsmanship">Craftsmanship</a></li>
              <li><a href="/boutiques">Boutiques</a></li>
              <li><a href="/press">Press</a></li>
              <li><a href="/careers">Careers</a></li>
            </ul>
          </Col>

          <Col lg={4} md={4} sm={12} className="footer-contact-col">
            <h4 className="footer-heading">VISIT US</h4>
            <ul className="footer-contact">
              <li>
                <MapPin className="contact-icon" size={18} strokeWidth={1.5} />
                <span>Flagship Boutique, Linking Road,<br />Mumbai 400050</span>
              </li>
              <li>
                <Phone className="contact-icon" size={18} strokeWidth={1.5} />
                <span>+91 98200 00000</span>
              </li>
              <li>
                <Mail className="contact-icon" size={18} strokeWidth={1.5} />
                <span>care@moneyratna.com</span>
              </li>
            </ul>
          </Col>
        </Row>

        <div className="footer-bottom">
          <div className="footer-copyright">
            © 2026 Moneyratna Jewellery. All rights reserved.
          </div>
          <div className="footer-legal">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/shipping">Shipping</a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
