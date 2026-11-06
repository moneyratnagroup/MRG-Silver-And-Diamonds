import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import DiamondGallery from '../components/DiamondGallery';
import { useShop } from '../context/ShopContext';
import './DiamondsPage.css';

// Import images
import neyraHeroCleanBg from '../assets/neyra_hero_clean_bg.jpg';
import neyraBanner from '../assets/neyra_banner.webp';

const DiamondsPage = () => {
  const { collectionId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products: allProductsContext, collections } = useShop();
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
      if (priceFilter === 'under-25000') return val < 25000;
      if (priceFilter === '25000-50000') return val >= 25000 && val <= 50000;
      if (priceFilter === '50000-100000') return val > 50000 && val <= 100000;
      if (priceFilter === 'over-100000') return val > 100000;
      // Backward compatibility
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
  if (typeFiltersArray.length === 1) {
    displayTitle = typeFiltersArray[0].charAt(0).toUpperCase() + typeFiltersArray[0].slice(1).toLowerCase();
  } else if (typeFiltersArray.length > 1) {
    displayTitle = `${typeFiltersArray.length} Selected Types`;
  }

  return (
    <div className="diamonds-page-wrapper">
      
      {showLanding && (
        <>
          {/* Hero Section */}
          <section className="diamond-hero-banner-section">
            <img 
              src={neyraHeroCleanBg} 
              alt="NEYRA - The Diamond Collection" 
              className="diamond-hero-banner-img"
            />
            <div className="diamond-hero-overlay-content">
              <p className="diamond-hero-eyebrow">ETHICALLY SOURCED • FLAWLESS CUT • CERTIFIED</p>
              
              <div className="neyra-brand-header">
                <span className="neyra-brand-sparkle">✦</span>
                <span className="neyra-brand-title">N E Y R A</span>
                <span className="neyra-brand-sparkle">✦</span>
              </div>
              
              <p className="neyra-brand-subtitle">THE DIAMOND COLLECTION</p>
              
              <h1 className="diamond-hero-title">
                Brilliance that lasts<br className="hero-desktop-br" />for generations
              </h1>
              
              <button 
                className="diamond-hero-btn"
                onClick={() => {
                  const el = document.getElementById('diamonds-collection-start');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>EXPLORE THE COLLECTION</span>
                <span className="hero-btn-arrow">→</span>
              </button>
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
          activeFiltersComponent={null}
          sidebarComponent={null}
          filterComponent={null}
        />
      </section>

      {showLanding && (
        <section className="diamond-full-image-section">
          <img 
            loading="lazy" 
            src={neyraBanner} 
            alt="NEYRA The Diamond Collection - Timeless Brilliance" 
            className="diamond-full-image-bg"
          />

          {/* Diamond Sparkle Glints */}
          <div className="diamond-banner-sparkles" aria-hidden="true">
            <span className="diamond-glint glint-solitaire-main">
              <span className="diamond-glint-core" />
              <span className="diamond-glint-ray-v" />
              <span className="diamond-glint-ray-h" />
              <span className="diamond-glint-ray-d1" />
              <span className="diamond-glint-ray-d2" />
            </span>
            <span className="diamond-glint glint-solitaire-side">
              <span className="diamond-glint-core" />
              <span className="diamond-glint-ray-v" />
              <span className="diamond-glint-ray-h" />
            </span>
            <span className="diamond-glint glint-band-upper">
              <span className="diamond-glint-core" />
              <span className="diamond-glint-ray-v" />
              <span className="diamond-glint-ray-h" />
              <span className="diamond-glint-ray-d1" />
            </span>
            <span className="diamond-glint glint-band-main">
              <span className="diamond-glint-core" />
              <span className="diamond-glint-ray-v" />
              <span className="diamond-glint-ray-h" />
              <span className="diamond-glint-ray-d1" />
              <span className="diamond-glint-ray-d2" />
            </span>
            <span className="diamond-glint glint-band-side">
              <span className="diamond-glint-core" />
              <span className="diamond-glint-ray-v" />
              <span className="diamond-glint-ray-h" />
            </span>
          </div>

          <button 
            className="neyra-banner-cta-hotspot"
            aria-label="Explore NEYRA Collection"
            onClick={() => {
              const el = document.getElementById('diamonds-collection-start');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </section>
      )}

          </div>
  );
};

export default DiamondsPage;
