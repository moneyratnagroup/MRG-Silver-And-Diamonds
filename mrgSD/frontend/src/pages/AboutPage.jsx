import React from 'react';
import { ArrowDown, Crown, Users, Gem, Star, ShieldCheck, Sparkles, HeartHandshake, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Asset imports based on listed files
import heroDiamondsGold from '../assets/hero_diamonds_gold.png';
import designSketch from '../assets/designsketch.png';
import designSketchhh from '../assets/designsketchhh.png';
import manikantanImg from '../assets/Manikantansir.webp';
import sajeshImg from '../assets/sajesh.webp';
import earringsBg from '../assets/earrings_bg.webp';
import presenceBg from '../assets/presence_bg.webp';
import visionBg from '../assets/vision_bg.webp';
import catNecklacesLayout from '../assets/cat_necklaces_layout.webp';
import catBraceletsLayout from '../assets/cat_bracelets_layout.webp';

import './AboutUs.css';

const AboutPage = () => {
  return (
    <div className="about-lumina-container">
      
      {/* 1. Hero Section */}
      <section className="about-hero-section">
        <div className="hero-bg-overlay"></div>
        <img loading="lazy" src={heroDiamondsGold} alt="Hero Background" className="hero-bg-image" />
        
        <div className="hero-content">
          <div className="hero-left">
            <h1 className="hero-title serif-text">ABOUT US</h1>
            <h2 className="hero-subtitle">CRAFTING ELEGANCE. CELEBRATING MOMENTS.</h2>
            <div className="hero-divider"></div>
            <p className="hero-description">
              At Moneyratna Jewellery, we believe jewellery is more than an accessory — it is a reflection of love, tradition and timeless beauty. Our journey is built on trust, quality and a passion for creating jewellery that becomes part of your story.
            </p>
            <button className="btn-discover" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
              DISCOVER OUR STORY <ArrowDown size={16} />
            </button>
          </div>
          
          <div className="hero-right">
            <div className="vertical-text">
              TRADITION<br />MEETS<br />TIMELESS<br />BEAUTY
            </div>
          </div>
        </div>
      </section>

      {/* 2. Our Story Section */}
      <section className="story-section">
        <div className="story-left">
          <div className="story-image-collage">
            <img loading="lazy" src={designSketch} alt="Design Sketch" className="story-img-main" />
            <img loading="lazy" src={designSketchhh} alt="Ring" className="story-img-sub" />
          </div>
        </div>
        <div className="story-right">
          <span className="section-eyebrow text-gold">OUR STORY</span>
          <h2 className="section-title serif-text">More Than Jewellery,<br/>A Story of Trust</h2>
          <p className="section-text">
            Moneyratna Jewellery is a proud venture of Moneyratna Groups, built on a legacy of trust and a vision for a brighter, more beautiful tomorrow. We bring together traditional craftsmanship and contemporary designs to create jewellery that celebrates life's most precious moments.
          </p>
          <div className="story-stats">
            <div className="stat-item">
              <Crown className="stat-icon" size={24} />
              <span>Years of<br/>Excellence</span>
            </div>
            <div className="stat-item">
              <Users className="stat-icon" size={24} />
              <span>Happy<br/>Customers</span>
            </div>
            <div className="stat-item">
              <Gem className="stat-icon" size={24} />
              <span>Exclusive<br/>Designs</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Leadership Section */}
      <section className="leadership-split-section">
        <div className="leader-box dark-theme">
          <h3 className="leader-section-title">CHAIRMAN'S MESSAGE</h3>
          <div className="leader-divider"></div>
          <div className="leader-content-row">
            <div className="leader-photo-wrapper left-side">
              <img loading="lazy" src={manikantanImg} alt="Chairman" className="leader-photo" />
            </div>
            <div className="leader-text-wrapper">
              <div className="quote-icon">“</div>
              <p className="leader-quote">
                Jewellery is not merely something we wear; it is something we cherish. With our jewellery venture, we aim to create lasting relationships with our customers through quality, authenticity and personalized service.
              </p>
              <div className="leader-name">
                <strong>Chairman</strong><br/>
                Moneyratna Groups
              </div>
            </div>
          </div>
        </div>

        <div className="leader-box light-theme">
          <h3 className="leader-section-title">DIRECTOR'S MESSAGE</h3>
          <div className="leader-divider"></div>
          <div className="leader-content-row reverse">
            <div className="leader-photo-wrapper right-side">
              <img loading="lazy" src={sajeshImg} alt="Director" className="leader-photo" />
            </div>
            <div className="leader-text-wrapper">
              <div className="quote-icon">“</div>
              <p className="leader-quote">
                Our vision is to create a brand that beautifully combines tradition, elegance and modernity. We are committed to offering exquisite jewellery, a memorable shopping experience and a future built on trust, innovation and customer satisfaction.
              </p>
              <div className="leader-name">
                <strong>Director</strong><br/>
                Moneyratna Groups
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Vision & Mission Section */}
      <div className="vm-main-header">
        <h4 className="vm-sub-title">VISION & MISSION</h4>
        <h2 className="vm-main-title serif-text text-gold">A LEGACY OF ELEGANCE</h2>
      </div>
      <section className="vision-mission-section">
        <div className="vm-container">
          <div className="vm-box">
            <div className="watermark-v">V</div>
            <div className="vm-content-wrapper">
              <div className="vm-header">
                <h3 className="serif-text text-gold">OUR VISION</h3>
              </div>
              <p>
                To become a trusted and admired jewellery brand known for quality, elegance, authenticity and exceptional customer experience, while creating timeless jewellery that becomes part of life's most cherished moments.
              </p>
            </div>
          </div>
          <div className="vm-separator"></div>
          <div className="vm-box">
            <div className="watermark-m">M</div>
            <div className="vm-content-wrapper">
              <div className="vm-header">
                <h3 className="serif-text text-gold">OUR MISSION</h3>
              </div>
              <p>
                To provide high-quality, authentic and beautifully crafted jewellery with transparent pricing and exceptional service. We strive to combine traditional craftsmanship with contemporary designs and build long-lasting relationships through trust and integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Our Values Section */}
      <section className="values-section">
        <h2 className="values-title serif-text">OUR VALUES</h2>
        <div className="values-grid">
          <div className="value-item">
            <div className="value-icon-wrapper">
              <HeartHandshake size={32} strokeWidth={1.5} />
            </div>
            <h4>TRUST</h4>
            <p>Building relationships through honesty and transparency.</p>
          </div>
          <div className="value-item">
            <div className="value-icon-wrapper">
              <ShieldCheck size={32} strokeWidth={1.5} />
            </div>
            <h4>QUALITY</h4>
            <p>Committed to exceptional quality and craftsmanship.</p>
          </div>
          <div className="value-item">
            <div className="value-icon-wrapper">
              <Sparkles size={32} strokeWidth={1.5} />
            </div>
            <h4>INNOVATION</h4>
            <p>Blending tradition with contemporary design.</p>
          </div>
          <div className="value-item">
            <div className="value-icon-wrapper">
              <Gem size={32} strokeWidth={1.5} />
            </div>
            <h4>ELEGANCE</h4>
            <p>Creating designs that celebrate timeless beauty.</p>
          </div>
          <div className="value-item">
            <div className="value-icon-wrapper">
              <Users size={32} strokeWidth={1.5} />
            </div>
            <h4>CUSTOMER FIRST</h4>
            <p>Making every customer experience memorable.</p>
          </div>
        </div>
      </section>

      {/* 6. Gallery / Sparkle Section */}
      <section className="gallery-section">
        <div className="gallery-grid">
          <img loading="lazy" src={catNecklacesLayout} alt="Jewellery 1" />
          <img loading="lazy" src={catBraceletsLayout} alt="Jewellery 2" />
          <img loading="lazy" src={presenceBg} alt="Jewellery 3" />
          <img loading="lazy" src={visionBg} alt="Jewellery 4" />
        </div>
        <div className="gallery-center-card">
          <span className="serif-text">EVERY OCCASION<br/>DESERVES A LITTLE<br/>SPARKLE</span>
          <div className="gallery-divider"></div>
        </div>
      </section>

      {/* 7. Final CTA Section */}
      <div className="about-footer-spacer"></div>

    </div>
  );
};

export default AboutPage;
