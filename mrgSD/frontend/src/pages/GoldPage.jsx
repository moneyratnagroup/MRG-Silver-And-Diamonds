import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter, X, ShieldCheck, Gem, Users, Truck, RotateCcw, BadgeCheck, Phone, HeartHandshake, Globe, TreePine, Award, Medal } from 'lucide-react';
import DiamondGallery from '../components/DiamondGallery';
import FilterDrawer from '../components/FilterDrawer';
import FilterSidebarContent from '../components/FilterSidebarContent';
import ActiveFilters from '../components/ActiveFilters';
import { useShop } from '../context/ShopContext';
import './GoldPage.css';

// Import images
import catRings from '../assets/cat_rings_layout.webp';

const GoldPage = () => {
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

  // Filter specifically for gold
  let goldProducts = allProductsContext.filter(p =>
    (p.collections && p.collections.some(c => c.name.toLowerCase() === 'gold')) ||
    (p.category && p.category.toLowerCase() === 'gold') ||
    (p.material && p.material.toLowerCase() === 'gold') ||
    (p.metal && p.metal.toLowerCase().includes('gold')) ||
    (p.name && p.name.toLowerCase().includes('gold'))
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
  const getCollectionName = (id) => {
    if (!id || id === 'all') return "All Gold";
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
  let displayTitle = isAll ? "All Gold Jewelry" : `${baseTitle} Collection`;
  if (typeFilter) {
    displayTitle = typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1).toLowerCase();
  }

  return (
    <div className="gold-page-wrapper">

      {showLanding && (
        <>
          {/* 1. Hero Section */}
          <section className="gold-hero">
            <div className="gold-hero-left">
              <img loading="lazy" src="https://i.pinimg.com/736x/e1/e5/1e/e1e51e03038115f665cd02afb4298542.jpg" alt="Gold Jewelry" />
            </div>
            <div className="gold-hero-center">
              <div className="gold-sparkle-icons">
                <span className="sparkle">✦</span>
                <span className="sparkle small">✦</span>
              </div>
              <p className="global-subheading" style={{ color: '#8b2525' }}>PURE TRADITION -<br />EXQUISITE CRAFTSMANSHIP</p>
              <h1 className="gold-hero-title gold-serif">Golden moments<br />crafted for you</h1>
              <button className="gold-btn" onClick={() => document.getElementById('gorings-collection-start').scrollIntoView({ behavior: 'smooth' })}>
                SHOP THE COLLECTION
              </button>
            </div>
            <div className="gold-hero-right">
              <img loading="lazy" src="https://i.pinimg.com/736x/e8/cd/56/e8cd56b1edc1b32cfe418d1f2a6ba482.jpg" alt="Gold Rings" />
            </div>
          </section>

          {/* 3. Benefit Bar */}
          <section className="gold-benefit-bar">
            <div className="gold-benefit-item">
              <Truck size={20} />
              <span>Free & Insured Shipping</span>
            </div>
            <div className="gold-benefit-separator"></div>
            <div className="gold-benefit-item">
              <RotateCcw size={20} />
              <span>Easy Returns</span>
            </div>
            <div className="gold-benefit-separator"></div>
            <div className="gold-benefit-item">
              <BadgeCheck size={20} />
              <span>100% Authentic Gold</span>
            </div>
            <div className="gold-benefit-separator"></div>
            <div className="gold-benefit-item">
              <Phone size={20} />
              <span>Dedicated Support</span>
            </div>
          </section>

          {/* 2. Top Split Section */}
          <section className="gold-split-top" style={{ marginTop: '3rem' }}>
            <div className="gold-split-image">
              <img loading="lazy" src="https://i.pinimg.com/736x/68/52/a8/6852a80bc5be4f7a128a4b5318b72039.jpg" alt="Gold Bangle" />
              <div className="gold-split-image-overlay">
                ELEGANCE LIVES IN EVERY DETAIL
              </div>
            </div>
            <div className="gold-split-text">
              <span className="gold-impact-eyebrow" style={{ color: '#8b2525', marginBottom: '1rem' }}>TIMELESS BEAUTY</span>
              <h2 className="gold-split-title gold-serif">More Than Jewellery,<br />A Brighter Tomorrow</h2>
              <p className="gold-hero-desc">
                Our gold jewellery is a celebration of heritage, artistry, and modern elegance. Each piece is crafted with precision and care, designed to be a part of your most cherished moments.
              </p>

              <div className="gold-hero-features" style={{ marginTop: '1rem' }}>
                <div className="gold-hero-feature">
                  <Medal size={20} />
                  <span>Certified<br />Purity (BIS)</span>
                </div>
                <div className="gold-hero-feature">
                  <Award size={20} />
                  <span>Exclusive<br />Designs</span>
                </div>
                <div className="gold-hero-feature">
                  <HeartHandshake size={20} />
                  <span>Lifetime<br />Value</span>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Collection Grid */}
      <section id="gold-collection-start" className="container" style={{maxWidth: '1400px', margin: '0 auto', padding: '0 2rem'}}>
        <DiamondGallery 
          products={displayProducts} 
          title={displayTitle} 
          tagline={`Explore our exclusive ${baseTitle} jewelry.`}
          disableSidebarScroll={true}
          activeFiltersComponent={<ActiveFilters />}
          sidebarComponent={
            isFilterOpen ? (
              <div className="desktop-only collection-sidebar-content">
                <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 className="sidebar-title" style={{ margin: 0, borderBottom: 'none' }}>Filter By</h3>
                  <button onClick={() => setIsFilterOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
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

      {/* 5. Impact Section */}
      {showLanding && (
        <>
          <section className="gold-impact-section">
            <div className="gold-impact-left">
              <span className="gold-impact-eyebrow">GOLD THAT GIVES BACK</span>
              <h2 className="gold-impact-title gold-serif">MAKING A BRIGHTER<br />TOMORROW TOGETHER</h2>
              <p className="gold-hero-desc" style={{ color: '#ccc' }}>
                A portion of every purchase goes towards supporting education, healthcare and community development.
              </p>
              <button className="gold-btn-outline">
                OUR IMPACT →
              </button>
            </div>
            <div className="gold-impact-right">
              <div className="gold-impact-icon">
                <Users size={32} strokeWidth={1} />
                <span>PEOPLE<br /><small>Stronger Communities</small></span>
              </div>
              <div className="gold-impact-icon">
                <Globe size={32} strokeWidth={1} />
                <span>PLANET<br /><small>A Greener Tomorrow</small></span>
              </div>
              <div className="gold-impact-icon">
                <TreePine size={32} strokeWidth={1} />
                <span>PROSPERITY<br /><small>Brighter Futures</small></span>
              </div>
            </div>
          </section>

          {/* 6. Bottom Split CTA */}
          <section className="gold-bottom-cta">
            <div className="gold-bottom-text">
              <span className="gold-impact-eyebrow" style={{ color: '#8b2525', marginBottom: '1rem' }}>JEWELLERY THAT PROMISES MORE</span>
              <h2 className="gold-bottom-title gold-serif">Stay gold & do good</h2>
              <p className="gold-hero-desc">
                Our collection of long-lasting, never-take-it-off gold jewellery is ready to shine through all of life's moments. The best part? 30% of your order funds new causes monthly.
              </p>
              <div style={{ marginTop: '1rem' }}>
                <button className="gold-btn">
                  OUR STORY →
                </button>
              </div>
            </div>

            <div className="gold-bottom-image-wrapper">
              <img loading="lazy" src={catRings} alt="Gold rings lifestyle" />
              <div className="gold-bottom-vertical">
                <span>BEAUTY THAT CREATES CHANGE</span>
              </div>
            </div>
          </section>
        </>
      )}

      <FilterDrawer isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} />
    </div>
  );
};

export default GoldPage;
