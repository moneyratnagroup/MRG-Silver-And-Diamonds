import React from 'react';
import { Link } from 'react-router-dom';
import './SplitGateway.css';

const SplitGateway = () => {
  return (
    <section className="split-gateway-section">
      <Link to="/products?collection=silver" className="split-col silver-col">
        <img 
          src="/silver_collection_mood.png" 
          alt="The Silver Collection" 
          className="split-image" 
          loading="lazy"
        />
        <div className="split-overlay"></div>
        <div className="split-content">
          <h2 className="split-title">The Silver Collection</h2>
          <button className="split-btn">Explore Silver</button>
        </div>
      </Link>

      <Link to="/products?collection=diamond" className="split-col diamond-col">
        <img 
          src="/diamond_collection_mood.png" 
          alt="The Diamond Collection" 
          className="split-image" 
          loading="lazy"
        />
        <div className="split-overlay"></div>
        <div className="split-content">
          <h2 className="split-title">The Diamond Collection</h2>
          <button className="split-btn">Explore Diamonds</button>
        </div>
      </Link>
    </section>
  );
};

export default SplitGateway;
