import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import DiamondGallery from '../components/DiamondGallery';
import FilterDrawer from '../components/FilterDrawer';
import FilterSidebarContent from '../components/FilterSidebarContent';
import { useShop } from '../context/ShopContext';
import './GoldPage.css';

// Import images
import catRings from '../assets/cat_rings_layout.webp';

const GoldPage = () => {
  const { collectionId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products: allProductsContext } = useShop();
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

  // Filter specifically for gold
  let goldProducts = allProductsContext.filter(p => 
    (p.collections && p.collections.some(c => c.name.toLowerCase() === 'gold')) || 
    (p.category && p.category.toLowerCase() === 'gold') || 
    (p.material && p.material.toLowerCase() === 'gold') ||
    (p.metal && p.metal.toLowerCase().includes('gold'))
  );
  
  let products = (collectionId && collectionId !== 'all')
    ? goldProducts.filter(p => p.collections && p.collections.some(c => matchCollection(c, collectionId)))
    : goldProducts;
  
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
  const baseTitle = isAll ? "All Gold" : collectionId ? collectionId.charAt(0).toUpperCase() + collectionId.slice(1) : "Collection";
  let displayTitle = isAll ? "All Gold Jewelry" : `${baseTitle} Collection`;
  if (typeFilter) {
    displayTitle = typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1).toLowerCase();
  }

  return (
    <div className="gold-page-wrapper">
      
      {showLanding && (
        <>
      {/* Hero Section */}
      <section className="gold-hero">
        <div className="gold-hero-left">
          <img loading="lazy" src="https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?q=80&w=800&auto=format&fit=crop" alt="Gold Jewelry" />
        </div>
        <div className="gold-hero-center">
          <div className="gold-sparkle-icons">
            <span className="sparkle">✦</span>
            <span className="sparkle small">✦</span>
          </div>
          <p className="global-subheading">EXQUISITE CRAFTSMANSHIP</p>
          <h1 className="gold-title">Golden moments<br />crafted for you</h1>
          <button className="gold-btn-solid">EXPLORE THE COLLECTION</button>
        </div>
        <div className="gold-hero-right">
          <img loading="lazy" src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop" alt="Model wearing gold" />
        </div>
      </section>

      {/* Marquee Banner */}
      <div className="gorings-marquee">
        <div className="gorings-marquee-content">
          <span>✦ 30% donated to new causes every month</span>
          <span>✦ 30% donated to new causes every month</span>
          <span>✦ 30% donated to new causes every month</span>
          <span>✦ 30% donated to new causes every month</span>
        </div>
      </div>

      {/* Ring In The New Year Section */}
      <section className="gorings-split-section">
        <div className="gorings-split-text">
          <h2 className="gorings-split-title">Ring in the New Year</h2>
          <p className="gorings-split-desc">
            Let's leave jewelry that tarnishes in 2023, is it time to elevate<br/>
            your everyday ring lineup? We love a fresh start.
          </p>
          <button className="gorings-btn-solid">SHOP BEST-SELLING RINGS</button>
        </div>
        <div className="gorings-split-image">
          <img loading="lazy" src={catRings} alt="Rings on soft background" />
        </div>
      </section>

      <section className="gorings-sparkles-decor">
        <span className="sparkle large">✦</span>
        <span className="sparkle medium">✦</span>
      </section>
        </>
      )}

      {/* Collection Grid */}
      <section id="gorings-collection-start" className="container" style={{maxWidth: '1400px', margin: '0 auto', padding: '0 2rem'}}>
        <DiamondGallery 
          products={displayProducts} 
          title={displayTitle} 
          tagline={`Explore our exclusive ${baseTitle} jewelry.`}
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
              
              <select 
                className="gorings-sort-select"
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="default">Featured</option>
                <option value="price-low-high">Price, low to high</option>
                <option value="price-high-low">Price, high to low</option>
              </select>
            </div>
          }
        />
      </section>

      {/* Wavy Banner */}
      {showLanding && (
        <>
          <section className="gorings-wavy-banner">
            <div className="gorings-wavy-text">
              MAKING FUNDRAISING SIMPLE, EFFECTIVE, AND JOYFUL
            </div>
          </section>

          {/* Stay Gold & Do Good Section */}
          <section className="gorings-bottom-split">
            <div className="gorings-bottom-text">
              <p className="global-subheading">JEWELRY THAT PROMISES TO</p>
              <h2 className="gorings-bottom-title">Stay gold & do good</h2>
              <p className="gorings-bottom-desc">
                Our collection of long-lasting, never-take-it-off jewelry is ready to<br/>
                shine through literally anything on your agenda. The best part?<br/>
                30% of your order funds new causes monthly.
              </p>
              <button className="gorings-btn-solid">OUR STORY</button>
            </div>
            <div className="gorings-bottom-images" style={{ display: 'block', paddingRight: '10%' }}>
              <img loading="lazy" src="https://storage.googleapis.com/antigravity-storage/67b819fdd94ef712cb0c3db7/19beccf1-e123-4dfc-acfa-6644eb9c0864.png" alt="Model wearing layered necklaces" style={{width: '100%', maxHeight: '600px', objectFit: 'cover', borderRadius: '4px'}} />
            </div>
          </section>
        </>
      )}

      <FilterDrawer isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} />
    </div>
  );
};

export default GoldPage;
