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

      <div className="aesthetic-gallery-grid">
        {products.length > 0 ? (
          products.map((product, index) => {
            const styleClass = `style-${index % 6}`;
            
            // Subtitles based on index for variety
            const subtitles = [
              "Trending Now",
              "New Arrival",
              "Minimalist",
              "Aesthetic",
              "Bestseller",
              "Elevate Your Everyday"
            ];
            
            // Button texts based on index
            const buttonTexts = [
              "Discover",
              "Collect Now",
              "Shop Less Is More",
              "Discover More",
              "Shop The Look",
              "Shop The Collection"
            ];

            return (
              <div 
                className={`aesthetic-card ${styleClass}`} 
                key={product.id}
                onClick={() => handleProductClick(product)}
              >
                <div className="aesthetic-top-text">
                  <span className="aesthetic-subtitle">{subtitles[index % 6]}</span>
                  <h3 className="aesthetic-title">{product.name}</h3>
                  <span className="aesthetic-price">
                    {product.price.includes('$') || product.price.includes('€') || product.price.includes('£') ? product.price : `€${product.price}`}
                  </span>
                </div>
                
                <div className="aesthetic-image-wrapper">
                  <img src={product.img} alt={product.name} />
                </div>
                
                <button className="aesthetic-btn">
                  {buttonTexts[index % 6]}
                </button>
              </div>
            );
          })
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
