import React from 'react';
import { Container } from 'react-bootstrap';
import './CareersPage.css';
import imgcarebg from '../assets/elegant_jewellery_bg.jpg';

const CareersPage = () => {
  return (
    <div className="careers-page-wrapper">
      {/* Hero Banner Section */}
      <section className="careers-hero">
        <div className="careers-hero-image">
          <img loading="lazy" src={imgcarebg} alt="Careers at Moneyratna" />
        </div>
        <div className="careers-hero-overlay">
          <h1 className="careers-title">Join Our Legacy</h1>
          <p className="careers-subtitle">Craft a brilliant career with Moneyratna Jewellery</p>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="why-join-us">
        <Container>
          <div className="section-header">
            <h2 className="section-title">Why Moneyratna?</h2>
            <p className="section-subtitle">
              We believe in nurturing talent and passion. Join a team where your craft is valued, and excellence is the standard.
            </p>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">✦</div>
              <h3 className="benefit-title">Craftsmanship</h3>
              <p className="benefit-text">Work alongside master artisans and visionaries who are pushing the boundaries of jewellery design.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">✧</div>
              <h3 className="benefit-title">Growth</h3>
              <p className="benefit-text">We invest in your potential with continuous learning opportunities and clear paths for career advancement.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">✦</div>
              <h3 className="benefit-title">Culture</h3>
              <p className="benefit-text">Experience a collaborative, inclusive environment where every voice matters and creativity thrives.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Openings Section */}
      <section className="openings-section">
        <Container>
          <div className="empty-state-box">
            <h3 className="empty-title">Current Openings</h3>
            <p className="empty-desc">
              We are currently at full capacity and do not have any open positions. However, we are always on the lookout for extraordinary talent.
            </p>
            <hr className="contact-hr" />
            <p className="resume-prompt">
              Think you'd be a great fit? Send us your resume and portfolio.
              <br />
              <a href="mailto:careers@moneyratna.com" className="email-link">careers@moneyratna.com</a>
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default CareersPage;
