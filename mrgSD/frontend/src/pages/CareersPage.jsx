import React from 'react';
import { Container } from 'react-bootstrap';
import './CareersPage.css';
import careerHero1 from '../assets/career_hero1.webp';

const CareersPage = () => {
  return (
    <div className="careers-page-wrapper">
      {/* Hero Banner Section */}
      <section className="careers-hero-banner-section">
        <img 
          src={careerHero1} 
          alt="Artisan handcrafting fine jewellery at Moneyratna" 
          className="careers-hero-banner-img"
        />
        <div className="careers-hero-content-overlay">
          <div className="careers-hero-left-content">
            <p className="careers-hero-eyebrow">PEOPLE CRAFTING BRIGHTER TOMORROWS</p>
            <h1 className="careers-hero-title">
              Join Our <span className="careers-title-accent">Legacy</span>
            </h1>
            <p className="careers-hero-desc">
              Build a meaningful career with Moneyratna Jewellery, where tradition, talent and innovation come together to create timeless beauty.
            </p>
            <button 
              className="careers-hero-btn"
              onClick={() => {
                const el = document.getElementById('careers-why-join');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>EXPLORE OPPORTUNITIES</span>
              <span className="hero-btn-arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section id="careers-why-join" className="why-join-us">
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
