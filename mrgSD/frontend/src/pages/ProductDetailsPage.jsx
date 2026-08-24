import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ChevronLeft, X } from 'lucide-react';
import ProductsGallery from '../components/ProductsGallery';
import './ProductDetails.css';

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useShop();
  const [product, setProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [showPriceBreakup, setShowPriceBreakup] = useState(false);
  const [showAppModal, setShowAppModal] = useState(false);

  const handleEnquire = () => {
    const phoneNumber = '+919876543210'; // Default number as per plan
    const message = `Hi, I would like to know more about ${product.name} (Price: ${product.price}) that I saw on your website.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // Find product in context based on ID
    if (products && products.length > 0) {
      const foundProduct = products.find(p => p.id.toString() === productId);
      setProduct(foundProduct);
    }
  }, [productId, products]);

  if (!product) {
    return (
      <div className="product-details-container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <button className="btn-back-to-shop" onClick={() => navigate(-1)} style={{ marginTop: '20px', padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px' }}>
          Go Back
        </button>
      </div>
    );
  }

  // Determine similar products
  let similarProducts = [];
  if (product && products) {
    similarProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
    // If not enough similar products in the same category, fill with others
    if (similarProducts.length < 4) {
      const moreProducts = products.filter(p => p.id !== product.id && !similarProducts.find(s => s.id === p.id));
      similarProducts = [...similarProducts, ...moreProducts].slice(0, 4);
    }
  }

  return (
    <div className="product-details-page-wrapper">
      <div className="product-details-container">
      <div className="product-details-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <ChevronLeft size={20} /> Back
        </button>
      </div>
      
      <div className="product-details-content">
        <div className="product-details-left">
          <div className="pd-image-gallery">
            <div className="pd-thumbnails">
              {product.images ? product.images.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`pd-thumbnail-container ${activeImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="pd-thumbnail-img" />
                </div>
              )) : (
                <div className="pd-thumbnail-container active">
                  <img src={product.img} alt="View 1" className="pd-thumbnail-img" />
                </div>
              )}
            </div>
            <div className="pd-main-image-container">
              <img 
                src={product.images ? product.images[activeImageIndex] : product.img} 
                alt={product.name} 
                className="pd-main-image" 
              />
            </div>
          </div>
        </div>

        <div className="product-details-right">
          <div className="pd-category">
            <span className="pd-category-label">Category:</span> {product.category || 'Jewelry'}
          </div>
          <h1 className="pd-product-name">{product.name}</h1>
          <div className="pd-price-wrapper">
            <div className="pd-price-container">
              <p className="pd-product-price">{product.price}</p>
              {product.originalPrice && (
                <p className="pd-product-original-price">{product.originalPrice}</p>
              )}
            </div>
            <button 
              className="btn-price-breakup"
              onClick={() => setShowPriceBreakup(!showPriceBreakup)}
            >
              {showPriceBreakup ? 'Hide Price Breakup' : 'View Price Breakup'}
            </button>
            
            {showPriceBreakup && (
              <div className="pd-price-breakup-table">
                <div className="pd-breakup-row">
                  <span>Silver Weight & Rate</span>
                  <span>₹1,200</span>
                </div>
                <div className="pd-breakup-row">
                  <span>Stone / Diamond Value</span>
                  <span>₹800</span>
                </div>
                <div className="pd-breakup-row">
                  <span>Making Charges</span>
                  <span>₹450</span>
                </div>
                <div className="pd-breakup-row">
                  <span>GST (3%)</span>
                  <span>₹75</span>
                </div>
                <div className="pd-breakup-row total-row">
                  <span>Total</span>
                  <span>{product.price}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="pd-description">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: 0 }}>Description</h3>
              <button 
                onClick={() => setShowFullDetails(!showFullDetails)}
                style={{ background: 'none', border: 'none', color: '#B89146', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: '0.9rem', fontWeight: '500' }}
              >
                {showFullDetails ? 'Hide Details' : 'View Full Details'}
              </button>
            </div>
            <p>{product.desc || 'An exquisite piece crafted with precision and care, perfect for elevating any occasion. We have meticulously designed this piece to offer timeless elegance and superior comfort.'}</p>
            
            {showFullDetails && (
              <div className="pd-expanded-details">
                <div className="pd-specs-grid">
                  <div className="pd-spec-item"><span className="pd-spec-label">Material:</span> <span className="pd-spec-value">Premium 92.5 Sterling Silver</span></div>
                  <div className="pd-spec-item"><span className="pd-spec-label">Finish:</span> <span className="pd-spec-value">High Polish Anti-Tarnish Rhodium</span></div>
                  <div className="pd-spec-item"><span className="pd-spec-label">Weight:</span> <span className="pd-spec-value">{product.weight || 'Approx 15g'}</span></div>
                  <div className="pd-spec-item"><span className="pd-spec-label">Dimensions:</span> <span className="pd-spec-value">{product.dimensions || 'Standard Fit'}</span></div>
                  <div className="pd-spec-item"><span className="pd-spec-label">Purity:</span> <span className="pd-spec-value">Certified 925 Silver</span></div>
                  <div className="pd-spec-item"><span className="pd-spec-label">Packaging:</span> <span className="pd-spec-value">Signature Moneyratna Velvet Box</span></div>
                </div>
                <div className="pd-story-section">
                  <h4>The Story</h4>
                  <p>Every piece in our collection is thoughtfully designed to blend traditional elegance with contemporary style. Handcrafted by master artisans, this piece undergoes rigorous quality checks to ensure aesthetic perfection and durability.</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="pd-actions" style={{ display: 'flex', gap: '10px', width: '100%', flexWrap: 'wrap' }}>
            <button className="btn-add-cart-large" onClick={() => addToCart(product)} style={{ flex: '1 1 45%' }}>
              Add to Cart
            </button>
            <button className="btn-buy-now-large" onClick={() => addToCart(product)} style={{ flex: '1 1 45%' }}>
              Buy Now
            </button>
            <button className="btn-buy-now-large" onClick={handleEnquire} style={{ flex: '1 1 100%', backgroundColor: '#25D366', color: 'white', borderColor: '#25D366' }}>
              Enquire on WhatsApp
            </button>
          </div>
          
          <div className="pd-additional-info">
            <div className="pd-info-block">
              <h4>Shipping & Returns</h4>
              <p>Free standard shipping on all orders over ₹2000. Returns accepted within 14 days of delivery.</p>
            </div>
            <div className="pd-info-block">
              <h4>Material & Care</h4>
              <p>Keep away from moisture and harsh chemicals. Store in the provided box when not in use to prevent tarnishing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
      {similarProducts.length > 0 && (
        <div style={{ marginTop: '60px' }}>
          <ProductsGallery 
            title="Similar Products" 
            tagline="You may also like these exquisite pieces from our collection."
            products={similarProducts} 
          />
        </div>
      )}
      
      {showAppModal && (
        <div className="product-modal-overlay" onClick={() => setShowAppModal(false)} style={{ zIndex: 9999 }}>
          <div className="product-modal app-modal-container" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
            <button className="app-modal-close-btn" onClick={() => setShowAppModal(false)} aria-label="Close modal">
              <X size={22} />
            </button>
            
            <div className="app-modal-content-wrapper">
              <div className="app-modal-left">
                <h2>Ready to make this yours?</h2>
                <p>Get exclusive offers, faster checkout, and track your orders easily on the Moneyratna App.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px', width: '100%', maxWidth: '280px' }}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 25px', backgroundColor: '#000', color: '#fff', border: '1px solid #333', borderRadius: '10px', cursor: 'pointer', width: '100%', justifyContent: 'center' }}>
                    <svg width="22" height="26" viewBox="0 0 384 512" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.7rem', lineHeight: '1', color: '#ccc', marginBottom: '2px' }}>Download on the</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '600', lineHeight: '1' }}>App Store</div>
                    </div>
                  </button>
                  
                  <button style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 25px', backgroundColor: '#000', color: '#fff', border: '1px solid #333', borderRadius: '10px', cursor: 'pointer', width: '100%', justifyContent: 'center' }}>
                    <svg width="26" height="26" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#2196F3" d="M35.1 48c0-3.3 2.1-6.2 5.2-7.5L257.6 256 40.3 471.5C37.2 470.2 35.1 467.3 35.1 464V48z"/>
                      <path fill="#00E676" d="M40.3 40.5L347.1 204.3 257.6 256 40.3 40.5z"/>
                      <path fill="#FF3D00" d="M40.3 471.5L257.6 256l89.5 51.7L40.3 471.5z"/>
                      <path fill="#FFC107" d="M347.1 204.3L464 266.7c7.1 4 7.1 14.5 0 18.5L347.1 307.7l-89.5-51.7 89.5-51.7z"/>
                    </svg>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.7rem', lineHeight: '1', color: '#ccc', marginBottom: '2px' }}>GET IT ON</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '600', lineHeight: '1' }}>Google Play</div>
                    </div>
                  </button>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B89146', fontSize: '0.9rem', fontWeight: '500' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#B89146', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', fontStyle: 'italic', flexShrink: 0 }}>i</div>
                  <span>For iOS, use Organization Code: <strong style={{ letterSpacing: '1px' }}>JQTLL</strong></span>
                </div>
              </div>
              
              <div className="app-modal-right">
                <div style={{ width: '160px', height: '160px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                  <span style={{ fontWeight: '700', color: '#94a3b8', fontSize: '2rem', letterSpacing: '2px' }}>QR</span>
                </div>
                <p style={{ margin: 0, fontSize: '1rem', color: '#475569', textAlign: 'center', fontWeight: '500', maxWidth: '200px', lineHeight: '1.4' }}>Scan with your phone to download the app</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
