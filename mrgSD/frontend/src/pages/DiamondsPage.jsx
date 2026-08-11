import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter } from 'lucide-react';
import DiamondGallery from '../components/DiamondGallery';
import FilterDrawer from '../components/FilterDrawer';
import { useShop } from '../context/ShopContext';
import './DiamondsPage.css';

// Import images
import customHero1 from '../assets/hero_diamonds.png';
import customHero2 from '../assets/hero_diamonds_gold.png';
import earringsBg from '../assets/earrings_bg.png';
import presenceBg from '../assets/presence_bg.png';
import visionBg from '../assets/vision_bg.png';
import catRings from '../assets/cat_rings_layout.png';

const DiamondsPage = () => {
  const { collectionId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products: allProductsContext } = useShop();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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
    <div className="gorings-diamonds-page">
      
      {/* Hero Section */}
      <section className="gorings-hero">
        <div className="gorings-hero-left">
          <img src="https://i.pinimg.com/736x/c5/54/77/c55477911eaf29d483f3f299e523d7ec.jpg" alt="Diamonds" />
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
          <img src="https://amalfa.in/cdn/shop/files/image_22_1dc86f45-bd5e-4aef-adf6-1d80d4064245.png?v=1778141255&width=800" alt="Smiling model wearing rings" />
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
        <div className="gorings-bottom-images">
          <img src={visionBg} alt="Model smiling" className="gorings-bottom-img1" />
          <img src={presenceBg} alt="Hands wearing rings" className="gorings-bottom-img2" />
        </div>
      </section>

      <FilterDrawer isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} />
    </div>
  );
};

export default DiamondsPage;
