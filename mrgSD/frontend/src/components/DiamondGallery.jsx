import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ChevronLeft, ChevronRight, SearchX } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './DiamondGallery.css';

const DiamondGallery = ({ products = [], title, tagline, filterComponent, sidebarComponent, activeFiltersComponent = null, disableSidebarScroll = false, itemsPerPage = 8 }) => {
  const navigate = useNavigate();
  const { addToCart } = useShop();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="minimal-gallery-wrapper">
      <div className="minimal-gallery-header">
        <h2 className="minimal-gallery-title">{title || 'FINE JEWELRY MADE RESPONSIBLY'}</h2>
        {tagline && <p className="minimal-gallery-tagline" style={{ color: '#666', marginTop: '0.5rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>{tagline}</p>}
        
        {!filterComponent && (
          <div className="minimal-gallery-nav">
            <button className="minimal-nav-btn"><ChevronLeft size={16} strokeWidth={1} /></button>
            <button className="minimal-nav-btn"><ChevronRight size={16} strokeWidth={1} /></button>
          </div>
        )}
      </div>

      {filterComponent && (
        <div className="minimal-gallery-filter-container" style={{ marginBottom: '2rem' }}>
          {filterComponent}
        </div>
      )}

      <div className={`dg-layout-container ${sidebarComponent ? 'with-sidebar' : ''}`} style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
        {sidebarComponent && (
          <div className="dg-sidebar" style={{ width: '250px', flexShrink: 0, position: 'sticky', top: '100px', maxHeight: disableSidebarScroll ? 'none' : 'calc(100vh - 120px)', overflowY: disableSidebarScroll ? 'visible' : 'auto', paddingRight: '10px' }}>
            {sidebarComponent}
          </div>
        )}
        
        <div className="dg-grid-wrapper" style={{ flexGrow: 1 }}>
          {activeFiltersComponent && (
            <div className="dg-active-filters-wrapper" style={{ marginBottom: '1rem' }}>
              {activeFiltersComponent}
            </div>
          )}
          <div className="aesthetic-gallery-grid">
            {currentProducts.length > 0 ? (
              currentProducts.map((product, index) => {
                const styleClass = `style-${index % 6}`;
                
                // Subtitles based on index for variety
                const subtitles = [
                  "Trending Now",
                  "New Arrival",
                  "Minimalist",
                  "Aesthetic",
                  "Bestseller",
                  "Elevate Your Everyday"
                ];
                
                // Button texts based on index
                const buttonTexts = [
                  "Discover",
                  "Collect Now",
                  "Shop Less Is More",
                  "Discover More",
                  "Shop The Look",
                  "Shop The Collection"
                ];

                return (
                  <div 
                    className="product-card" 
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="product-card-header">
                      <span className="product-card-subtitle">{subtitles[index % 6]}</span>
                      <Heart size={18} strokeWidth={1.5} className="product-card-heart" />
                    </div>
                    
                    <div className="product-card-image-wrapper">
                      <img loading="lazy" src={product.img} alt={product.name} className={product.hoverImage ? 'primary-img' : ''} />
                      {product.hoverImage && (
                        <img loading="lazy" src={product.hoverImage} alt={`${product.name} hover`} className="hover-img" />
                      )}
                    </div>
                    
                    <div className="product-card-info">
                      <h3 className="product-card-title">{product.name}</h3>
                      <span className="product-card-price">
                        {product.price.includes('₹') || product.price.includes('$') || product.price.includes('€') || product.price.includes('£') ? product.price : `₹ ${product.price}`}
                      </span>
                      <button className="add-to-cart-btn" onClick={(e) => { e.stopPropagation(); addToCart(product); }}>
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="minimal-empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', color: '#666', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <SearchX size={48} color="#bdc3c7" strokeWidth={1.5} />
                <h3 style={{ fontSize: '1.2rem', color: '#333', margin: 0, fontFamily: 'Playfair Display, serif' }}>No Products Found</h3>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Sorry, we couldn't find any products matching your current filters.</p>
              </div>
            )}
            
            {totalPages > 1 && (
              <div className="gallery-pagination">
                <button 
                  className="pagination-btn" 
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => Math.max(prev - 1, 1));
                    window.scrollTo({ top: document.getElementById('gorings-collection-start')?.offsetTop || 0, behavior: 'smooth' });
                  }}
                >
                  Previous
                </button>
                <span className="pagination-info">Page {currentPage} of {totalPages}</span>
                <button 
                  className="pagination-btn" 
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                    window.scrollTo({ top: document.getElementById('gorings-collection-start')?.offsetTop || 0, behavior: 'smooth' });
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiamondGallery;
