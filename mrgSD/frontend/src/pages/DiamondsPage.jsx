import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import DiamondGallery from '../components/DiamondGallery';
import FilterDrawer from '../components/FilterDrawer';
import FilterSidebarContent from '../components/FilterSidebarContent';
import ActiveFilters from '../components/ActiveFilters';
import { useShop } from '../context/ShopContext';
import './DiamondsPage.css';

// Import images
import heroDiamondsNecklaceBlue from '../assets/hero_diamonds_necklace_blue.png';
import heroDiamondsModelSapphire from '../assets/hero_diamonds_model_sapphire.png';
import diamondStoryPromiseBanner from '../assets/diamond.png';

const DiamondsPage = () => {
  const { collectionId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products: allProductsContext, collections } = useShop();
  const [isFilterOpen, setIsFilterOpen] = useState((collectionId === 'all' || !collectionId) && window.innerWidth > 992);
  const [sortOption, setSortOption] = useState('default');
  
  const typeFilter = searchParams.get('type');
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

  // Filter specifically for diamonds
  let diamondProducts = allProductsContext.filter(p => 
    (p.collections && p.collections.some(c => c.name.toLowerCase() === 'diamonds')) || 
    (p.category && p.category.toLowerCase() === 'diamonds') || 
    (p.material && p.material.toLowerCase() === 'diamond') ||
    (p.metal && p.metal.toLowerCase().includes('diamond'))
  );
  
  let products = (collectionId && collectionId !== 'all')
    ? diamondProducts.filter(p => p.collections && p.collections.some(c => matchCollection(c, collectionId)))
    : diamondProducts;
  
  if (typeFilter) {
    products = products.filter(p => p.category && p.category.toUpperCase() === typeFilter.toUpperCase());
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

  const activeFiltersCount = (typeFilter ? 1 : 0) + (occasionFilter ? 1 : 0);

  const isAll = collectionId === 'all' || !collectionId;
  const showLanding = isAll && !typeFilter && !occasionFilter && !priceFilter;
  const getCollectionName = (id) => {
    if (!id || id === 'all') return "All Diamonds";
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
  let displayTitle = isAll ? "All Diamond Jewelry" : `${baseTitle} Collection`;
  if (typeFilter) {
    displayTitle = typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1).toLowerCase();
  }

  return (
    <div className="diamonds-page-wrapper">
      
      {showLanding && (
        <>
          {/* Hero Section */}
          <section className="gorings-hero">
            <div className="gorings-hero-left">
              <img loading="lazy" src={heroDiamondsNecklaceBlue} alt="Diamond Haute Joaillerie Necklace" />
            </div>
            <div className="gorings-hero-center">
              <p className="global-subheading">ETHICALLY SOURCED • FLAWLESS CUT • CERTIFIED</p>
              <h1 className="gorings-title">Brilliance that lasts<br className="hero-desktop-br" />for generations</h1>
              <button 
                className="gorings-btn-solid"
                onClick={() => {
                  const el = document.getElementById('diamonds-collection-start');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>EXPLORE THE COLLECTION</span>
                <span className="hero-btn-arrow">→</span>
              </button>
            </div>
            <div className="gorings-hero-right">
              <img loading="lazy" src={heroDiamondsModelSapphire} alt="Model wearing exquisite diamond and sapphire jewelry" />
            </div>
          </section>

          {/* Marquee Banner */}
          <div className="gorings-marquee">
            <div className="gorings-marquee-content">
              <span>✦ 100% CERTIFIED NATURAL DIAMONDS</span>
              <span>✦ LIFETIME EXCHANGE & BUYBACK GUARANTEE</span>
              <span>✦ COMPLIMENTARY INSURED SHIPPING</span>
              <span>✦ ETHICALLY SOURCED</span>
              <span>✦ 100% CERTIFIED NATURAL DIAMONDS</span>
              <span>✦ LIFETIME EXCHANGE & BUYBACK GUARANTEE</span>
              <span>✦ COMPLIMENTARY INSURED SHIPPING</span>
              <span>✦ ETHICALLY SOURCED</span>
            </div>
          </div>
        </>
      )}

      {/* Collection Grid */}
      <section id="diamonds-collection-start" className="container" style={{maxWidth: '1400px', margin: '0 auto', padding: '0 2rem'}}>
        <DiamondGallery 
          products={displayProducts} 
          title={displayTitle} 
          tagline={`Explore our exclusive ${baseTitle} jewelry.`}
          disableSidebarScroll={true}
          activeFiltersComponent={<ActiveFilters />}
          sidebarComponent={
            isFilterOpen ? (
              <div className="desktop-only collection-sidebar-content">
                <div className="sidebar-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                  <h3 className="sidebar-title" style={{margin: 0, borderBottom: 'none'}}>Filter By</h3>
                  <button onClick={() => setIsFilterOpen(false)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#666'}}>
                    <X size={20} />
                  </button>
                </div>
                <FilterSidebarContent />
              </div>
            ) : null
          }
          filterComponent={
            <div className="gorings-filter-bar" style={{ display: isFilterOpen ? 'none' : 'flex' }}>
              <button className="gorings-filter-btn" onClick={() => setIsFilterOpen(true)}>
                <Filter size={14} />
                <span>Filter</span>
                {activeFiltersCount > 0 && <strong>({activeFiltersCount})</strong>}
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1rem', color: '#555', fontWeight: '500' }} className="d-none d-sm-inline">Sort by:</span>
                <select 
                  className="custom-sort-select"
                  value={sortOption} 
                  onChange={(e) => setSortOption(e.target.value)}
                  style={{
                    padding: '0.5rem 2.2rem 0.5rem 1rem',
                    borderRadius: '50px',
                    border: '1px solid #e0e0e0',
                    backgroundColor: '#fff',
                    fontSize: '1rem',
                    fontFamily: '"Inter", sans-serif',
                    color: '#333',
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23333%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '14px',
                    minWidth: '160px'
                  }}
                >
                <option value="default">Featured</option>
                <option value="price-low-high">Price, low to high</option>
                <option value="price-high-low">Price, high to low</option>
              </select>
              </div>
            </div>
          }
        />
      </section>

      {showLanding && (
        <>
          {/* Diamond Promise Section */}
          <section className="diamonds-bottom-banner-section">
            <div className="diamonds-bottom-banner-container">
              <img 
                loading="lazy" 
                src={diamondStoryPromiseBanner} 
                alt="Jewelry That Promises To Shine Bright & Last Forever" 
                className="diamonds-bottom-banner-img"
              />
            </div>
          </section>
        </>
      )}

      <FilterDrawer isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} theme="diamond" />
    </div>
  );
};

export default DiamondsPage;
