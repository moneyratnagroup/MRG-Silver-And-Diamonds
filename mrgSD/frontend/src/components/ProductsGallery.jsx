import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './ProductsGallery.css';
import { useNavigate } from 'react-router-dom';
import braceletImg from '../assets/silver_charm_bracelet.webp';

const ProductsGallery = ({ title = "Our Collection", tagline, products = [], filterComponent = null, sidebarComponent = null }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist, addToCart } = useShop();



  // Mock array for skeleton placeholders
  const placeholders = [1, 2, 3];

  const calculateDiscount = (original, selling) => {
    if (!original || !selling) return null;
    const origVal = parseFloat(original.replace(/[^\d.]/g, ''));
    const sellVal = parseFloat(selling.replace(/[^\d.]/g, ''));
    if (origVal > sellVal) {
      return Math.round(((origVal - sellVal) / origVal) * 100);
    }
    return null;
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <section className="products-gallery-section">
      {(title || tagline) && (
        <div className="pg-header">
          {title && (
            <div className="pg-title-with-lines">
              <div className="pg-line"></div>
              <Sparkles size={12} color="#890206" className="pg-sparkle" />
              <h2 className="global-subheading">{title}</h2>
              <Sparkles size={12} color="#890206" className="pg-sparkle" />
              <div className="pg-line"></div>
            </div>
          )}
          {tagline && <p className="pg-tagline">{tagline}</p>}
        </div>
      )}

      {filterComponent && (
        <div className="pg-filter-container">
          {filterComponent}
        </div>
      )}

      <div className={`pg-layout-container ${sidebarComponent ? 'with-sidebar' : ''}`} style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
        {sidebarComponent && (
          <div className="pg-sidebar" style={{ width: '250px', flexShrink: 0, position: 'sticky', top: '100px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', paddingRight: '10px' }}>
            {sidebarComponent}
          </div>
        )}
        <div className="pg-grid-wrapper" style={{ flexGrow: 1 }}>
          <div className="pg-grid">
            {products.length > 0 ? (
              products.map((product) => (
                <div className="pg-card" key={product.id}>
                  <div className="pg-image-container" onClick={() => handleProductClick(product)} style={{ cursor: 'pointer' }}>
                    {product.originalPrice && calculateDiscount(product.originalPrice, product.price) && (
                      <span className="pg-discount-badge">
                        {calculateDiscount(product.originalPrice, product.price)}% OFF
                      </span>
                    )}
                    <img loading="lazy" src={product.img} alt={product.name} className="pg-image" />
                    <button className="pg-wishlist-btn" aria-label="Add to Wishlist" onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isInWishlist(product.id) ? "#e53e3e" : "none"} stroke={isInWishlist(product.id) ? "#e53e3e" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                  </div>
                  <div className="pg-details">
                    <h3 className="pg-item-name">{product.name}</h3>
                    <div className="pg-price-container">
                      <p className="pg-item-price">{product.price}</p>
                      {product.originalPrice && (
                        <p className="pg-item-original-price">{product.originalPrice}</p>
                      )}
                    </div>
                    <button 
                      className="pg-add-to-cart" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        addToCart(product); 
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            ) : (
              placeholders.map((item) => (
                <div className="pg-card skeleton-card" key={item}>
                  <div className="pg-image-container skeleton-img"></div>
                  <div className="pg-details">
                    <div className="skeleton-text skeleton-title"></div>
                    <div className="skeleton-text skeleton-price"></div>
                    <div className="skeleton-btn"></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </section>
  );
};

export default ProductsGallery;
