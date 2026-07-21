import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import './ProductsGallery.css';
import braceletImg from '../assets/silver_charm_bracelet.png';

const ProductsGallery = ({ title = "Our Collection", tagline, products = [] }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { addToCart, toggleWishlist, isInWishlist } = useShop();



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

  const openModal = (product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    setSelectedProduct(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <section className="products-gallery-section">
      <div className="pg-header">
        <h2 className="pg-title">{title}</h2>
        {tagline && <p className="pg-tagline">{tagline}</p>}
      </div>

      <div className="pg-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div className="pg-card" key={product.id}>
              <div className="pg-image-container" onClick={() => openModal(product)} style={{cursor: 'pointer'}}>
                {product.originalPrice && calculateDiscount(product.originalPrice, product.price) && (
                  <span className="pg-discount-badge">
                    {calculateDiscount(product.originalPrice, product.price)}% OFF
                  </span>
                )}
                <img src={product.img} alt={product.name} className="pg-image" />
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
                <button className="pg-add-to-cart" onClick={(e) => { e.stopPropagation(); addToCart(product); }}>Add to Cart</button>
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

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <div className="product-modal-overlay" onClick={closeModal}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal} aria-label="Close modal">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="modal-left">
              <div className="modal-image-gallery">
                <div className="modal-thumbnails">
                  {selectedProduct.images.map((img, idx) => (
                    <div 
                      key={idx} 
                      className={`thumbnail-container ${activeImageIndex === idx ? 'active' : ''}`}
                      onClick={() => setActiveImageIndex(idx)}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="thumbnail-img" />
                    </div>
                  ))}
                </div>
                <div className="modal-main-image-container">
                  <img 
                    src={selectedProduct.images[activeImageIndex]} 
                    alt={selectedProduct.name} 
                    className="modal-main-image" 
                  />
                </div>
              </div>
              <div className="modal-category left-aligned-category">
                <span className="category-label">Category:</span> {selectedProduct.category}
              </div>
            </div>

            <div className="modal-right">
              <h2 className="modal-product-name">{selectedProduct.name}</h2>
              <div className="modal-price-container">
                <p className="modal-product-price">{selectedProduct.price}</p>
                {selectedProduct.originalPrice && (
                  <p className="modal-product-original-price">{selectedProduct.originalPrice}</p>
                )}
              </div>
              <p className="modal-product-desc">{selectedProduct.desc}</p>
              
              <div className="modal-actions">
                <button className="btn-add-cart" onClick={() => addToCart(selectedProduct)}>Add to Cart</button>
                <button className="btn-buy-now">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductsGallery;
