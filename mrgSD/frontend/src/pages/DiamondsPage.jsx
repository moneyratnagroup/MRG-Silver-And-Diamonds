import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter, X, Gem, Shield, Wrench, Sprout } from 'lucide-react';
import DiamondGallery from '../components/DiamondGallery';
import FilterDrawer from '../components/FilterDrawer';
import FilterSidebarContent from '../components/FilterSidebarContent';
import ActiveFilters from '../components/ActiveFilters';
import { useShop } from '../context/ShopContext';
import './DiamondsPage.css';

// Import images
import customHero1 from '../assets/hero_diamonds.webp';
import heroDiamondsWine from '../assets/hero_diamonds_necklace_wine.jpg';
import heroDiamondsModelWine from '../assets/hero_diamonds_model_wine.jpg';
import customHero2 from '../assets/hero_diamonds_gold.png';
import earringsBg from '../assets/earrings_bg.webp';
import presenceBg from '../assets/presence_bg_wine.webp';
import visionBg from '../assets/vision_bg.webp';
import diamondMood from '../assets/diamond_collection_mood_wine.webp';
import bannerVisionNecklace from '../assets/banner_vision_necklace.png';
import bannerMissionRings from '../assets/banner_mission_rings.png';

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
          <img loading="lazy" src={heroDiamondsWine} alt="Regal Ruby and Diamond Haute Joaillerie Necklace" />
        </div>
        <div className="gorings-hero-center">
          <div className="gorings-sparkle-icons">
            <span className="sparkle">✦</span>
            <span className="sparkle small">✦</span>
          </div>
          <p className="global-subheading">✦ ETHICALLY SOURCED • FLAWLESS CUT • CERTIFIED ✦</p>
          <h1 className="gorings-title">Brilliance that lasts<br className="hero-desktop-br" />for generations</h1>
          <button 
            className="gorings-btn-solid"
            onClick={() => {
              const el = document.getElementById('gorings-collection-start');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>EXPLORE THE COLLECTION</span>
            <span className="hero-btn-arrow">→</span>
          </button>
        </div>
        <div className="gorings-hero-right">
          <img loading="lazy" src={heroDiamondsModelWine} alt="Elegant model wearing fine diamond jewelry against red wine velvet" />
        </div>
      </section>

      {/* Marquee Banner */}
      <div className="gorings-marquee">
        <div className="gorings-marquee-content">
          <span>✦ 100% Certified Natural Diamonds</span>
          <span>✦ Master Artisan Craftsmanship</span>
          <span>✦ Ethically Sourced & Certified</span>
          <span>✦ Cherished for Generations</span>
          <span>✦ 100% Certified Natural Diamonds</span>
          <span>✦ Master Artisan Craftsmanship</span>
          <span>✦ Ethically Sourced & Certified</span>
          <span>✦ Cherished for Generations</span>
        </div>
      </div>
        </>
      )}

      {/* Collection Grid */}
<<<<<<< Updated upstream
      <section id="diamonds-collection-start" className="container" style={{maxWidth: '1400px', margin: '0 auto', padding: '0 2rem'}}>
=======
      <section id="gorings-collection-start" className="container gorings-collection-section">
>>>>>>> Stashed changes
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
          {/* The Essence of Elegance & Our Promise Section */}
          <section className="diamonds-essence-section">
            <div className="diamonds-essence-container">
              {/* Top Row: The Essence of Elegance */}
              <div className="diamonds-essence-row essence-row-top">
                <div className="essence-text-col essence-vision-text">
                  <div className="essence-tag">
                    <span className="essence-tag-text">THE ESSENCE OF ELEGANCE</span>
                    <span className="essence-tag-line" />
                  </div>
                  <h2 className="essence-title">
                    Timeless Beauty,<br />
                    <em>for Generations</em>
                  </h2>
                  <p className="essence-desc">
                    Hand-selected diamonds and master craftsmanship designed to celebrate life's most unforgettable moments and milestones.
                  </p>
                </div>

                <div className="essence-media-col essence-media-necklace">
                  <div className="essence-photo-wrap">
                    <img 
                      loading="lazy" 
                      src={bannerVisionNecklace} 
                      alt="Exquisite Floral Diamond Necklace" 
                      className="essence-photo" 
                    />
                  </div>
                </div>

                <div className="essence-aside-col essence-aside-legacy">
                  <span className="aside-sub">MORE THAN</span>
                  <h3 className="aside-script">Jewellery,</h3>
                  <span className="aside-main">IT'S A LEGACY</span>
                  <div className="aside-star-flourish">
                    <span className="flourish-line" />
                    <span className="flourish-star">✦</span>
                    <span className="flourish-line" />
                  </div>
                </div>
              </div>

              {/* Row Divider */}
              <div className="diamonds-essence-divider" />

              {/* Bottom Row: Our Promise */}
              <div className="diamonds-essence-row essence-row-bottom">
                <div className="essence-media-col essence-media-rings">
                  <div className="essence-photo-wrap">
                    <img 
                      loading="lazy" 
                      src={bannerMissionRings} 
                      alt="Fine Solitaire Ring and Diamond Earrings" 
                      className="essence-photo" 
                    />
                  </div>
                </div>

                <div className="essence-text-col essence-promise-col">
                  <div className="essence-promise-inner">
                    <div className="essence-tag">
                      <span className="essence-tag-text">OUR PROMISE</span>
                    </div>
                    <h2 className="essence-title">
                      Crafting Brilliance,<br />
                      <span>With Trust</span>
                    </h2>
                    <p className="essence-desc">
                      Every creation reflects an unwavering commitment to authenticity, exceptional quality, and enduring luxury tailored just for you.
                    </p>
                  </div>
                </div>

                <div className="essence-aside-col essence-aside-pillars">
                  <div className="essence-pillars-list">
                    <div className="pillar-row">
                      <span className="pillar-dot">✦</span>
                      <span className="pillar-label">QUALITY</span>
                    </div>
                    <div className="pillar-row">
                      <span className="pillar-dot">✦</span>
                      <span className="pillar-label">TRUST</span>
                    </div>
                    <div className="pillar-row">
                      <span className="pillar-dot">✦</span>
                      <span className="pillar-label">BEAUTY</span>
                    </div>
                    <div className="pillar-row">
                      <span className="pillar-dot">✦</span>
                      <span className="pillar-label">ALWAYS</span>
                    </div>
                  </div>
                  <div className="pillars-sparkle-gem">✦</div>
                </div>
              </div>
            </div>
          </section>

          <section className="diamonds-hallmark-divider">
            <div className="hallmark-divider-line left" />
            <div className="hallmark-divider-emblem">
              <span className="hallmark-sparkle">✦</span>
              <div className="hallmark-gem-icon">
                <Gem size={20} strokeWidth={1.2} />
              </div>
              <span className="hallmark-sparkle">✦</span>
            </div>
            <div className="hallmark-divider-line right" />
          </section>
          <section className="diamonds-aesthetic-banner">
            <div className="diamonds-banner-content">
              <span className="diamonds-banner-eyebrow">✦ &nbsp; THE ART OF BRILLIANCE &nbsp; ✦</span>
              <h2 className="diamonds-banner-heading">
                Ethically Sourced. Exceptionally Cut. Forever Yours.
              </h2>
              <div className="diamonds-banner-pillars">
                <span className="diamonds-banner-pillar">
                  <span className="pillar-sparkle">✦</span> 100% Certified Diamonds
                </span>
                <span className="diamonds-banner-dot">•</span>
                <span className="diamonds-banner-pillar">
                  <span className="pillar-sparkle">✦</span> Master Artisan Craftsmanship
                </span>
                <span className="diamonds-banner-dot">•</span>
                <span className="diamonds-banner-pillar">
                  <span className="pillar-sparkle">✦</span> Cherished for Generations
                </span>
              </div>
            </div>
          </section>

          {/* Diamonds Editorial Story Section */}
          <section className="diamonds-editorial-split">
            <div className="diamonds-editorial-container">
              <div className="diamonds-editorial-text">
                <span className="diamonds-editorial-eyebrow">✦ MONEYRATNA DIAMONDS ✦</span>
                <h2 className="diamonds-editorial-title">Crafted for a Lifetime of Radiance</h2>
                <p className="diamonds-editorial-desc">
                  Every diamond in our collection is hand-selected for its extraordinary fire, cut, and brilliance. Designed to celebrate your unforgettable milestones with enduring artistry.
                </p>

                <div className="diamonds-editorial-pillars">
                  <div className="editorial-pillar-card">
                    <span className="pillar-icon-box">
                      <Shield size={17} strokeWidth={1.8} />
                    </span>
                    <div className="pillar-info">
                      <h4 className="pillar-title">Certified Fire & Authenticity</h4>
                      <p className="pillar-text">100% natural, conflict-free stones certified to the highest international standards.</p>
                    </div>
                  </div>
                  <div className="editorial-pillar-card">
                    <span className="pillar-icon-box">
                      <Wrench size={17} strokeWidth={1.8} />
                    </span>
                    <div className="pillar-info">
                      <h4 className="pillar-title">Bespoke Artisan Settings</h4>
                      <p className="pillar-text">Masterfully handcrafted prongs and micro-pavé settings for everlasting brilliance.</p>
                    </div>
                  </div>
                  <div className="editorial-pillar-card">
                    <span className="pillar-icon-box">
                      <Sprout size={17} strokeWidth={1.8} />
                    </span>
                    <div className="pillar-info">
                      <h4 className="pillar-title">Purpose & Conscious Legacy</h4>
                      <p className="pillar-text">A dedicated share of each creation supports artisan families and education.</p>
                    </div>
                  </div>
                </div>

                <div className="diamonds-editorial-action">
                  <button 
                    className="diamonds-editorial-btn"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    <span>EXPLORE OUR STORY</span>
                    <span className="editorial-btn-arrow">→</span>
                  </button>
                </div>
              </div>

              {/* Framed Visual Showcase Card matching Image 1 */}
              <div className="diamonds-editorial-visuals">
                <div className="editorial-visuals-frame">
                  <div className="editorial-card card-primary">
                    <img loading="lazy" src={diamondMood} alt="Extraordinary Diamond Pendant with Fire Reflection" className="editorial-img" />
                  </div>
                  <div className="editorial-card card-secondary">
                    <img loading="lazy" src={presenceBg} alt="Fine Solitaire Diamond Ring in Velvet Box" className="editorial-img" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <FilterDrawer isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} />
    </div>
  );
};

export default DiamondsPage;
