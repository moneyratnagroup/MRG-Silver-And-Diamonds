import React from 'react';
import { useShop } from '../context/ShopContext';
import './MetalRatesBar.css';

const MetalRatesBar = () => {
  const { metalRates } = useShop();

  return (
    <div className="metal-rates-bar">
      <div className="rates-container">
        <div className="rate-item gold">
          <span className="rate-label">22K Gold:</span>
          <span className="rate-value">{metalRates.gold22k} / g</span>
        </div>
        <div className="rate-divider"></div>
        <div className="rate-item gold">
          <span className="rate-label">24K Gold:</span>
          <span className="rate-value">{metalRates.gold24k} / g</span>
        </div>
        <div className="rate-divider"></div>
        <div className="rate-item silver">
          <span className="rate-label">Silver:</span>
          <span className="rate-value">{metalRates.silver} / g</span>
        </div>
        <div className="rate-divider"></div>
        <div className="rate-item silver">
          <span className="rate-label">99.9% Silver:</span>
          <span className="rate-value">{metalRates.silver999} / g</span>
        </div>
        <div className="rate-info desktop-only">
          <span className="rate-updated">Last Updated: {metalRates.lastUpdated}</span>
        </div>
      </div>
    </div>
  );
};

export default MetalRatesBar;
