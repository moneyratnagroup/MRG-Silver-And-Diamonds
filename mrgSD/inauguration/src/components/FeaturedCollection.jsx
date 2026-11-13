import React from 'react';
import { Sparkles } from 'lucide-react';
import { useShop, formatProductTitle } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import './ProductsGallery.css'; // Reusing the exact same styling as requested
import braceletImg from '../assets/silver_charm_bracelet.webp';

const FeaturedCollection = () => {
  const navigate = useNavigate();
  const { products, toggleWishlist, isInWishlist, addToCart, isEcommerceEnabled } = useShop();

  const featuredIds = [
    'gold-necklace-2',
    'diamond-1',
    'silver-5',
    'gold-bangle-1',
    'diamond-3',
    'silver-2',
    'gold-ring-1',
    'diamond-4'
  ];

  const featuredProducts = featuredIds
    .map(id => products.find(p => p.id === id))
    .filter(Boolean);



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

            </div>
            <div className="pg-details">
              <div className="pg-info-left">
                <h3 className="pg-item-name">{formatProductTitle(product.name)}</h3>
                {product.price && (
                  <div className="pg-price-container">
                    <div className="pg-price-wrapper">
                      <p className="pg-item-price">{product.price}</p>
                      {product.originalPrice && (
                        <p className="pg-item-original-price">{product.originalPrice}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default FeaturedCollection;
