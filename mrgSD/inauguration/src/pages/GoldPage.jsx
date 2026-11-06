import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter, X, ShieldCheck, Gem, Users, Truck, RotateCcw, BadgeCheck, Phone, HeartHandshake, Globe, TreePine, Award, Medal } from 'lucide-react';
import DiamondGallery from '../components/DiamondGallery';
import { useShop } from '../context/ShopContext';
import './GoldPage.css';

// Import images
import goldHero from '../assets/gold_hero2.webp';
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
import journeyInspiration from '../assets/gold_journey_inspiration.webp';
import journeyDesign from '../assets/gold_journey_design.webp';
import journeyCraft from '../assets/gold_journey_craft.webp';
import journeyFinish from '../assets/gold_journey_finish.webp';

const GoldPage = () => {
  const { collectionId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products: allProductsContext, collections } = useShop();
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
      if (priceFilter === 'under-20000') return val < 20000;
      if (priceFilter === '20000-40000') return val >= 20000 && val <= 40000;
      if (priceFilter === '40000-75000') return val > 40000 && val <= 75000;
      if (priceFilter === 'over-75000') return val > 75000;
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
          {/* 1. Hero Section - ORO Banner */}
          <section className="new-gold-hero oro-hero-banner" id="gold-hero-banner">
            <a 
              href="#gold-collection-start" 
              className="oro-banner-link"
              onClick={(e) => { 
                e.preventDefault(); 
                document.getElementById('gold-collection-start')?.scrollIntoView({ behavior: 'smooth' }); 
              }}
              aria-label="Explore ORO Gold Collection"
            >
              <img 
                loading="eager" 
                src={goldHero} 
                alt="ORO Gold Collection - Timeless Craftsmanship" 
                className="oro-hero-banner-img" 
              />
            </a>
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

        </>
      )}

      {/* Collection Grid - Placed above Golden Journey */}
      <section id="gold-collection-start" className="container" style={{maxWidth: '1400px', margin: '0 auto', padding: '0 2rem'}}>
        <DiamondGallery 
          theme="gold"
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
        <>
          {/* Golden Journey Section - Live HTML & Separated Images */}
          <section className="golden-journey-section" id="golden-journey-section">
            <div className="golden-journey-header">
              <span className="golden-journey-eyebrow">THE MAKING</span>
              <h2 className="golden-journey-title gold-serif">The golden journey</h2>
              <p className="golden-journey-subtitle">
                From first spark to final polish — four quiet steps behind every piece.
              </p>
            </div>

            <div className="golden-journey-grid">
              {/* Step 1 */}
              <div className="golden-journey-card">
                <div className="journey-arch-wrapper">
                  <img 
                    src={journeyInspiration} 
                    alt="Inspiration - Fine jewelry concept" 
                    loading="lazy" 
                  />
                </div>
                <div className="journey-card-content">
                  <span className="journey-roman">I</span>
                  <h3 className="journey-step-title">Inspiration</h3>
                  <p className="journey-step-desc">
                    Found in quiet places — old coins, pressed leaves, a line of light at dusk.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="golden-journey-card">
                <div className="journey-arch-wrapper">
                  <img 
                    src={journeyDesign} 
                    alt="Design - Hand-drawn jewelry sketch" 
                    loading="lazy" 
                  />
                </div>
                <div className="journey-card-content">
                  <span className="journey-roman">II</span>
                  <h3 className="journey-step-title">Design</h3>
                  <p className="journey-step-desc">
                    Each piece begins as a pencil drawing, refined until nothing can be removed.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="golden-journey-card">
                <div className="journey-arch-wrapper">
                  <img 
                    src={journeyCraft} 
                    alt="Craft - Artisan bench goldsmithing" 
                    loading="lazy" 
                  />
                </div>
                <div className="journey-card-content">
                  <span className="journey-roman">III</span>
                  <h3 className="journey-step-title">Craft</h3>
                  <p className="journey-step-desc">
                    Cast in solid 18k gold and worked by hand at the bench for hours, not minutes.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="golden-journey-card">
                <div className="journey-arch-wrapper">
                  <img 
                    src={journeyFinish} 
                    alt="Finish - Master polish and setting" 
                    loading="lazy" 
                  />
                </div>
                <div className="journey-card-content">
                  <span className="journey-roman">IV</span>
                  <h3 className="journey-step-title">Finish</h3>
                  <p className="journey-step-desc">
                    Polished until it holds light the way silk does — softly, never loudly.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}



          </div>
  );
};

export default GoldPage;
