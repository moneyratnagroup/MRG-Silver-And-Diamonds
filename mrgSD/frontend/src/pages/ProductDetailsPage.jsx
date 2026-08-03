import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ChevronLeft } from 'lucide-react';
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
          
          <div className="pd-actions">
            <button className="btn-add-cart-large" onClick={() => addToCart(product)}>Add to Cart</button>
            <button className="btn-buy-now-large">Buy Now</button>
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
    </div>
  );
};

export default ProductDetailsPage;
