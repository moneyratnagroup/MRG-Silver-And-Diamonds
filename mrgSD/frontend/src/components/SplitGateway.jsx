import React from 'react';
import { Link } from 'react-router-dom';
import './SplitGateway.css';

const SplitGateway = () => {
  const renderCards = () => (
    <>
      <Link to="/products?collection=gold" className="editorial-card gold-card">
        <img 
          src="/Gold_Collection.png" 
          alt="The Gold Collection" 
          className="editorial-image" 
          loading="lazy"
        />
        <div className="editorial-overlay"></div>
        <div className="editorial-content">
          <h3 className="editorial-title">Gold</h3>
        </div>
      </Link>

      <Link to="/products?collection=silver" className="editorial-card silver-card">
        <img 
          src="/silver_collection_mood.png" 
          alt="The Silver Collection" 
          className="editorial-image" 
          loading="lazy"
        />
        <div className="editorial-overlay"></div>
        <div className="editorial-content">
          <h3 className="editorial-title">Silver</h3>
        </div>
      </Link>

      <Link to="/products?collection=diamond" className="editorial-card diamond-card">
        <img 
          src="/diamond_collection_mood.png" 
          alt="The Diamond Collection" 
          className="editorial-image" 
          loading="lazy"
        />
        <div className="editorial-overlay"></div>
        <div className="editorial-content">
          <h3 className="editorial-title">Diamond</h3>
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
