import React from 'react';
import { Sparkles, ShoppingCart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import './ProductsGallery.css'; // Reusing the exact same styling as requested
import braceletImg from '../assets/silver_charm_bracelet.webp';

const FeaturedCollection = () => {
  const navigate = useNavigate();
  const { products, toggleWishlist, isInWishlist, addToCart } = useShop();

  const featuredProducts = products.filter(p => 
    p.collections && p.collections.some(c => 
      c.name.toLowerCase() === 'featured' || 
      c.name.toLowerCase() === 'featured collection'
    )
  ).slice(0, 8);



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
    <section className="products-gallery-section" style={{ backgroundColor: '#f8f6f0' }}>
      <div className="pg-header">
        <div className="pg-title-with-lines">
          <div className="pg-line"></div>
          <Sparkles size={12} color="#890206" className="pg-sparkle" />
          <h2 className="global-subheading">Featured Collection</h2>
          <Sparkles size={12} color="#890206" className="pg-sparkle" />
          <div className="pg-line"></div>
          <span className="pg-discover-more" onClick={() => navigate('/products')} style={{ cursor: 'pointer' }}>View All Products</span>
        </div>
        <p className="pg-tagline">
          Handpicked silver jewellery crafted to celebrate elegance, tradition, and everyday beauty.
        </p>
      </div>

      <div className="pg-grid">
        {featuredProducts.map((product) => (
          <div className="pg-card" key={product.id}>
            <div className="pg-image-container" onClick={() => handleProductClick(product)} style={{cursor: 'pointer'}}>
              {product.originalPrice && calculateDiscount(product.originalPrice, product.price) && (
                <span className="pg-discount-badge">
                  {calculateDiscount(product.originalPrice, product.price)}% OFF
                </span>
              )}
              <img loading="lazy" src={product.img || braceletImg} alt={product.name} className={`pg-image ${product.hoverImage ? 'primary-img' : ''}`} />
              {product.hoverImage && (
                <img loading="lazy" src={product.hoverImage} alt={`${product.name} hover`} className="pg-image hover-img" />
              )}
              <button className="pg-wishlist-btn" aria-label="Add to Wishlist" onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isInWishlist(product.id) ? "#e53e3e" : "none"} stroke={isInWishlist(product.id) ? "#e53e3e" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>
            <div className="pg-details">
              <div className="pg-info-left">
                <h3 className="pg-item-name">{product.name}</h3>
                <div className="pg-price-container">
                  <div className="pg-price-wrapper">
                    <p className="pg-item-price">{product.price}</p>
                    {product.originalPrice && (
                      <p className="pg-item-original-price">{product.originalPrice}</p>
                    )}
                  </div>
                </div>
              </div>
              <button 
                className="pg-add-to-cart-icon" 
                aria-label="Add to Cart"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  addToCart(product); 
                }}
              >
                <ShoppingCart size={18} strokeWidth={2} />
              </button>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default FeaturedCollection;
