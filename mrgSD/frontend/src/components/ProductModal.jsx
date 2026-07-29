import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import './ProductsGallery.css';

const ProductModal = ({ product, onClose }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { addToCart } = useShop();

  if (!product) return null;

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="modal-left">
          <div className="modal-image-gallery">
            <div className="modal-thumbnails">
              {product.images ? product.images.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`thumbnail-container ${activeImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="thumbnail-img" />
                </div>
              )) : (
                <div className="thumbnail-container active">
                  <img src={product.img} alt="View 1" className="thumbnail-img" />
                </div>
              )}
            </div>
            <div className="modal-main-image-container">
              <img 
                src={product.images ? product.images[activeImageIndex] : product.img} 
                alt={product.name} 
                className="modal-main-image" 
              />
            </div>
          </div>
          <div className="modal-category left-aligned-category">
            <span className="category-label">Category:</span> {product.category || 'Jewelry'}
          </div>
        </div>

        <div className="modal-right">
          <h2 className="modal-product-name">{product.name}</h2>
          <div className="modal-price-container">
            <p className="modal-product-price">{product.price}</p>
            {product.originalPrice && (
              <p className="modal-product-original-price">{product.originalPrice}</p>
            )}
          </div>
          <p className="modal-product-desc">{product.desc || 'An exquisite piece crafted with precision and care, perfect for elevating any occasion.'}</p>
          
          <div className="modal-actions">
            <button className="btn-add-cart" onClick={() => { addToCart(product); onClose(); }}>Add to Cart</button>
            <button className="btn-buy-now">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
