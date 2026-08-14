import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import './DiamondGallery.css';

const DiamondGallery = ({ products = [], title }) => {
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="minimal-gallery-wrapper">
      <div className="minimal-gallery-header">
        <h2 className="minimal-gallery-title">{title || 'FINE JEWELRY MADE RESPONSIBLY'}</h2>
        <div className="minimal-gallery-nav">
          <button className="minimal-nav-btn"><ChevronLeft size={16} strokeWidth={1} /></button>
          <button className="minimal-nav-btn"><ChevronRight size={16} strokeWidth={1} /></button>
        </div>
      </div>

      <div className="minimal-gallery-grid">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div className="pg-card" key={product.id}>
              
              <div className="pg-image-container" onClick={() => handleProductClick(product)} style={{cursor: 'pointer'}}>
                {(index % 3 === 0 || index % 2 === 0) && (
                  <span className="pg-discount-badge" style={{ backgroundColor: index % 3 === 0 ? '#1a1a1a' : '#a84c19' }}>
                    {index % 3 === 0 ? 'NEW IN' : 'BACK IN STOCK'}
                  </span>
                )}
                
                <button className="pg-wishlist-btn" aria-label="Add to Wishlist">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
                
                <img src={product.img} alt={product.name} className="pg-image" />
              </div>
              
              <div className="pg-details">
                <h3 className="pg-item-name">{product.name}</h3>
                <div className="pg-price-container">
                  <p className="pg-item-price">
                    {product.price.includes('$') || product.price.includes('€') || product.price.includes('£') ? product.price : `€${product.price}`}
                  </p>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="minimal-empty-state">
            <p>No products found in this collection.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiamondGallery;
