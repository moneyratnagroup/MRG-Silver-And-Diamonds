import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import ProductsGallery from '../components/ProductsGallery';
import FilterDrawer from '../components/FilterDrawer';
import FilterSidebarContent from '../components/FilterSidebarContent';
import { useShop } from '../context/ShopContext';
import './SilverPage.css';

// Import images (using placeholders for now, can be updated later)
import catRings from '../assets/cat_rings_layout.webp';
import visionBg from '../assets/vision_bg.webp';
import presenceBg from '../assets/presence_bg.webp';
import imgsilvermodel from '../assets/silvermodel.webp';

const SilverPage = () => {
  const { collectionId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products: allProductsContext } = useShop();
  // Open by default on desktop if on 'all' collection
  const [isFilterOpen, setIsFilterOpen] = useState((collectionId === 'all' || !collectionId) && window.innerWidth > 992);
  const [sortOption, setSortOption] = useState('default');

  const typeFilter = searchParams.get('type');
  const occasionFilter = searchParams.get('occasion');

  // Filter specifically for silver
  let silverProducts = allProductsContext.filter(p =>
    (p.collection && p.collection.toLowerCase() !== 'diamonds') &&
    (p.category && p.category.toLowerCase() !== 'diamonds')
  );

  let products = (collectionId && collectionId !== 'all')
    ? silverProducts.filter(p => p.collection && p.collection.toLowerCase() === collectionId.toLowerCase())
    : silverProducts;

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
  const baseTitle = isAll ? "All Silver" : collectionId ? collectionId.charAt(0).toUpperCase() + collectionId.slice(1) : "Collection";
  let displayTitle = isAll ? "All Silver Products" : `${baseTitle} Collection`;
  if (typeFilter) {
    displayTitle = typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1).toLowerCase();
  }

  return (
    <div className="silver-page-wrapper">

      {isAll && (
        <>
          {/* Hero Section */}
          <section className="silver-hero">
            <div className="silver-hero-left">
              <img loading="lazy" src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop" alt="Silver Jewelry" />
            </div>
            <div className="silver-hero-center">
              <div className="silver-sparkle-icons">
                <span className="sparkle">✦</span>
                <span className="sparkle small">✦</span>
              </div>
              <p className="silver-subtitle">PURE ELEGANCE +<br />TIMELESS CRAFTSMANSHIP</p>
              <h1 className="silver-title">Silver that shines<br />with every moment</h1>
              <button className="silver-btn-solid">SHOP THE COLLECTION</button>
            </div>
            <div className="silver-hero-right">
              <img loading="lazy" src={imgsilvermodel} alt="Model wearing silver" />
            </div>
          </section>

          {/* Marquee Banner */}
          <div className="silver-marquee">
            <div className="silver-marquee-content">
              <span>✦ Pure 925 Sterling Silver</span>
              <span>✦ Pure 925 Sterling Silver</span>
              <span>✦ Pure 925 Sterling Silver</span>
              <span>✦ Pure 925 Sterling Silver</span>
              <span>✦ Pure 925 Sterling Silver</span>
            </div>
          </div>
        </>
      )}


      {/* Collection Grid */}
      <section id="silver-collection-start" className="container" style={{maxWidth: '1400px', margin: '0 auto', padding: '0 2rem'}}>
        <ProductsGallery
          title={displayTitle}
          tagline={typeFilter ? `Explore our stunning collection of silver ${displayTitle.toLowerCase()}.` : isAll ? "Browse our entire catalog of premium silver jewelry." : `Explore our exclusive silver ${baseTitle} jewelry, curated for elegance and style.`}
          products={displayProducts}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '1.5rem' }}>
              <button className="silver-filter-btn" onClick={() => setIsFilterOpen(true)} style={{ margin: 0, display: isFilterOpen ? 'none' : 'flex' }}>
                <Filter size={14} />
                <span>Filter By</span>
                {activeFiltersCount > 0 && <span className="filter-count-badge">({activeFiltersCount})</span>}
              </button>
              <div style={{flex: isFilterOpen ? 1 : 0}}></div> {/* Spacer when filter button is hidden */}

              <div className="sort-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <select
                  className="silver-sort-select"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="default">Featured</option>
                  <option value="a-z">Alphabetically, A-Z</option>
                  <option value="z-a">Alphabetically, Z-A</option>
                  <option value="price-low-high">Price, low to high</option>
                  <option value="price-high-low">Price, high to low</option>
                </select>
              </div>
            </div>
          }
        />
      </section>

      {/* Bottom Split Section */}
      <section className="silver-bottom-split">
        <div className="silver-bottom-text">
          <p className="silver-bottom-subtitle">JEWELRY THAT PROMISES TO</p>
          <h2 className="silver-bottom-title">Last a lifetime</h2>
          <p className="silver-bottom-desc">
            Our premium silver collection is designed to be cherished<br />
            and passed down. With quality craftsmanship and<br />
            timeless designs, these pieces will stay with you forever.
          </p>
          <button className="silver-btn-solid">OUR STORY</button>
        </div>
        <div className="silver-bottom-images">
          <img loading="lazy" src={visionBg} alt="Model styling silver" className="silver-bottom-img1" />
          <img loading="lazy" src={presenceBg} alt="Hands wearing silver jewelry" className="silver-bottom-img2" />
        </div>
      </section>

      <div className="mobile-only">
        <FilterDrawer isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} />
      </div>
    </div>
  );
};

export default SilverPage;

