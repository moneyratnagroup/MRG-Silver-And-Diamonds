import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter } from 'lucide-react';
import DiamondGallery from '../components/DiamondGallery';
import FilterDrawer from '../components/FilterDrawer';
import { useShop } from '../context/ShopContext';
import './GoldPage.css';

// Import images
import catRings from '../assets/cat_rings_layout.png';

const GoldPage = () => {
  const { collectionId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products: allProductsContext } = useShop();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('default');
  
  const typeFilter = searchParams.get('type');
  const occasionFilter = searchParams.get('occasion');
  
  // Filter specifically for gold
  let goldProducts = allProductsContext.filter(p => 
    (p.collection && p.collection.toLowerCase() === 'gold') || 
    (p.category && p.category.toLowerCase() === 'gold') || 
    (p.material && p.material.toLowerCase() === 'gold') ||
    (p.metal && p.metal.toLowerCase().includes('gold'))
  );
  
  let products = (collectionId && collectionId !== 'all')
    ? goldProducts.filter(p => p.collection && p.collection.toLowerCase() === collectionId.toLowerCase())
    : goldProducts;
  
  if (typeFilter) {
    products = products.filter(p => p.category && p.category.toUpperCase() === typeFilter.toUpperCase());
  }

  if (occasionFilter) {
    products = products.filter(p => p.occasion && p.occasion.toLowerCase() === occasionFilter.toLowerCase());
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

  return (
    <div className="gorings-gold-page">
      
      {/* Hero Section */}
      <section className="gorings-hero">
        <div className="gorings-hero-left">
          <img src="https://i.pinimg.com/736x/df/0e/4f/df0e4f588b607d67577495d4960fc4aa.jpg" alt="Gold Set" />
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
          <img src="https://i.pinimg.com/736x/c4/14/9d/c4149d75d67374eab1b7b246ebc1eb4d.jpg" alt="Smiling model wearing rings" />
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
          <img src={catRings} alt="Rings on soft background" />
        </div>
      </section>

      <section className="gorings-sparkles-decor">
        <span className="sparkle large">✦</span>
        <span className="sparkle medium">✦</span>
      </section>

      {/* Collection Grid */}
      <section id="gorings-collection-start">
        <div className="gorings-filter-bar">
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

        <DiamondGallery products={displayProducts} title="Bestsellers" />
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
        <div className="gorings-bottom-images" style={{ display: 'block', paddingRight: '10%' }}>
          <img src="https://storage.googleapis.com/antigravity-storage/67b819fdd94ef712cb0c3db7/19beccf1-e123-4dfc-acfa-6644eb9c0864.png" alt="Model wearing layered necklaces" style={{width: '100%', maxHeight: '600px', objectFit: 'cover', borderRadius: '4px'}} />
        </div>
      </section>

      <FilterDrawer isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} />
    </div>
  );
};

export default GoldPage;
