import { hardcodedSilverProducts } from '../data/silverProducts';
import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import ProductsGallery from '../components/ProductsGallery';
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
import silverCraftRing from '../assets/silver_craft_ring.jpg';
import silverCraftGoldModel from '../assets/silver_craft_gold_model.jpg';
import silverCraftGoldChoker from '../assets/silver_craft_gold_choker.jpg';
import silverCraftSalemAnklet from '../assets/silver_craft_salem_anklet.jpg';
import navySilkSilver from '../assets/navy_silk_silver.webp';

const SilverPage = () => {
  const { collectionId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products: allProductsContext, collections } = useShop();
  // Open by default on desktop if on 'all' collection
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

  // Filter specifically for silver (hardcoded products prioritized when backend not used)
  const filteredFromContext = allProductsContext.filter(p => {
    if (p.metal && p.metal.toLowerCase() === 'silver') return true;
    const isGold = (p.collections && p.collections.some(c => c.name.toLowerCase() === 'gold')) ||
      (p.category && p.category.toLowerCase() === 'gold') ||
      (p.material && p.material.toLowerCase() === 'gold') ||
      (p.metal && p.metal.toLowerCase().includes('gold')) ||
      (p.name && p.name.toLowerCase().includes('gold') && !p.name.toLowerCase().includes('silver') && !p.name.toLowerCase().includes('plated'));
    const isDiamond = (p.collections && p.collections.some(c => c.name.toLowerCase() === 'diamonds')) ||
      (p.category && p.category.toLowerCase() === 'diamonds') ||
      (p.material && p.material.toLowerCase() === 'diamond') ||
      (p.metal && p.metal.toLowerCase().includes('diamond')) ||
      (p.name && p.name.toLowerCase().includes('diamond'));
    return !isGold && !isDiamond;
  });

  let silverProducts = filteredFromContext.length > 0 ? filteredFromContext : hardcodedSilverProducts;

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
              <span className="hero-subtitle" style={{ letterSpacing: '2.5px', textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: '0.6rem', display: 'block' }}>THE EIRA COLLECTION</span>
              <h1 className="ivory-title" style={{ textTransform: 'uppercase', marginBottom: '0.2rem', fontFamily: '"Cormorant Upright", serif', fontWeight: '400' }}>EIRA</h1>
              <span className="hero-subtitle" style={{ fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: '"Cormorant Upright", serif', fontSize: '1.2rem', marginBottom: '1.2rem', display: 'block' }}>SILVER, REIMAGINED.</span>
              <p className="hero-desc">
                Crafted in luminous 925 sterling silver.<br />
                Modern heirlooms designed to make<br />
                every day feel extraordinary.
              </p>
              <div className="hero-buttons">
                <button className="ivory-btn-solid">DISCOVER EIRA &rarr;</button>
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
      <section id="silver-collection-start" className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem 0 0' }}>

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
                  <span className="hero-subtitle" style={{ color: '#650018', fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '0.5rem', display: 'block' }}>The Eira Collection: </span>
                  <h2 className="ivory-gallery-title" style={{ fontFamily: '"Cormorant Upright", serif', fontSize: '3.5rem', color: '#302A2A', fontWeight: '400', margin: '0', lineHeight: '1.1' }}>Made to catch the light.</h2>
                </div>
                <div className="ivory-header-right" style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}>
                  <p style={{ fontSize: '0.85rem', color: '#302A2A', lineHeight: '1.6', maxWidth: '450px', textAlign: 'left', marginBottom: '0' }}>From minimal everyday pieces to statement designs, explore our curated collection of 925 sterling silver jewellery.</p>
                </div>
              </div>

              {/* The Facets of Eira Section */}
              {showLanding && (
                <section className="eira-facets-section">
                  <div className="eira-facets-container">
                    <h2 className="eira-facets-title">The Facets of Eira</h2>
                    <p className="eira-facets-subtitle">Four timeless expressions of certified 925 sterling silver.</p>
                    <div className="eira-facets-grid">
                      <div className="eira-facet-item">
                        <div className="eira-facet-arch">
                          <img src={navySilkSilver} alt="925 Hallmark certified silver jewellery" loading="lazy" />
                        </div>
                        <span className="eira-facet-dot" aria-hidden="true"></span>
                        <h3 className="eira-facet-name">925 Hallmark</h3>
                        <span className="eira-facet-desc">Certified Pure Silver</span>
                      </div>
                      <div className="eira-facet-item">
                        <div className="eira-facet-arch">
                          <img src={silverCraftRing} alt="Icy Rhodium silver ring" loading="lazy" />
                        </div>
                        <h3 className="eira-facet-name">Icy Rhodium</h3>
                        <span className="eira-facet-desc">Diamond-Sheen Lustre</span>
                      </div>
                      <div className="eira-facet-item">
                        <div className="eira-facet-arch">
                          <img src={silverCraftGoldChoker} alt="Gold Vermeil silver choker" loading="lazy" />
                        </div>
                        <h3 className="eira-facet-name">Gold Vermeil</h3>
                        <span className="eira-facet-desc">18K Dipped Radiance</span>
                      </div>
                      <div className="eira-facet-item">
                        <div className="eira-facet-arch">
                          <img src={silverCraftSalemAnklet} alt="Salem Heirloom silver anklet" loading="lazy" />
                        </div>
                        <h3 className="eira-facet-name">Salem Heirlooms</h3>
                        <span className="eira-facet-desc">Handcrafted Bells</span>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              <div className="ivory-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>

                  <span className="showing-pieces-text" style={{ fontSize: '0.85rem', color: '#6d5b53', fontWeight: '500' }}>
                    Showing {displayProducts.length} {displayProducts.length === 1 ? 'piece' : 'pieces'}
                  </span>
                </div>


              </div>
            </div>
          }
          sidebarComponent={null}
          filterComponent={null}
        />
      </section>



      {/* The Craft of Silver Section */}
      {showLanding && (
        <section className="silver-craft-section">
          <div className="silver-craft-container">
            {/* Left Column: Warm Ivory Text Side */}
            <div className="silver-craft-text-col">
              <h2 className="silver-craft-title">The Craft<br />of Silver</h2>
              <h3 className="silver-craft-subtitle">One pure metal.<br />Three timeless expressions.</h3>
              <p className="silver-craft-desc">
                925 Sterling Silver polished in Rhodium, dipped in 18K Gold Vermeil, and handcrafted by Salem silversmiths.
              </p>
            </div>

            {/* Right Column: Deep Burgundy Photo Collage */}
            <div className="silver-craft-visual-col">
              <div className="craft-photo-collage">
                <div className="craft-photo-card card-top-left">
                  <img src={silverCraftRing} alt="925 Silver Rhodium Solitaire Ring" loading="lazy" />
                </div>
                <div className="craft-photo-card card-top-right">
                  <img src={silverCraftGoldModel} alt="18K Gold Vermeil Model" loading="lazy" />
                </div>
                <div className="craft-photo-card card-bottom-left">
                  <img src={silverCraftGoldChoker} alt="Gold Plated Silver Choker" loading="lazy" />
                </div>
                <div className="craft-photo-card card-bottom-right">
                  <img src={silverCraftSalemAnklet} alt="Salem Traditional 925 Silver Anklet" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default SilverPage;
