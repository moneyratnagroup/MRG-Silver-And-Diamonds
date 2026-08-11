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
            <div className="minimal-product-card" key={product.id}>
              
              <div className="minimal-image-container" onClick={() => handleProductClick(product)}>
                <span className="minimal-badge">
                  {index % 3 === 0 ? 'NEW IN' : index % 2 === 0 ? 'BACK IN STOCK' : ''}
                </span>
                
                <button className="minimal-favorite-btn">
                  <Heart size={16} strokeWidth={1.5} />
                </button>
                
                <img src={product.img} alt={product.name} className="minimal-product-image" />
              </div>
              
              <div className="minimal-product-info">
                <h3 className="minimal-product-name">{product.name}</h3>
                <p className="minimal-product-desc">
                  {product.material || '14k Yellow Gold'} & {product.metal || 'Lab Grown Diamonds'}
                </p>
                <span className="minimal-price">
                  {product.price.includes('$') || product.price.includes('€') || product.price.includes('£') ? product.price : `€${product.price}`}
                </span>
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
