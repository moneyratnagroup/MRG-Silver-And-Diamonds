import React, { useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import './MetalRatesBar.css';

const MetalRatesBar = () => {
  const { activeMetals, lastUpdated } = useShop();

  // Deduplicate by metal_name (keep latest) and exclude copper
  const displayMetals = useMemo(() => {
    if (!activeMetals || !Array.isArray(activeMetals)) return [];
    const metalMap = new Map();
    activeMetals.forEach(m => {
      if (m.metal_name && m.metal_name.toLowerCase() !== 'copper') {
        metalMap.set(m.metal_name.toLowerCase(), m);
      }
    });
    return Array.from(metalMap.values());
  }, [activeMetals]);

  if (!displayMetals || displayMetals.length === 0) return null;

  const renderMetals = (isDuplicate = false) => (
    <>
      {displayMetals.map((metal, index) => (
        <React.Fragment key={`${metal.id || metal.metal_name}-${isDuplicate ? 'dup' : 'orig'}-${index}`}>
          <div className={`rate-item ${metal.metal_type ? metal.metal_type.toLowerCase() : ''}`}>
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
