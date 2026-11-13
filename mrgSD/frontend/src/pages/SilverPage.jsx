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
import silverCraftRing from '../assets/silver_craft_ring.jpg';
import silverCraftGoldModel from '../assets/silver_craft_gold_model.jpg';
import silverCraftGoldChoker from '../assets/silver_craft_gold_choker.jpg';
import silverCraftSalemAnklet from '../assets/silver_craft_salem_anklet.jpg';
import navySilkSilver from '../assets/navy_silk_silver.webp';

// Placeholder images for each category; replace individual entries here later.
const eiraFacets = [
  {
    category: 'Silver Radiance', description: 'Silver-Coated Elegance',
    images: [navySilkSilver, silverPendantDetail, silverEarringsDetail, silverCompleteMain],
  },
  {
    category: 'Golden Glow', description: 'Gold-Coated Beauty',
    images: [silverCraftGoldChoker, silverCraftGoldModel, catRings, silverCraftRing],
  },
  {
    category: 'Rhodium Shine', description: 'A Brilliant Rhodium Finish',
    images: [silverCraftRing, silverEarringsDetail, silverPendantDetail, navySilkSilver],
  },
  {
    category: 'Salem Heritage', description: 'Traditional Salem Designs',
    images: [silverCraftSalemAnklet, silverCompleteMain, silverPendantDetail, silverEarringsDetail],
  },
];

const SilverPage = () => {
  const { collectionId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products: allProductsContext, collections } = useShop();
  // Open by default on desktop if on 'all' collection
  const [isFilterOpen, setIsFilterOpen] = useState((collectionId === 'all' || !collectionId) && window.innerWidth > 992);
  const [sortOption, setSortOption] = useState('default');
  const [activeFacetCategory, setActiveFacetCategory] = useState('Silver Radiance');
  const activeFacet = eiraFacets.find(facet => facet.category === activeFacetCategory);

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

      {/* The Facets of Eira Section */}
      {showLanding && (
        <section className="eira-facets-section">
          <div className="eira-facets-container">
            <h2 className="eira-facets-title">THE FACETS OF EIRA</h2>
            <p className="eira-facets-subtitle">Four timeless expressions of certified 925 sterling silver.</p>

            <div className="eira-facets-categories" role="group" aria-label="EIRA highlights">
              {eiraFacets.map(({ category }) => (
                <button
                  key={category}
                  type="button"
                  className={`eira-facets-category${activeFacetCategory === category ? ' is-active' : ''}`}
                  aria-pressed={activeFacetCategory === category}
                  aria-controls="eira-facet-cards"
                  onClick={() => setActiveFacetCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div id="eira-facet-cards" className="eira-facets-grid" aria-live="polite" aria-atomic="true">
              {activeFacet.images.map((image, index) => (
                <article key={`${activeFacetCategory}-${index}`} className="eira-facet-card" aria-label={`${activeFacetCategory} design ${index + 1}`}>
                  <div className="eira-facet-arch">
                    <img src={image} alt={`${activeFacetCategory} jewellery inspiration ${index + 1}`} loading="lazy" />
                  </div>
                  <div className="eira-facet-content">
                    <p className="eira-facet-desc">{activeFacet.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
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
              {/* <div className="ivory-gallery-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0 1rem', marginBottom: '1rem' }}>
                <div className="ivory-header-left" style={{ flex: '1.2' }}>
                  <span className="hero-subtitle" style={{ color: '#650018', fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '0.5rem', display: 'block' }}>The Eira Collection: </span>
                  <h2 className="ivory-gallery-title" style={{ fontFamily: '"Cormorant Upright", serif', fontSize: '3.5rem', color: '#302A2A', fontWeight: '400', margin: '0', lineHeight: '1.1' }}>Made to catch the light.</h2>
                </div>
                <div className="ivory-header-right" style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}>
                  <p style={{ fontSize: '0.85rem', color: '#302A2A', lineHeight: '1.6', maxWidth: '450px', textAlign: 'left', marginBottom: '0' }}>From minimal everyday pieces to statement designs, explore our curated collection of 925 sterling silver jewellery.</p>
                </div>
              </div> */}

              <div className="ivory-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <button className="silver-filter-btn" onClick={() => setIsFilterOpen(true)} style={{ margin: 0, display: isFilterOpen ? 'none' : 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#02275a' }}>
                    <Filter size={18} strokeWidth={1.5} color="#02275a" />
                    <span style={{ fontFamily: '"Cormorant Upright", serif', fontSize: '1.2rem', fontWeight: '500', letterSpacing: '1.5px', textTransform: 'uppercase' }}>FILTER</span>
                    {activeFiltersCount > 0 && <span className="filter-count-badge" style={{ marginLeft: '4px' }}>({activeFiltersCount})</span>}
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
                  <h3 className="sidebar-title" style={{ margin: 0, borderBottom: 'none' }}>Filter By</h3>
                  <button onClick={() => setIsFilterOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                    <X size={20} />
                  </button>
                </div>
                <FilterSidebarContent metal="silver" />
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

     

      <div className="mobile-only">
        <FilterDrawer isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} metal="silver" />
      </div>
    </div>
  );
};

export default SilverPage;
