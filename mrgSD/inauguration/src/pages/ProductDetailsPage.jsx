import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ChevronLeft } from 'lucide-react';
import './ProductDetails.css';
import imgbislogo from '../assets/bis_logo.webp';

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, isEcommerceEnabled } = useShop();
  const [product, setProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const handleEnquire = () => {
    const phoneNumber = '917025925916'; // +91 7025925916
    const message = `Hi, I would like to know more about ${product.name} that I saw on your website.`;
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
                    <img loading="lazy" src={img} alt={`View ${idx + 1}`} className="pd-thumbnail-img" />
                  </div>
                )) : (
                  <div className="pd-thumbnail-container active">
                    <img loading="lazy" src={product.img} alt="View 1" className="pd-thumbnail-img" />
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
            </div>

            <div className="pd-description">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0 }}>Description</h3>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <p
                  className={`pd-desc-text ${!isDescExpanded ? 'pd-desc-clamped' : ''}`}
                  onClick={() => !isDescExpanded && setIsDescExpanded(true)}
                  title={!isDescExpanded ? "Click to expand" : ""}
                >
                  {product.desc || 'An exquisite piece crafted with precision and care, perfect for elevating any occasion. We have meticulously designed this piece to offer timeless elegance and superior comfort.'}
                </p>
                {isDescExpanded && (
                  <button
                    onClick={() => setIsDescExpanded(false)}
                    style={{ background: 'none', border: 'none', color: '#B89146', textDecoration: 'underline', cursor: 'pointer', padding: '0', fontSize: '0.85rem', fontWeight: '600', marginTop: '5px' }}
                  >
                    show less
                  </button>
                )}
              </div>
            </div>

            <div className="pd-actions" style={{ display: 'flex', gap: '10px', width: '100%', flexWrap: 'wrap' }}>

              <button className="btn-buy-now-large" onClick={handleEnquire} style={{ flex: '1 1 100%', backgroundColor: '#25D366', color: 'white', borderColor: '#25D366' }}>
                Enquire on WhatsApp
              </button>
            </div>

            {/* Trust Badges */}
            <div style={{ display: 'flex', gap: '15px', marginTop: '20px', padding: '15px 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#333' }}>
                <img loading="lazy" src={imgbislogo} alt="BIS Hallmark" style={{ width: '32px', height: 'auto', objectFit: 'contain' }} />
                100% BIS Hallmarked
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#333' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B89146" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m16 10-4 4-2-2" /></svg>
                Certified Diamonds
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#333' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B89146" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                Secure Checkout
              </div>
            </div>

            <div className="pd-additional-info" style={{ marginTop: '20px' }}>

              <div className="pd-info-block">
                <h4>Material & Care</h4>
                <p>Keep away from moisture and harsh chemicals. Store in the provided box when not in use to prevent tarnishing.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
