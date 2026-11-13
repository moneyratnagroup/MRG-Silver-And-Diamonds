import React, { useState } from 'react';
import { ShieldCheck, Gem, Users, Truck, RotateCcw, BadgeCheck, Phone, HeartHandshake, Globe, TreePine, Award, Medal } from 'lucide-react';
import DiamondGallery from '../components/DiamondGallery';
import './GoldPage.css';

// Import images
import goldHero from '../assets/gold_hero2.webp';
import catRings from '../assets/cat_rings_layout.webp';
import featuredRing1 from '../assets/bng.webp';
import featuredRing2 from '../assets/chn.webp';
import featuredRing3 from '../assets/rng.webp';
import featuredRing4 from '../assets/br.webp';
import goldHeritageShowcase from '../assets/gold_heritage_showcase.webp';
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
  const [activeFeaturedTab, setActiveFeaturedTab] = useState('Top Seller');

  const featuredData = {
    'Top Seller': [
      { img: featuredRing1, title: 'THE AUTUMN EQUINOX' },
      { img: featuredRing2, title: 'Ring 2' },
      { img: featuredRing3, title: 'Ring 3' },
      { img: featuredRing4, title: 'Ring 4' }
    ]
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

      isActive: true
    }
  ];

  const displayProducts = staticGoldProducts;
  const showLanding = true;

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
      <section id="gold-collection-start" className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        <DiamondGallery
          theme="gold"
          itemsPerPage={12}
          products={displayProducts} 
          title="All Gold Jewelry" 
          tagline="Explore our exclusive All Gold jewelry."
          disableSidebarScroll={true}
        />
      </section>

      {showLanding && (
        <>
          {/* Golden Heritage Editorial Story Section */}
          <section className="mrg-gold-heritage-section" id="golden-heritage-section">
            <div className="mrg-gold-heritage-container">
              {/* Left Column: Gold Heritage Narrative & Trust Pillars */}
              <div className="mrg-gold-heritage-text-col">
                <div className="mrg-gold-heritage-eyebrow">
                  <span>THE GOLDEN HERITAGE</span>
                </div>

                <h2 className="mrg-gold-heritage-headline">
                  A Legacy of Pure Gold<br />
                  <span className="mrg-gold-heritage-headline-italic">Woven into Eternity</span>
                </h2>

                <p className="mrg-gold-heritage-description">
                  Every MRG gold creation is forged in certified BIS 916 hallmarked pure gold, celebrating generations of Indian heritage. Handcrafted by master karigars to hold auspicious warmth and grace for life’s most cherished beginnings.
                </p>

                {/* Craft Pillars */}
                <div className="mrg-gold-heritage-features">
                  <div className="gold-feature-item">
                    <div className="gold-feature-text">
                      <strong>BIS 916 Hallmarked Purity</strong>
                      <span>Guaranteed 22K &amp; 18K pure gold with laser-engraved HUID verification</span>
                    </div>
                  </div>
                  <div className="gold-feature-item">
                    <div className="gold-feature-text">
                      <strong>Master Goldsmith Artistry</strong>
                      <span>Intricate filigree, nakshi, and temple motifs crafted with time-honored bench techniques</span>
                    </div>
                  </div>
                  <div className="gold-feature-item">
                    <div className="gold-feature-text">
                      <strong>Zero Wastage Promise &amp; Lifetime Care</strong>
                      <span>100% transparent value assurance, lifetime buyback, and complimentary polishing</span>
                    </div>
                  </div>
                </div>

                <button 
                  className="mrg-gold-heritage-cta-btn"
                  onClick={() => {
                    const el = document.getElementById('gold-collection-start');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>EXPLORE GOLD COLLECTION</span>
                  <span className="gold-btn-arrow">→</span>
                </button>
              </div>

              {/* Right Column: Visual Showcase */}
              <div className="mrg-gold-heritage-visual-col">
                <div className="mrg-gold-heritage-image-wrapper">
                  <img 
                    src={goldHeritageShowcase} 
                    alt="MRG Fine 22K Gold Jewellery Suite on Emerald Silk" 
                    className="mrg-gold-heritage-main-img"
                    loading="lazy"
                  />
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
