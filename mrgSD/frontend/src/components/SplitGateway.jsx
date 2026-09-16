import React from 'react';
import { Link } from 'react-router-dom';
import './SplitGateway.css';
import imgdiamondcollectionmood from '../assets/diamond_collection_mood.webp';
import imgGoldCollection from '../assets/Gold_Collection.webp';
import imgsilvercollectionmood from '../assets/silver_collection_mood.webp';

const SplitGateway = () => {
  const renderCards = () => (
    <>
      <Link to="/gold/all" className="editorial-card gold-card">
        <img 
          src={imgGoldCollection} 
          alt="The Gold Collection" 
          className="editorial-image" 
          loading="lazy"
        />
        <div className="editorial-overlay"></div>
        <div className="editorial-content-top">
          <p className="ed-subtitle">PURE & TIMELESS</p>
          <h3 className="ed-title">GOLD</h3>
          <span className="ed-cursive">collection</span>
        </div>
        <div className="editorial-content-bottom">
          <p className="ed-subcaption">CRAFTED FOR ROYALTY</p>
          <span className="ed-cta">SHOP THE COLLECTION</span>
        </div>
      </Link>

      <Link to="/silver/all" className="editorial-card silver-card">
        <img 
          src={imgsilvercollectionmood} 
          alt="The Silver Collection" 
          className="editorial-image" 
          loading="lazy"
        />
        <div className="editorial-overlay"></div>
        <div className="editorial-content-top">
          <p className="ed-subtitle">TRENDING NOW</p>
          <h3 className="ed-title">SILVER</h3>
          <span className="ed-cursive">jewels</span>
        </div>
        <div className="editorial-content-bottom">
          <p className="ed-subcaption">TIMELESS STYLES FOR YOU</p>
          <span className="ed-cta">SHOP THE COLLECTION</span>
        </div>
      </Link>

      <Link to="/diamonds/all" className="editorial-card diamond-card">
        <img 
          src={imgdiamondcollectionmood} 
          alt="The Diamond Collection" 
          className="editorial-image" 
          loading="lazy"
        />
        <div className="editorial-overlay"></div>
        <div className="editorial-content-top">
          <p className="ed-subtitle">ELEVATE YOUR</p>
          <h3 className="ed-title">DIAMOND</h3>
          <span className="ed-cursive">elegance</span>
        </div>
        <div className="editorial-content-bottom">
          <p className="ed-subcaption">DESIGN PIECES, JUST FOR YOU</p>
          <span className="ed-cta">SHOP THE COLLECTION</span>
        </div>
      </Link>
    </>
  );

  return (
    <section className="editorial-gateway-section">
      <div className="editorial-gateway-header">
        <h2 className="editorial-gateway-heading">Discover Our Collections</h2>
      </div>
      
      <div className="editorial-gateway-grid">
        <div className="editorial-gateway-track">
          <div className="editorial-gateway-card-group">
            {renderCards()}
          </div>
          <div className="editorial-gateway-card-group duplicate-group">
            {renderCards()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SplitGateway;
