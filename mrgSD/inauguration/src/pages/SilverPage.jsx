import { hardcodedSilverProducts } from '../data/silverProducts';
import React from 'react';

import ProductsGallery from '../components/ProductsGallery';
import './SilverPage.css';

// Import images
import silverCraftRing from '../assets/silver_craft_ring.jpg';
import silverCraftGoldModel from '../assets/silver_craft_gold_model.jpg';
import silverCraftGoldChoker from '../assets/silver_craft_gold_choker.jpg';
import silverCraftSalemAnklet from '../assets/silver_craft_salem_anklet.jpg';

const SilverPage = () => {
  const displayProducts = hardcodedSilverProducts;
  const showLanding = true;

  return (
    <div className="silver-page-wrapper ivory-theme">

      {showLanding && (
        <>
          {/* Hero Section */}
          <section className="ivory-hero">
            <div className="ivory-hero-content">
              <span className="hero-subtitle hero-eyebrow">THE EIRA COLLECTION</span>
              <h1 className="ivory-title">EIRA</h1>
              <span className="hero-subtitle hero-tagline">SILVER, REIMAGINED.</span>
              <p className="hero-desc">
                Crafted in luminous 925 sterling silver. Modern heirlooms designed to make every day feel extraordinary.
              </p>
              <div className="hero-buttons">
                <button className="ivory-btn-solid">DISCOVER EIRA &rarr;</button>
                <button className="ivory-btn-outline">FIND MY STYLE</button>
              </div>
            </div>
            <div className="scroll-indicator">
              <span>SCROLL</span>
              <div className="scroll-arrow">&darr;</div>
            </div>
          </section>
        </>
      )}

      {/* Collection Grid */}
      <section id="silver-collection-start" className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem 0 0' }}>

        <ProductsGallery
          title=""
          tagline=""
          products={displayProducts}
          enablePagination={true}
          itemsPerPage={12}
          activeFiltersComponent={
            <div className="ivory-main-content-top">
              <div className="ivory-gallery-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0 1rem', marginBottom: '1rem' }}>
                <div className="ivory-header-left" style={{ flex: '1.2' }}>
                  <span className="hero-subtitle" style={{ color: '#650018', fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '0.5rem', display: 'block' }}>The Eira Collection: </span>
                  <h2 className="ivory-gallery-title" style={{ fontFamily: '"Cormorant Upright", serif', fontSize: '3.5rem', color: '#302A2A', fontWeight: '400', margin: '0', lineHeight: '1.1' }}>Made to catch the light.</h2>
                </div>
                <div className="ivory-header-right" style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}>
                  <p style={{ fontSize: '0.85rem', color: '#302A2A', lineHeight: '1.6', maxWidth: '450px', textAlign: 'left', marginBottom: '0' }}>From minimal everyday pieces to statement designs, explore our curated collection of 925 sterling silver jewellery.</p>
                </div>
              </div>

              <div className="ivory-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>

                  <span className="showing-pieces-text" style={{ fontSize: '0.85rem', color: '#6d5b53', fontWeight: '500' }}>
                    Showing {displayProducts.length} {displayProducts.length === 1 ? 'piece' : 'pieces'}
                  </span>
                </div>


              </div>
            </div>
          }
        />
      </section>



      {/* The Craft of Silver Section */}
      {showLanding && (
        <section className="silver-craft-section">
          <div className="silver-craft-container">
            {/* Left Column: Warm Ivory Text Side */}
            <div className="silver-craft-text-col">
              <h2 className="silver-craft-title">The Craft<br />of Silver</h2>
              <h3 className="silver-craft-subtitle">One pure metal.<br />Three timeless expressions.</h3>
              <p className="silver-craft-desc">
                925 Sterling Silver polished in Rhodium, dipped in 18K Gold Vermeil, and handcrafted by Salem silversmiths.
              </p>
            </div>

            {/* Right Column: Deep Burgundy Photo Collage */}
            <div className="silver-craft-visual-col">
              <div className="craft-photo-collage">
                <div className="craft-photo-card card-top-left">
                  <img src={silverCraftRing} alt="925 Silver Rhodium Solitaire Ring" loading="lazy" />
                </div>
                <div className="craft-photo-card card-top-right">
                  <img src={silverCraftGoldModel} alt="18K Gold Vermeil Model" loading="lazy" />
                </div>
                <div className="craft-photo-card card-bottom-left">
                  <img src={silverCraftGoldChoker} alt="Gold Plated Silver Choker" loading="lazy" />
                </div>
                <div className="craft-photo-card card-bottom-right">
                  <img src={silverCraftSalemAnklet} alt="Salem Traditional 925 Silver Anklet" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default SilverPage;
