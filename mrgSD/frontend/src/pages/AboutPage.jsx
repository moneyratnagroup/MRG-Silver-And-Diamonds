import React, { useEffect } from 'react';
import { Crown, Users, Gem, Star, ShieldCheck, Sparkles, HeartHandshake, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Asset imports based on listed files
import aboutHeroClean from '../assets/about_hero_clean.webp';
import manikantanImg from '../assets/Manikantansir.webp';
import sajeshImg from '../assets/sajesh.webp';
import earringsBg from '../assets/earrings_bg.webp';
import presenceBg from '../assets/presence_bg.webp';
import visionBg from '../assets/vision_bg.webp';
import catNecklacesLayout from '../assets/cat_necklaces_layout.webp';
import catBraceletsLayout from '../assets/cat_bracelets_layout.webp';
import abtImg from '../assets/abt_img.webp';

import './AboutUs.css';

const AboutPage = () => {
  useEffect(() => {
    document.body.classList.add('about-hide-scrollbar');
    return () => {
      document.body.classList.remove('about-hide-scrollbar');
    };
  }, []);

  return (
    <div className="about-lumina-container">

      {/* 1. Hero Section (Editorial Luxury Banner with Live Typography) */}
      <section className="about-hero-banner-section">
        <div className="about-hero-backdrop-wrap">
          <img
            loading="eager"
            src={aboutHeroClean}
            alt="About Us - Moneyratna Jewellery"
            className="about-hero-bg-img"
          />
        </div>

        <div className="about-hero-editorial-overlay">
          <div className="about-hero-editorial-content">
            {/* Main Headline with Serif Grace & Italic Gold Accent */}
            <h1 className="about-hero-title">
              A Legacy of Trust &amp; <br />
              <span className="about-hero-title-accent">Timeless Beauty</span>
            </h1>

            {/* Bespoke Jewellery Hairline Divider */}
            <div className="about-hero-divider">
              <span className="about-divider-line"></span>
              <span className="about-divider-diamond">✦</span>
              <span className="about-divider-line"></span>
            </div>

            {/* Refined Narrative Prose */}
            <p className="about-hero-prose">
              At Moneyratna Jewellery, we believe jewellery is more than an accessory —
              it is an enduring reflection of love, devotion, and sacred milestones.
              Handcrafted with generational mastery, every creation is designed to become
              a treasured part of your life&apos;s story.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Our Story & Craftsmanship Section (Simple Editorial Layout) */}
      <section className="story-section atelier-heritage-section" id="about-heritage-craft">
        <div className="atelier-container simple-heritage-container">

          {/* Section Header */}
          <div className="atelier-header">
            <span className="atelier-eyebrow">OUR HERITAGE & CRAFT</span>
            <h2 className="atelier-title serif-text">
              More Than Jewellery,<br />
              <span className="atelier-title-italic">A Story of Enduring Trust</span>
            </h2>
            <div className="atelier-header-separator">
              <span className="sep-line"></span>
              <span className="sep-diamond">◇</span>
              <span className="sep-line"></span>
            </div>
          </div>

          {/* Central Manifesto Quote Card */}
          <div className="manifesto-quote-card simple-quote-card">
            <div className="quote-accent-mark" aria-hidden="true">
              <Gem size={17} strokeWidth={1.5} />
            </div>
            <blockquote className="manifesto-quote-text serif-text">
              “At Moneyratna Jewellery, we believe jewellery is more than an ornament — it is an expression of love, a celebration of life's precious moments, and a legacy passed through generations.

              As part of the Moneyratna Group, established in 2022, we bring together the values of trust, transparency, quality, and customer commitment to create a jewellery experience that is both meaningful and memorable.

              Blending timeless traditions with contemporary elegance, our thoughtfully curated collections celebrate individuality, craftsmanship, and the beauty of every occasion.”
            </blockquote>
            <div className="manifesto-quote-author">
              <span className="author-label">THE MONEYRATNA PROMISE</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Leadership Section */}
      <section className="leadership-section" id="about-leadership">
        <div className="leadership-container">

          {/* Section Header */}
          <div className="leadership-header">
            <span className="leadership-eyebrow">LEADERSHIP</span>
            <h2 className="leadership-title serif-text">Words From Our Leadership</h2>
            <div className="leadership-separator">
              <span className="sep-line"></span>
              <span className="sep-diamond">◇</span>
              <span className="sep-line"></span>
            </div>
          </div>

          {/* Dual Leadership Cards */}
          <div className="leadership-grid">

            {/* Chairman Card (Dark Navy) */}
            <div className="leader-card leader-card-dark">
              <div className="leader-photo-wrapper">
                <div className="leader-photo-accent-frame" aria-hidden="true"></div>
                <div className="leader-photo-container">
                  <img loading="lazy" src={manikantanImg} alt="Chairman - Moneyratna Group" className="leader-photo" />
                </div>
              </div>
              <div className="leader-info-content">
                <div className="leader-quote-icon" aria-hidden="true">“</div>
                <blockquote className="leader-quote-text serif-text">
                  Jewellery is not merely something we wear; it is something we cherish. With our journey since 1999, we are committed to strengthening trust with our customers through quality, authenticity and personalized service.
                </blockquote>
                <div className="leader-meta">
                  <span className="leader-designation">Chairman</span>
                  <span className="leader-company">Moneyratna Group</span>
                </div>
              </div>
            </div>

            {/* Director Card (Light Cream) */}
            <div className="leader-card leader-card-light">
              <div className="leader-photo-wrapper">
                <div className="leader-photo-accent-frame" aria-hidden="true"></div>
                <div className="leader-photo-container">
                  <img loading="lazy" src={sajeshImg} alt="Director - Moneyratna Group" className="leader-photo" />
                </div>
              </div>
              <div className="leader-info-content">
                <div className="leader-quote-icon" aria-hidden="true">“</div>
                <blockquote className="leader-quote-text serif-text">
                  Our vision is to create a brand that beautifully combines tradition, elegance and modernity. We are committed to offering an expansive jewellery shopping experience and a culture built on trust, innovation and customer satisfaction.
                </blockquote>
                <div className="leader-meta">
                  <span className="leader-designation">Director</span>
                  <span className="leader-company">Moneyratna Group</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Vision & Mission Section */}
      <section className="vision-mission-section" id="about-vision-mission">
        <div className="watermark-v" aria-hidden="true">V</div>
        <div className="watermark-m" aria-hidden="true">M</div>

        <div className="vm-container-wrapper">
          {/* Section Header */}
          <div className="vm-section-header">
            <span className="vm-eyebrow">VISION & MISSION</span>
            <h2 className="vm-title serif-text">A Legacy of Elegance</h2>
            <div className="vm-separator">
              <span className="sep-line"></span>
              <span className="sep-diamond">◇</span>
              <span className="sep-line"></span>
            </div>
          </div>

          {/* Symmetrical Columns */}
          <div className="vm-columns-container">
            <div className="vm-column">
              <h3 className="vm-column-title serif-text">Our Vision</h3>
              <p className="vm-column-text">
                To become a trusted and admired jewellery brand known for quality, elegance, authenticity and exceptional customer experience — while creating timeless jewellery that becomes part of life's most cherished moments.
              </p>
            </div>

            <div className="vm-column-divider" aria-hidden="true"></div>

            <div className="vm-column">
              <h3 className="vm-column-title serif-text">Our Mission</h3>
              <p className="vm-column-text">
                To provide high-quality, authentic and beautifully crafted jewellery that celebrates elegance and exceptional artistry. We strive to combine traditional craftsmanship with contemporary design and build long-lasting relationships through trust and integrity.
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
          <span className="serif-text">EVERY OCCASION<br />DESERVES A LITTLE<br />SPARKLE</span>
          <div className="gallery-divider"></div>
        </div>
      </section>

      {/* 7. Final CTA Section */}
      <div className="about-footer-spacer"></div>

    </div>
  );
};

export default AboutPage;
