import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import DiamondGallery from '../components/DiamondGallery';
import FilterDrawer from '../components/FilterDrawer';
import FilterSidebarContent from '../components/FilterSidebarContent';
import { useShop } from '../context/ShopContext';
import './DiamondsPage.css';

// Import images
import customHero1 from '../assets/hero_diamonds.webp';
import customHero2 from '../assets/hero_diamonds_gold.png';
import earringsBg from '../assets/earrings_bg.webp';
import presenceBg from '../assets/presence_bg.webp';
import visionBg from '../assets/vision_bg.webp';
import catRings from '../assets/cat_rings_layout.webp';
import bentoRing1 from '../assets/bento_ring_1_1787566345955.webp';
import bentoRing2 from '../assets/bento_ring_2_1787566366440.webp';
import bentoRing3 from '../assets/bento_ring_3_1787566387700.webp';

const DiamondsPage = () => {
  const { collectionId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products: allProductsContext } = useShop();
  const [isFilterOpen, setIsFilterOpen] = useState((collectionId === 'all' || !collectionId) && window.innerWidth > 992);
  const [sortOption, setSortOption] = useState('default');
  
  const typeFilter = searchParams.get('type');
  const occasionFilter = searchParams.get('occasion');
  
  // Filter specifically for diamonds
  let diamondProducts = allProductsContext.filter(p => 
    (p.collection && p.collection.toLowerCase() === 'diamonds') || 
    (p.category && p.category.toLowerCase() === 'diamonds') || 
    (p.material && p.material.toLowerCase() === 'diamond') ||
    (p.metal && p.metal.toLowerCase().includes('diamond'))
  );
  
  let products = (collectionId && collectionId !== 'all')
    ? diamondProducts.filter(p => p.collection && p.collection.toLowerCase() === collectionId.toLowerCase())
    : diamondProducts;
  
  if (typeFilter) {
    products = products.filter(p => p.category && p.category.toUpperCase() === typeFilter.toUpperCase());
  }

  if (occasionFilter) {
    products = products.filter(p => p.occasion && p.occasion.toLowerCase() === occasionFilter.toLowerCase());
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
  const baseTitle = isAll ? "All Diamonds" : collectionId ? collectionId.charAt(0).toUpperCase() + collectionId.slice(1) : "Collection";
  let displayTitle = isAll ? "All Diamond Jewelry" : `${baseTitle} Collection`;
  if (typeFilter) {
    displayTitle = typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1).toLowerCase();
  }

  return (
    <div className="diamonds-page-wrapper">
      
      {/* Hero Section */}
      <section className="gorings-hero">
        <div className="gorings-hero-left">
          <img loading="lazy" src="https://i.pinimg.com/736x/c5/54/77/c55477911eaf29d483f3f299e523d7ec.jpg" alt="Diamonds" />
        </div>
        <div className="gorings-hero-center">
          <div className="gorings-sparkle-icons">
            <span className="sparkle">✦</span>
            <span className="sparkle small">✦</span>
          </div>
          <p className="gorings-subtitle">LONG-LASTING, HYPOALLERGENIC +<br/>FUNDS NEW CAUSES EVERY MONTH</p>
          <h1 className="gorings-title">Jewelry that stays<br/>gold & does good</h1>
          <button className="gorings-btn-solid">SHOP THE COLLECTION</button>
        </div>
        <div className="gorings-hero-right">
          <img loading="lazy" src="https://amalfa.in/cdn/shop/files/image_22_1dc86f45-bd5e-4aef-adf6-1d80d4064245.png?v=1778141255&width=800" alt="Smiling model wearing rings" />
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

      {/* Bento Grid Section */}
      <section className="bento-grid">
        <div className="bento-cell bento-logo">
          <div className="bento-logo-icon">
            <span>GG</span>
          </div>
          <h3>GEMS GLOBAL</h3>
          <p>— JEWELS —</p>
        </div>
        <div className="bento-cell bento-img1">
          <img loading="lazy" src={bentoRing1} alt="Nested rings" />
        </div>
        <div className="bento-cell bento-img2">
          <img loading="lazy" src={bentoRing2} alt="Three stone ring" />
        </div>
        <div className="bento-cell bento-text-box">
          <h2>JEWELRY<br />COLLECTION</h2>
          <p>Elevate your shine with stunning pieces on sale.<br />Hurry — your glow awaits!</p>
        </div>
        <div className="bento-cell bento-blank"></div>
        <div className="bento-cell bento-img3">
          <img loading="lazy" src={bentoRing3} alt="Marquise ring" />
        </div>
      </section>

      <section className="gorings-sparkles-decor">
        <span className="sparkle large">✦</span>
        <span className="sparkle medium">✦</span>
      </section>

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
      <section className="gorings-wavy-banner">
        <div className="gorings-wavy-text">
          MAKING FUNDRAISING SIMPLE, EFFECTIVE, AND JOYFUL
        </div>
      </section>

      {/* Stay Gold & Do Good Section */}
      <section className="gorings-bottom-split">
        <div className="gorings-bottom-text">
          <p className="gorings-bottom-subtitle">JEWELRY THAT PROMISES TO</p>
          <h2 className="gorings-bottom-title">Stay gold & do good</h2>
          <p className="gorings-bottom-desc">
            Our collection of long-lasting, never-take-it-off jewelry is ready to<br/>
            shine through literally anything on your agenda. The best part?<br/>
            30% of your order funds new causes monthly.
          </p>
          <button className="gorings-btn-solid">OUR STORY</button>
        </div>
        <div className="gorings-bottom-images">
          <img loading="lazy" src={visionBg} alt="Model smiling" className="gorings-bottom-img1" />
          <img loading="lazy" src={presenceBg} alt="Hands wearing rings" className="gorings-bottom-img2" />
        </div>
      </section>

      <FilterDrawer isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} />
    </div>
  );
};

export default DiamondsPage;
