import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import ProductsGallery from '../components/ProductsGallery';
import FilterDrawer from '../components/FilterDrawer';
import FilterSidebarContent from '../components/FilterSidebarContent';
import ActiveFilters from '../components/ActiveFilters';
import { useShop } from '../context/ShopContext';
import './SilverPage.css';

// Import images (using placeholders for now, can be updated later)
import catRings from '../assets/cat_rings_layout.webp';
import imgsilvermodel from '../assets/silvermodel.webp';
import silverImg from '../assets/silverimg.webp';
import silverStoryBanner from '../assets/silver_story_banner.png';
import silverCompleteMain from '../assets/silver_complete_main.jpg';
import silverPendantDetail from '../assets/silver_pendant_detail.jpg';
import silverEarringsDetail from '../assets/silver_earrings_detail.jpg';

const SilverPage = () => {
  const { collectionId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products: allProductsContext, collections } = useShop();
  // Open by default on desktop if on 'all' collection
  const [isFilterOpen, setIsFilterOpen] = useState((collectionId === 'all' || !collectionId) && window.innerWidth > 992);
  const [sortOption, setSortOption] = useState('default');

  const typeFilter = searchParams.get('type');
  const typeFiltersArray = typeFilter ? typeFilter.split(',') : [];
  const occasionFilter = searchParams.get('occasion');

  const matchCollection = (c, searchParam) => {
    if (!searchParam) return false;
    const sp = searchParam.toLowerCase();
    if (c.id.toString() === sp) return true;
    if (sp === 'women' && c.name.toLowerCase().includes("women")) return true;
    if (sp === 'men' && c.name.toLowerCase() === "men's collection") return true;
    if (sp === 'kids' && c.name.toLowerCase().includes("kids")) return true;
    if (sp === 'religious' && c.name.toLowerCase().includes("religious")) return true;
    if (sp === 'special' && c.name.toLowerCase().includes("special")) return true;
    if (c.name.toLowerCase() === sp) return true;
    return false;
  };

  // Filter specifically for silver
  let silverProducts = allProductsContext.filter(p => {
    const isGold = (p.collections && p.collections.some(c => c.name.toLowerCase() === 'gold')) ||
      (p.category && p.category.toLowerCase() === 'gold') ||
      (p.material && p.material.toLowerCase() === 'gold') ||
      (p.metal && p.metal.toLowerCase().includes('gold')) ||
      (p.name && p.name.toLowerCase().includes('gold'));

    const isDiamond = (p.collections && p.collections.some(c => c.name.toLowerCase() === 'diamonds')) ||
      (p.category && p.category.toLowerCase() === 'diamonds') ||
      (p.material && p.material.toLowerCase().includes('diamond')) ||
      (p.metal && p.metal.toLowerCase().includes('diamond')) ||
      (p.name && p.name.toLowerCase().includes('diamond'));

    return !isGold && !isDiamond;
  });

  let products = (collectionId && collectionId !== 'all')
    ? silverProducts.filter(p => p.collections && p.collections.some(c => matchCollection(c, collectionId)))
    : silverProducts;

  if (typeFiltersArray.length > 0) {
    products = products.filter(p => p.category && typeFiltersArray.map(t => t.toUpperCase()).includes(p.category.toUpperCase()));
  }

  if (occasionFilter) {
    products = products.filter(p => p.occasions && p.occasions.some(o => o.id.toString() === occasionFilter));
  }

  const priceFilter = searchParams.get('price');
  if (priceFilter) {
    products = products.filter(p => {
      const val = parseFloat((p.price || "0").replace(/[^\d.]/g, '')) || 0;
      if (priceFilter === 'under-2000') return val < 2000;
      if (priceFilter === '2000-5000') return val >= 2000 && val <= 5000;
      if (priceFilter === '5000-10000') return val > 5000 && val <= 10000;
      if (priceFilter === 'over-10000') return val > 10000;
      return true;
    });
  }

  // Sort products
  let displayProducts = [...products];
  if (sortOption === 'a-z') {
    displayProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === 'z-a') {
    displayProducts.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortOption === 'price-low-high') {
    displayProducts.sort((a, b) => {
      const priceA = parseFloat((a.price || "0").replace(/[^\d.]/g, '')) || 0;
      const priceB = parseFloat((b.price || "0").replace(/[^\d.]/g, '')) || 0;
      return priceA - priceB;
    });
  } else if (sortOption === 'price-high-low') {
    displayProducts.sort((a, b) => {
      const priceA = parseFloat((a.price || "0").replace(/[^\d.]/g, '')) || 0;
      const priceB = parseFloat((b.price || "0").replace(/[^\d.]/g, '')) || 0;
      return priceB - priceA;
    });
  }

  const activeFiltersCount = (typeFiltersArray.length > 0 ? 1 : 0) + (occasionFilter ? 1 : 0);

  const isAll = collectionId === 'all' || !collectionId;
  const showLanding = isAll && !typeFilter && !occasionFilter && !priceFilter;
  const getCollectionName = (id) => {
    if (!id || id === 'all') return "All Silver";
    if (id.toLowerCase() === 'women') return "Women's";
    if (id.toLowerCase() === 'men') return "Men's";
    if (id.toLowerCase() === 'kids') return "Kids";
    if (id.toLowerCase() === 'religious') return "Religious";
    if (id.toLowerCase() === 'special') return "Special";
    if (collections && collections.length > 0) {
      const found = collections.find(c => c.id.toString() === id.toString() || c.name.toLowerCase() === id.toLowerCase());
      if (found) return found.name.replace(/ collection$/i, '').trim();
    }
    return id.charAt(0).toUpperCase() + id.slice(1);
  };
  const baseTitle = getCollectionName(collectionId);
  let displayTitle = isAll ? "All Silver Products" : `${baseTitle} Collection`;
  if (typeFiltersArray.length === 1) {
    displayTitle = typeFiltersArray[0].charAt(0).toUpperCase() + typeFiltersArray[0].slice(1).toLowerCase();
  } else if (typeFiltersArray.length > 1) {
    displayTitle = `${typeFiltersArray.length} Selected Types`;
  }

  return (
    <div className="silver-page-wrapper ivory-theme">

      {showLanding && (
        <>
          {/* Hero Section */}
          <section className="ivory-hero">
            <div className="ivory-hero-content">
              <span className="hero-subtitle">THE SILVER COLLECTION</span>
              <h1 className="ivory-title">Silver,<br /><span className="ivory-cursive">reimagined.</span></h1>
              <p className="hero-desc">
                Modern heirlooms in timeless designs,<br />
                crafted to make everyday feel extraordinary.
              </p>
              <div className="hero-buttons">
                <button className="ivory-btn-solid">EXPLORE SILVER &rarr;</button>
                <button className="ivory-btn-outline">FIND MY STYLE</button>
              </div>
            </div>
            <div className="scroll-indicator">
              <span>SCROLL</span>
              <div className="scroll-arrow">&darr;</div>
            </div>
          </section>
        </>
      )}

      {/* Collection Grid */}
      <section id="silver-collection-start" className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem 2rem 0' }}>

        <ProductsGallery
          title=""
          tagline=""
          products={displayProducts}
          enablePagination={true}
          itemsPerPage={12}
          activeFiltersComponent={
            <div className="ivory-main-content-top">
              <div className="ivory-gallery-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0 1rem', marginBottom: '1rem' }}>
                <div className="ivory-header-left" style={{ flex: '1.2' }}>
                  <span className="hero-subtitle" style={{ color: '#650018', fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '0.5rem', display: 'block' }}>THE SILVER COLLECTION</span>
                  <h2 className="ivory-gallery-title" style={{ fontFamily: '"Cormorant Upright", serif', fontSize: '3.5rem', color: '#302A2A', fontWeight: '400', margin: '0', lineHeight: '1.1' }}>Made to catch the light.</h2>
                </div>
                <div className="ivory-header-right" style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}>
                  <p style={{ fontSize: '0.85rem', color: '#302A2A', lineHeight: '1.6', maxWidth: '450px', textAlign: 'left', marginBottom: '0' }}>From minimal everyday pieces to statement designs, explore our curated collection of 925 sterling silver jewellery.</p>
                </div>
              </div>

              <div className="ivory-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <button className="silver-filter-btn" onClick={() => setIsFilterOpen(true)} style={{ margin: 0, display: isFilterOpen ? 'none' : 'flex' }}>
                    <Filter size={14} />
                    <span>REFINE BY</span>
                    {activeFiltersCount > 0 && <span className="filter-count-badge">({activeFiltersCount})</span>}
                  </button>
                  <span className="showing-pieces-text" style={{ fontSize: '0.85rem', color: '#6d5b53', fontWeight: '500' }}>
                    Showing {displayProducts.length} {displayProducts.length === 1 ? 'piece' : 'pieces'}
                  </span>
                </div>

                <div className="sort-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.9rem', color: '#4a3b32', fontWeight: '500' }} className="d-none d-sm-inline">Sort by</span>
                  <select
                    className="custom-sort-select"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    style={{
                      padding: '0.2rem 1.5rem 0.2rem 0.5rem',
                      border: 'none',
                      borderBottom: '1px solid #ccc',
                      backgroundColor: 'transparent',
                      fontSize: '0.9rem',
                      fontFamily: '"Inter", sans-serif',
                      color: '#4a3b32',
                      outline: 'none',
                      cursor: 'pointer',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%234a3b32%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0 center',
                      backgroundSize: '12px',
                      minWidth: '100px'
                    }}
                  >
                    <option value="default">Featured</option>
                    <option value="a-z">Alphabetically, A-Z</option>
                    <option value="z-a">Alphabetically, Z-A</option>
                    <option value="price-low-high">Price, low to high</option>
                    <option value="price-high-low">Price, high to low</option>
                  </select>
                </div>
              </div>
              <ActiveFilters />
            </div>
          }
          sidebarComponent={
            isFilterOpen ? (
              <div className="desktop-only collection-sidebar-content">
                <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 className="sidebar-title" style={{ margin: 0, borderBottom: 'none' }}>REFINE BY</h3>
                  <button onClick={() => setIsFilterOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                    <X size={20} />
                  </button>
                </div>
                <FilterSidebarContent />
              </div>
            ) : null
          }
          filterComponent={null}
        />
      </section>

      {/* Complete the look Section */}
      {showLanding && (
        <section className="ivory-complete-look">
          <div className="complete-left">
            <img src={silverCompleteMain} alt="Complete the look" loading="lazy" />
          </div>
          <div className="complete-center">
            <span className="hero-subtitle" style={{ color: '#8c767a', fontSize: '0.75rem', letterSpacing: '2px' }}>CURATED TOGETHER</span>
            <h2>Complete<br />the look.</h2>
            <p>Pieces designed to work beautifully together,<br />while letting each one shine on its own.</p>
            <button className="ivory-btn-solid dark-btn">DISCOVER THE SET &rarr;</button>
          </div>
          <div className="complete-right">
            <img src={silverPendantDetail} alt="Silver Pendant" loading="lazy" className="detail-img-top" />
            <img src={silverEarringsDetail} alt="Silver Earrings" loading="lazy" className="detail-img-bottom" />
          </div>
        </section>
      )}

      {/* Info Section */}
      {showLanding && (
        <section className="ivory-info-section container" style={{ maxWidth: '1400px', margin: '4rem auto', padding: '0 2rem' }}>
          <div className="info-block">
            <div className="info-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4a3b32" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 12L2 9l4-6z"></path><path d="M2 9h20"></path><path d="M12 21l-4-12"></path><path d="M12 21l4-12"></path><path d="M6 3l2 6"></path><path d="M18 3l-2 6"></path></svg>
            </div>
            <div className="info-text">
              <h4>925<br />CERTIFIED STERLING SILVER</h4>
              <p>Authentic. Hallmarked. Trusted.</p>
            </div>
          </div>
          <div className="info-divider"></div>
          <div className="info-block">
            <div className="info-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4a3b32" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path><path d="M12 21.23c-1.5 1.5-3 1.5-3 1.5M12 21.23c1.5 1.5 3 1.5 3 1.5"></path></svg>
            </div>
            <div className="info-text">
              <h4>MADE WITH CARE<br />CONSCIOUS CRAFTSMANSHIP</h4>
              <p>Thoughtful design for a brighter tomorrow.</p>
            </div>
          </div>
          <div className="info-divider"></div>
          <div className="info-block">
            <div className="info-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4a3b32" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="12" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="20"></line><path d="M19 8V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2"></path><path d="M12 4v4"></path></svg>
            </div>
            <div className="info-text">
              <h4>ALWAYS HERE<br />PERSONAL ASSISTANCE</h4>
              <p>Styling help, gifting support and more.</p>
            </div>
          </div>
        </section>
      )}

      <div className="mobile-only">
        <FilterDrawer isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} />
      </div>
    </div>
  );
};

export default SilverPage;
