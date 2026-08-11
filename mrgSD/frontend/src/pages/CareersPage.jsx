import React from 'react';
import { Container } from 'react-bootstrap';
import './Pages.css';

const CareersPage = () => {
  return (
    <div className="careers-page-wrapper">
      {/* Hero Banner Section */}
      <div className="about-hero">
        <div className="about-hero-image">
          <img src="/carrerbg.jpg" alt="Careers at Moneyratna" style={{ filter: 'brightness(0.4)' }} />
        </div>
        <div className="about-hero-overlay">
          <h1 className="about-title" style={{ color: '#fff' }}>Join Our Team</h1>
          <p className="about-subtitle" style={{ color: '#f0f0f0' }}>Build a brilliant career with Moneyratna Silver & Diamonds</p>
        </div>
      </div>

      <div className="page-container py-5" style={{ minHeight: 'auto' }}>
        <Container>
          <div className="content-section text-center" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <p className="lead mb-4" style={{ fontSize: '1.1rem', color: '#555', lineHeight: '1.8' }}>
              We are always looking for talented individuals who are passionate about jewellery, exceptional craftsmanship, and outstanding customer service.
            </p>
            <div className="mt-5 p-5 bg-light rounded shadow-sm" style={{ border: '1px solid #eee' }}>
              <h4 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', color: '#1a1a1a', marginBottom: '15px' }}>Current Openings</h4>
              <p className="text-muted mt-3" style={{ fontSize: '1.05rem' }}>There are currently no open positions. Please check back later.</p>
              <hr className="my-4" style={{ opacity: 0.1 }} />
              <p className="mb-0" style={{ fontSize: '1.05rem', color: '#555' }}>
                You can also send your resume to <br />
                <a href="mailto:careers@moneyratna.com" className="text-decoration-none" style={{ color: '#a84c19', fontWeight: '600', fontSize: '1.2rem', display: 'inline-block', marginTop: '10px' }}>careers@moneyratna.com</a><br />
                and we will contact you if a suitable position opens up.
              </p>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default CareersPage;
