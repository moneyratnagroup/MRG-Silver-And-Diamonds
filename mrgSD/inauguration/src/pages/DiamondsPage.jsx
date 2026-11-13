import React from 'react';

import DiamondGallery from '../components/DiamondGallery';
import { CURATED_DIAMOND_PRODUCTS } from '../context/ShopContext';
import './DiamondsPage.css';

// Import images
import neyraHeroCleanBg from '../assets/neyra_hero_clean_bg.jpg';
import simpleDiamondShowcase from '../assets/simple_diamond_jewellery_showcase.webp';

const DiamondsPage = () => {
  const displayProducts = CURATED_DIAMOND_PRODUCTS;
  const showLanding = true;

  return (
    <div className="diamonds-page-wrapper">
      
      {showLanding && (
        <>
          {/* Hero Section */}
          <section className="diamond-hero-banner-section">
            <img 
              src={neyraHeroCleanBg} 
              alt="NEYRA - The Diamond Collection" 
              className="diamond-hero-banner-img"
            />
            <div className="diamond-hero-overlay-content">
              <p className="diamond-hero-eyebrow">ETHICALLY SOURCED • FLAWLESS CUT • CERTIFIED</p>
              
              <div className="neyra-brand-header">
                <span className="neyra-brand-sparkle">✦</span>
                <span className="neyra-brand-title">N E Y R A</span>
                <span className="neyra-brand-sparkle">✦</span>
              </div>
              
              <p className="neyra-brand-subtitle">THE DIAMOND COLLECTION</p>
              
              <h1 className="diamond-hero-title">
                Brilliance that lasts<br className="hero-desktop-br" />for generations
              </h1>
              
              <button 
                className="diamond-hero-btn"
                onClick={() => {
                  const el = document.getElementById('diamonds-collection-start');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>EXPLORE THE COLLECTION</span>
                <span className="hero-btn-arrow">→</span>
              </button>
            </div>
          </section>

          {/* Marquee Banner */}
          <div className="gorings-marquee">
            <div className="gorings-marquee-content">
              <span>✦ 100% CERTIFIED NATURAL DIAMONDS</span>
              <span>✦ LIFETIME EXCHANGE & BUYBACK GUARANTEE</span>
              <span>✦ COMPLIMENTARY INSURED SHIPPING</span>
              <span>✦ ETHICALLY SOURCED</span>
              <span>✦ 100% CERTIFIED NATURAL DIAMONDS</span>
              <span>✦ LIFETIME EXCHANGE & BUYBACK GUARANTEE</span>
              <span>✦ COMPLIMENTARY INSURED SHIPPING</span>
              <span>✦ ETHICALLY SOURCED</span>
            </div>
          </div>
        </>
      )}

      {/* Collection Grid */}
      <section id="diamonds-collection-start" className="container" style={{maxWidth: '1400px', margin: '0 auto', padding: '0 2rem'}}>
        <DiamondGallery 
          products={displayProducts} 
          title="All Diamond Jewelry" 
          tagline="Explore our exclusive All Diamonds jewelry."
          disableSidebarScroll={true}
        />
      </section>

      {showLanding && (
        <section className="neyra-solitaire-story-section">
          <div className="neyra-solitaire-container">
            {/* Left Column: Solitaire Narrative & Craft Features */}
            <div className="neyra-solitaire-text-col">
              <div className="neyra-solitaire-eyebrow">
                <span>THE NEYRA SIGNATURE</span>
              </div>

              <h2 className="neyra-solitaire-headline">
                The Solitaire Story<br />
                <span className="neyra-solitaire-headline-italic">A Lifetime of Radiance</span>
              </h2>

              <p className="neyra-solitaire-description">
                Hand-selected for unmatched clarity and fire, each NEYRA solitaire diamond is custom-set in hallmarked gold and platinum. A timeless emblem of commitment, designed to illuminate life’s defining moments.
              </p>

              {/* Solitaire Craft Highlights */}
              <div className="neyra-solitaire-features">
                <div className="solitaire-feature-item">
                  <div className="feature-text">
                    <strong>100% Certified Natural</strong>
                    <span>Individually certified by world-recognized gemological laboratories</span>
                  </div>
                </div>
                <div className="solitaire-feature-item">
                  <div className="feature-text">
                    <strong>Precision Cut &amp; Proportions</strong>
                    <span>Expertly faceted to maximize brilliance, scintillation, and fire</span>
                  </div>
                </div>
                <div className="solitaire-feature-item">
                  <div className="feature-text">
                    <strong>Lifetime Buyback &amp; Care</strong>
                    <span>Complimentary prong inspection, ultrasonic cleaning, and full exchange guarantee</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Solitaire Showcase */}
            <div className="neyra-solitaire-visual-col">
              <div className="neyra-solitaire-image-wrapper">
                <img 
                  src={simpleDiamondShowcase} 
                  alt="NEYRA Solitaire Diamond Pendant & Stud Earrings on Midnight Silk" 
                  className="neyra-solitaire-main-img"
                  loading="lazy"
                />
                <div className="neyra-solitaire-glints" aria-hidden="true">
                  <span className="diamond-glint glint-solitaire-crown"><span className="diamond-glint-core" /></span>
                  <span className="diamond-glint glint-solitaire-side-gem"><span className="diamond-glint-core" /></span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

          </div>
  );
};

export default DiamondsPage;
