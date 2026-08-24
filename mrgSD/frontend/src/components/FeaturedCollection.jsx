import React from 'react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import './ProductsGallery.css'; // Reusing the exact same styling as requested
import braceletImg from '../assets/silver_charm_bracelet.png';

const FeaturedCollection = () => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist, addToCart } = useShop();

  // Mock data for the first populated product
  const sampleProduct = {
    id: 1,
    name: "Classic Silver Charm Bracelet",
    originalPrice: "₹2,999",
    price: "₹2,499",
    img: braceletImg,
    images: [
      braceletImg, // front view
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600", // side view
      "https://images.unsplash.com/photo-1599643478514-4a1101858ff6?auto=format&fit=crop&q=80&w=600", // on human body
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600" // certificate
    ],
    category: "Bracelets",
    desc: "A timeless sterling silver charm bracelet perfect for any occasion. Elegantly designed to hold your most precious memories."
  };

  // We need 8 items total. 1 populated, 7 skeletons.
  const placeholders = [1, 2, 3, 4, 5, 6, 7];

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
    <section className="products-gallery-section" style={{ backgroundColor: '#ffffff' }}>
      <div className="pg-header">
        <h2 className="pg-title">Featured Collection</h2>
        <p className="pg-tagline">
          Handpicked silver jewellery crafted to celebrate elegance, tradition, and everyday beauty.
        </p>
      </div>

      <div className="pg-grid">
        {/* Sample Fully Populated Product Card */}
        <div className="pg-card">
          <div className="pg-image-container" onClick={() => handleProductClick(sampleProduct)} style={{cursor: 'pointer'}}>
            {sampleProduct.originalPrice && calculateDiscount(sampleProduct.originalPrice, sampleProduct.price) && (
              <span className="pg-discount-badge">
                {calculateDiscount(sampleProduct.originalPrice, sampleProduct.price)}% OFF
              </span>
            )}
            <img src={sampleProduct.img} alt={sampleProduct.name} className="pg-image" />
            <button className="pg-wishlist-btn" aria-label="Add to Wishlist" onClick={(e) => { e.stopPropagation(); toggleWishlist(sampleProduct); }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isInWishlist(sampleProduct.id) ? "#e53e3e" : "none"} stroke={isInWishlist(sampleProduct.id) ? "#e53e3e" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
          <div className="pg-details">
            <h3 className="pg-item-name">{sampleProduct.name}</h3>
            <div className="pg-price-container">
              <p className="pg-item-price">{sampleProduct.price}</p>
              {sampleProduct.originalPrice && (
                <p className="pg-item-original-price">{sampleProduct.originalPrice}</p>
              )}
            </div>
            <button 
              className="pg-add-to-cart" 
              onClick={(e) => { 
                e.stopPropagation(); 
                addToCart(sampleProduct); 
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Skeleton Placeholders for the remaining 7 items */}
        {placeholders.map((item) => (
          <div className="pg-card skeleton-card" key={item}>
            <div className="pg-image-container skeleton-img"></div>
            <div className="pg-details">
              <div className="skeleton-text skeleton-title"></div>
              <div className="skeleton-text skeleton-price"></div>
              <div className="skeleton-btn"></div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default FeaturedCollection;
