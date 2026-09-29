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
import featuredRing1 from '../assets/featured_ring_1.png';
import featuredRing2 from '../assets/featured_ring_2.png';
import featuredRing3 from '../assets/featured_ring_3.png';
import featuredRing4 from '../assets/featured_ring_4.png';
import saleItem1 from '../assets/sale_item_1.png';
import saleItem2 from '../assets/sale_item_2.jpg';
import saleItem3 from '../assets/sale_item_3.jpg';
import saleItem4 from '../assets/sale_item_4.png';
import topRatedItem1 from '../assets/top_rated_item_1.png';
import topRatedItem2 from '../assets/top_rated_item_2.png';
import topRatedItem3 from '../assets/top_rated_item_3.png';
import topRatedItem4 from '../assets/top_rated_item_4.jpg';
import featuredItem1 from '../assets/featured_item_1.png';
import featuredItem2 from '../assets/featured_item_2.png';
import featuredItem3 from '../assets/featured_item_3.png';
import featuredItem4 from '../assets/featured_item_4.png';
import journeyStep1 from '../assets/journey_step_1.jpg';
import journeyStep2 from '../assets/journey_step_2.jpg';
import journeyStep3 from '../assets/journey_step_3.jpg';
import journeyStep4New from '../assets/journey_step_4_new.jpg';
import journeyStep5 from '../assets/journey_step_5.png';

const GoldPage = () => {
  const { collectionId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products: allProductsContext, collections } = useShop();
  const [isFilterOpen, setIsFilterOpen] = useState((collectionId === 'all' || !collectionId) && window.innerWidth > 992);
  const [sortOption, setSortOption] = useState('default');
  const [activeFeaturedTab, setActiveFeaturedTab] = useState('Top Seller');

  const featuredData = {
    'Top Seller': [
      { img: featuredRing1, title: 'THE AUTUMN EQUINOX', isHighlight: true },
      { img: featuredRing2, title: 'Ring 2' },
      { img: featuredRing3, title: 'Ring 3' },
      { img: featuredRing4, title: 'Ring 4' }
    ],
    'Sale': [
      { img: saleItem1, title: 'ANTIQUE JHUMKA SET', isHighlight: true },
      { img: saleItem2, title: 'PEACOCK CHOKER' },
      { img: saleItem3, title: 'GOLDEN CRESCENT' },
      { img: saleItem4, title: 'FLORAL ELEGANCE' }
    ],
    'Top Rated': [
      { img: topRatedItem1, title: 'ROYAL EMERALD DROP', isHighlight: true },
      { img: topRatedItem2, title: 'DIAMOND LEAF CASCADE' },
      { img: topRatedItem3, title: 'GEOMETRIC CHOKER' },
      { img: topRatedItem4, title: 'CLUSTER DIAMOND BANGLES' }
    ],
    'Featured': [
      { img: featuredItem1, title: 'POLKI DELIGHT', isHighlight: true },
      { img: featuredItem2, title: 'ELEGANT GREEN DROP' },
      { img: featuredItem3, title: 'TEMPLE HERITAGE' },
      { img: featuredItem4, title: 'KUNDAN BRIDAL SET' }
    ]
  };

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
  if (typeFiltersArray.length === 1) {
    displayTitle = typeFiltersArray[0].charAt(0).toUpperCase() + typeFiltersArray[0].slice(1).toLowerCase();
  } else if (typeFiltersArray.length > 1) {
    displayTitle = `${typeFiltersArray.length} Selected Types`;
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
              <button className="gold-btn" onClick={() => document.getElementById('gold-collection-start').scrollIntoView({ behavior: 'smooth' })}>
                SHOP THE COLLECTION
              </button>
            </div>
            <div className="gold-hero-right">
              <img loading="lazy" src="https://i.pinimg.com/736x/e8/cd/56/e8cd56b1edc1b32cfe418d1f2a6ba482.jpg" alt="Gold Rings" />
            </div>
          </section>

          {/* Featured Rings Section */}
          <section className="jared-featured">
             <div className="jared-featured-content">
               <h2 className="jared-featured-title">Find your perfect piece</h2>
               <div className="jared-featured-tabs">
                 {['Top Seller', 'Sale', 'Top Rated', 'Featured'].map(tab => (
                   <button 
                     key={tab}
                     className={activeFeaturedTab === tab ? 'active' : ''}
                     onClick={() => setActiveFeaturedTab(tab)}
                   >
                     {tab}
                   </button>
                 ))}
               </div>
               
               <div className="jared-featured-grid">
                 {featuredData[activeFeaturedTab].map((item, index) => (
                   <div key={index} className={`jared-featured-card ${item.isHighlight ? 'highlight' : ''}`}>
                     <img loading="lazy" src={item.img} alt={item.title || `Ring ${index + 1}`} />
                     {item.isHighlight && (
                       <div className="jared-card-info">
                         <h3>{item.title}</h3>
                         <a href="#gold-collection-start" onClick={(e) => { e.preventDefault(); document.getElementById('gold-collection-start').scrollIntoView({ behavior: 'smooth' }); }}>SHOP NOW &rarr;</a>
                       </div>
                     )}
                   </div>
                 ))}
               </div>
             </div>
           </section>

          {/* Golden Journey Section */}
          <section className="golden-journey-section">
            <h2 className="golden-journey-title gold-serif">THE GOLDEN JOURNEY</h2>
            <p className="golden-journey-subtitle">From inspiration to your most cherished moments.</p>
            
            <div className="journey-steps">
              <div className="journey-step">
                <div className="step-img-wrapper"><img src={journeyStep1} alt="Inspiration" /></div>
                <span>Inspiration</span>
              </div>
              <div className="journey-connector"></div>
              <div className="journey-step">
                <div className="step-img-wrapper"><img src={journeyStep2} alt="Design" /></div>
                <span>Design</span>
              </div>
              <div className="journey-connector"></div>
              <div className="journey-step">
                <div className="step-img-wrapper"><img src={journeyStep3} alt="Craft" /></div>
                <span>Craft</span>
              </div>
              <div className="journey-connector"></div>
              <div className="journey-step">
                <div className="step-img-wrapper"><img src={journeyStep4New} alt="Finish" /></div>
                <span>Finish</span>
              </div>
              <div className="journey-connector"></div>
              <div className="journey-step">
                <div className="step-img-wrapper"><img src={journeyStep5} alt="Your Story" /></div>
                <span>Your Story</span>
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



      <FilterDrawer isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} />
    </div>
  );
};

export default GoldPage;
