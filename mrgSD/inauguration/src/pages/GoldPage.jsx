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
import goldHero from '../assets/gold_hero2.webp';
import catRings from '../assets/cat_rings_layout.webp';
import featuredRing1 from '../assets/bng.webp';
import featuredRing2 from '../assets/chn.webp';
import featuredRing3 from '../assets/rng.webp';
import featuredRing4 from '../assets/br.webp';
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
import goldBangle1 from '../assets/gold bangle1.webp';
import goldBracelet1 from '../assets/gold bracelet1.webp';
import goldBracelet2 from '../assets/gold bracelet2.webp';
import goldBracelet3 from '../assets/gold bracelet3.webp';
import goldChain1 from '../assets/gold chain1.webp';
import goldNecklace2 from '../assets/gold necklace2.webp';
import goldRing1 from '../assets/gold ring1.webp';
import goldBng2 from '../assets/gold_bng2.webp';
import goldNecklace1 from '../assets/gold_necklace1.webp';

const GoldPage = () => {
  const { collectionId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products: allProductsContext, collections } = useShop();
  const [isFilterOpen, setIsFilterOpen] = useState((collectionId === 'all' || !collectionId) && window.innerWidth > 992);
  const [sortOption, setSortOption] = useState('default');
  const [activeFeaturedTab, setActiveFeaturedTab] = useState('Top Seller');

  const featuredData = {
    'Top Seller': [
      { img: featuredRing1, title: 'THE AUTUMN EQUINOX' },
      { img: featuredRing2, title: 'Ring 2' },
      { img: featuredRing3, title: 'Ring 3' },
      { img: featuredRing4, title: 'Ring 4' }
    ],
    'Sale': [
      { img: saleItem1, title: 'ANTIQUE JHUMKA SET' },
      { img: saleItem2, title: 'PEACOCK CHOKER' },
      { img: saleItem3, title: 'GOLDEN CRESCENT' },
      { img: saleItem4, title: 'FLORAL ELEGANCE' }
    ],
    'Top Rated': [
      { img: topRatedItem1, title: 'ROYAL EMERALD DROP' },
      { img: topRatedItem2, title: 'DIAMOND LEAF CASCADE' },
      { img: topRatedItem3, title: 'GEOMETRIC CHOKER' },
      { img: topRatedItem4, title: 'CLUSTER DIAMOND BANGLES' }
    ],
    'Featured': [
      { img: featuredItem1, title: 'POLKI DELIGHT' },
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

  const staticGoldProducts = [
    {
      id: 'gold-bangle-1',
      sku: 'MRG-GLD-BNG-001',
      name: 'Spiral Fluted Gold Bangle',
      category: 'Bangles',
      collections: [{ id: 1, name: 'Gold' }, { id: 'women', name: "Women's Collection" }],
      occasions: [{ id: 'daily', name: 'Daily Wear' }, { id: 'festive', name: 'Festive' }],
      metal: 'Gold',
      purity: '22K',
      badge: 'TRENDING NOW',
      img: goldBangle1,
      hoverImage: goldBangle1,
      images: [goldBangle1],
      desc: 'Sculptural 22K yellow gold bangle with diagonal spiral fluting and exquisite textured craftsmanship.',
      stockQuantity: 8,
      status: 'PUBLISHED',
      isActive: true
    },
    {
      id: 'gold-bracelet-1',
      sku: 'MRG-GLD-BRC-001',
      name: 'Two-Tone Beaded Charm Gold Bracelet',
      category: 'Bracelets',
      collections: [{ id: 1, name: 'Gold' }, { id: 'women', name: "Women's Collection" }],
      occasions: [{ id: 'daily', name: 'Daily Wear' }, { id: 'festive', name: 'Festive' }],
      metal: 'Gold',
      purity: '22K',
      badge: 'NEW ARRIVAL',
      img: goldBracelet1,
      hoverImage: goldBracelet1,
      images: [goldBracelet1],
      desc: 'Dainty 22K gold chain bracelet featuring alternating textured fluted gold and shimmering rhodium-accented beads.',
      stockQuantity: 10,
      status: 'PUBLISHED',
      isActive: true
    },
    {
      id: 'gold-bracelet-2',
      sku: 'MRG-GLD-BRC-002',
      name: 'Celestial Charms Gold Bracelet',
      category: 'Bracelets',
      collections: [{ id: 1, name: 'Gold' }, { id: 'women', name: "Women's Collection" }],
      occasions: [{ id: 'daily', name: 'Daily Wear' }, { id: 'festive', name: 'Festive' }],
      metal: 'Gold',
      purity: '22K',
      badge: 'MINIMALIST',
      img: goldBracelet2,
      hoverImage: goldBracelet2,
      images: [goldBracelet2],
      desc: 'Playful 22K yellow gold link bracelet adorned with dangling stars, blooming flora, and textured two-tone disc charms.',
      stockQuantity: 10,
      status: 'PUBLISHED',
      isActive: true
    },
    {
      id: 'gold-bracelet-3',
      sku: 'MRG-GLD-BRC-003',
      name: 'Royal Sapphire Station Gold Bracelet',
      category: 'Bracelets',
      collections: [{ id: 1, name: 'Gold' }, { id: 'women', name: "Women's Collection" }],
      occasions: [{ id: 'daily', name: 'Daily Wear' }, { id: 'festive', name: 'Festive' }],
      metal: 'Gold',
      purity: '22K',
      badge: 'AESTHETIC',
      img: goldBracelet3,
      hoverImage: goldBracelet3,
      images: [goldBracelet3],
      desc: 'Refined 22K gold link bracelet set with vibrant emerald-cut royal blue sapphire stations.',
      stockQuantity: 8,
      status: 'PUBLISHED',
      isActive: true
    },
    {
      id: 'gold-chain-1',
      sku: 'MRG-GLD-CHN-001',
      name: 'Onyx & Pearl Delicate Gold Chain',
      category: 'Chains',
      collections: [{ id: 1, name: 'Gold' }, { id: 'women', name: "Women's Collection" }],
      occasions: [{ id: 'daily', name: 'Daily Wear' }, { id: 'festive', name: 'Festive' }],
      metal: 'Gold',
      purity: '22K',
      badge: 'BESTSELLER',
      img: goldChain1,
      hoverImage: goldChain1,
      images: [goldChain1],
      desc: 'Delicate 22K gold chain adorned with bezel-set black onyx stones and luminous freshwater pearl accents.',
      stockQuantity: 10,
      status: 'PUBLISHED',
      isActive: true
    },
    {
      id: 'gold-necklace-2',
      sku: 'MRG-GLD-NCK-002',
      name: 'Royal Heritage Filigree Gold Necklace',
      category: 'Chains',
      collections: [{ id: 1, name: 'Gold' }, { id: 'women', name: "Women's Collection" }],
      occasions: [{ id: 'bridal', name: 'Bridal' }, { id: 'festive', name: 'Festive' }],
      metal: 'Gold',
      purity: '22K',
      badge: 'ELEVATE YOUR EVERYDAY',
      img: goldNecklace2,
      hoverImage: goldNecklace2,
      images: [goldNecklace2],
      desc: 'Majestic 22K yellow gold necklace handcrafted with articulated links, ornate filigree drops, and tiered geometric charms.',
      stockQuantity: 6,
      status: 'PUBLISHED',
      isActive: true
    },
    {
      id: 'gold-ring-1',
      sku: 'MRG-GLD-RNG-001',
      name: 'Pavé Diamond Swirl Gold Ring',
      category: 'Rings',
      collections: [{ id: 1, name: 'Gold' }, { id: 'women', name: "Women's Collection" }],
      occasions: [{ id: 'daily', name: 'Daily Wear' }, { id: 'festive', name: 'Festive' }],
      metal: 'Gold',
      purity: '18K',
      badge: 'TRENDING NOW',
      img: goldRing1,
      hoverImage: goldRing1,
      images: [goldRing1],
      desc: 'Graceful 18K gold ring featuring an intertwined double-scroll motif encrusted with shimmering pavé diamonds.',
      stockQuantity: 12,
      status: 'PUBLISHED',
      isActive: true
    },
    {
      id: 'gold-bng-2',
      sku: 'MRG-GLD-BNG-002',
      name: 'Filigree Wave Engraved Gold Bangle',
      category: 'Bangles',
      collections: [{ id: 1, name: 'Gold' }, { id: 'women', name: "Women's Collection" }],
      occasions: [{ id: 'daily', name: 'Daily Wear' }, { id: 'festive', name: 'Festive' }],
      metal: 'Gold',
      purity: '22K',
      badge: 'NEW ARRIVAL',
      img: goldBng2,
      hoverImage: goldBng2,
      images: [goldBng2],
      desc: 'Artisanal 22K yellow gold bangle detailed with flowing wave engravings and fine milgrain bordering.',
      stockQuantity: 8,
      status: 'PUBLISHED',
      isActive: true
    },
    {
      id: 'gold-necklace-1',
      sku: 'MRG-GLD-NCK-001',
      name: 'Botanical Crest Filigree Gold Necklace',
      category: 'Chains',
      collections: [{ id: 1, name: 'Gold' }, { id: 'women', name: "Women's Collection" }],
      occasions: [{ id: 'bridal', name: 'Bridal' }, { id: 'festive', name: 'Festive' }],
      metal: 'Gold',
      purity: '22K',
      badge: 'MINIMALIST',
      img: goldNecklace1,
      hoverImage: goldNecklace1,
      images: [goldNecklace1],
      desc: 'Intricately embossed 22K gold leaf-link necklace centered with a floral crest medallion and dangling droplet.',
      stockQuantity: 6,
      status: 'PUBLISHED',
      isActive: true
    }
  ];

  // Curated gold products (excluding database items as requested)
  let goldProducts = [...staticGoldProducts];

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
               
<div className="jared-featured-grid">
                 {featuredData[activeFeaturedTab].map((item, index) => (
                   <div key={index} className="jared-featured-card">
                     <img loading="lazy" src={item.img} alt={item.title || `Ring ${index + 1}`} />
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
          itemsPerPage={12}
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
                <FilterSidebarContent metal="gold" />
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



      <FilterDrawer isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} theme="gold" metal="gold" />
    </div>
  );
};

export default GoldPage;
