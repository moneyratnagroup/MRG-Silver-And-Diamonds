import React from 'react';
import { useShop } from '../context/ShopContext';
import './MetalRatesBar.css';

const MetalRatesBar = () => {
  const { activeMetals, lastUpdated } = useShop();

  const displayMetals = activeMetals ? activeMetals.filter(m => m.metal_name.toLowerCase() !== 'copper') : [];

  if (!displayMetals || displayMetals.length === 0) return null;

  const renderMetals = (isDuplicate = false) => (
    <>
      {displayMetals.map((metal) => (
        <React.Fragment key={`${metal.metal_name}${isDuplicate ? '-dup' : ''}`}>
          <div className={`rate-item ${metal.metal_type.toLowerCase()}`}>
            <span className="rate-label">{metal.purity === 'Bullion' ? metal.metal_type + ' Bullion' : `${metal.purity} ${metal.metal_type}`}:</span>
            <span className="rate-value">₹{metal.rate} / {metal.unit}</span>
          </div>
          <div className="rate-divider"></div>
        </React.Fragment>
      ))}
    </>
  );

  return (
    <div className="metal-rates-bar">
      <div className="rates-container">
        <div className="rates-marquee-content">
          {renderMetals()}
          <div className="rate-info desktop-only">
            <span className="rate-updated">Last Updated: {lastUpdated}</span>
          </div>
        </div>
        
        {/* Duplicate for mobile marquee */}
        <div className="rates-marquee-content mobile-tab-only" aria-hidden="true">
          {renderMetals(true)}
        </div>
      </div>
    </div>
  );
};

export default MetalRatesBar;
