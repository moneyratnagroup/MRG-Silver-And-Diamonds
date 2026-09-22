import React, { useState, useEffect } from 'react';
import { Sparkles, SearchX, ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './ProductsGallery.css';
import { useNavigate } from 'react-router-dom';
import braceletImg from '../assets/silver_charm_bracelet.webp';

const ProductsGallery = ({ title = "Our Collection", tagline, products = [], filterComponent = null, sidebarComponent = null, activeFiltersComponent = null, enablePagination = false, itemsPerPage = 12 }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = enablePagination 
    ? products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : products;
  const { toggleWishlist, isInWishlist, addToCart, coupons } = useShop();

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

  const getRibbonText = (product) => {
    if (product.isOfferAvailable && product.offerCouponCode && coupons) {
      const matchedCoupon = coupons.find(c => c.code === product.offerCouponCode);
      if (matchedCoupon) {
        return matchedCoupon.type === 'percent' 
          ? `${matchedCoupon.value}% OFF` 
          : `₹${matchedCoupon.value} OFF`;
      }
    }
    
    // Fallback to original price calculation
    const discount = calculateDiscount(product.originalPrice, product.price);
    if (discount) {
      return `${discount}% OFF`;
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
              <Sparkles size={12} className="pg-sparkle" />
              <h2 className="global-subheading">{title}</h2>
              <Sparkles size={12} className="pg-sparkle" />
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
          <div className="pg-sidebar" style={{ width: '250px', flexShrink: 0, position: 'sticky', top: '100px', paddingRight: '10px' }}>
            {sidebarComponent}
          </div>
        )}
        <div className="pg-grid-wrapper" style={{ flexGrow: 1 }}>
          {activeFiltersComponent && (
            <div className="pg-active-filters-wrapper" style={{ marginBottom: '1rem' }}>
              {activeFiltersComponent}
            </div>
          )}
          <div className="pg-grid">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <div className="pg-card" key={product.id}>
                  <div className="pg-image-container" onClick={() => handleProductClick(product)} style={{ cursor: 'pointer' }}>
                    {getRibbonText(product) && (
                      <span className="pg-discount-badge">
                        {getRibbonText(product)}
                      </span>
                    )}
                    <img loading="lazy" src={product.img} alt={product.name} className={`pg-image ${product.hoverImage ? 'primary-img' : ''}`} />
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
              <div className="pg-empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', color: '#666', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <SearchX size={48} color="#bdc3c7" strokeWidth={1.5} />
                <h3 style={{ fontSize: '1.2rem', color: '#333', margin: 0, fontFamily: 'Playfair Display, serif' }}>No Products Found</h3>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Sorry, we couldn't find any products matching your current filters.</p>
              </div>
            )}
            
            {enablePagination && totalPages > 1 && (
              <div className="gallery-pagination" style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '3rem' }}>
                <button 
                  className="pagination-btn" 
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => Math.max(prev - 1, 1));
                    window.scrollTo({ top: document.getElementById('silver-collection-start')?.offsetTop || 0, behavior: 'smooth' });
                  }}
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: '#F6FBFA', color: '#71849A',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    opacity: currentPage === 1 ? 0.5 : 1
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                      setCurrentPage(i + 1);
                      window.scrollTo({ top: document.getElementById('silver-collection-start')?.offsetTop || 0, behavior: 'smooth' });
                    }}
                    style={{
                      width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                      background: currentPage === i + 1 ? '#0B2755' : 'transparent',
                      color: currentPage === i + 1 ? '#fff' : '#70809C',
                      display: 'flex', justifyContent: 'center', alignItems: 'center',
                      cursor: 'pointer', fontSize: '1.1rem', fontWeight: '500'
                    }}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  className="pagination-btn" 
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                    window.scrollTo({ top: document.getElementById('silver-collection-start')?.offsetTop || 0, behavior: 'smooth' });
                  }}
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: '#F6FBFA', color: '#71849A',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    opacity: currentPage === totalPages ? 0.5 : 1
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </section>
  );
};

export default ProductsGallery;
