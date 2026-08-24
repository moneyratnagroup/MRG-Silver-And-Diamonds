import React from 'react';
import { ArrowRight, Sparkles, Gem, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroDiamondsGold from '../assets/hero_diamonds_gold.png';
import earringsBg from '../assets/earrings_bg.png';
import presenceBg from '../assets/presence_bg.png';
import visionBg from '../assets/vision_bg.png';
import './AboutUs.css';

const AboutPage = () => {
  return (
    <div className="about-lumina-container">
      {/* Hero Section */}
        <section className="about-hero-split">
          <div className="hero-text-side">
            <h1 className="hero-title serif-text">
              Clarity.<br />
              Intention.<br />
              <span className="text-gold">Impact.</span>
            </h1>
            <div className="hero-subtitle-line"></div>
            <p className="hero-subtitle">
              SMART CRAFTSMANSHIP.<br />
              TIMELESS ELEGANCE.
            </p>
            <Link to="/collections" className="btn-lumina">
              DISCOVER YOURS <ArrowRight size={16} />
            </Link>
          </div>
          <div className="hero-image-side">
            <img 
              src={heroDiamondsGold} 
              alt="Golden diamond with swirls" 
            />
            <div className="vertical-tag">
              YOUR IDENTITY, ELEVATED.
            </div>
          </div>
        </section>

      {/* Leadership Section */}
      <section className="leadership-section">
        <div className="leadership-header">
          <h2 className="serif-text">The Visionaries</h2>
          <p>Our Journey & Legacy</p>
        </div>
        <div className="leadership-grid">
          {/* CMD */}
          <div className="leader-card">
            <img src={presenceBg} alt="CMD" className="leader-image" />
            <div className="leader-info">
              <h3 className="serif-text">Moneykantan Surya Venkata</h3>
              <span className="leader-role">Chairman & Managing Director</span>
              <p className="leader-message">
                "Our vision has always been to craft not just jewelry, but timeless legacies that speak to the soul of our patrons."
              </p>
              <p className="leader-journey">
                Starting with a clear vision, our CMD built MRG on the foundation of uncompromising quality and deep-rooted trust. His journey is a testament to the belief that true luxury lies in the details. Under his guidance, the brand has evolved into a symbol of smart craftsmanship and timeless elegance.
              </p>
            </div>
          </div>

          {/* Director */}
          <div className="leader-card">
            <img src={visionBg} alt="Director" className="leader-image" />
            <div className="leader-info">
              <h3 className="serif-text">Sajeesh</h3>
              <span className="leader-role">Director</span>
              <p className="leader-message">
                "We design for those who understand that true elegance is silent, yet profoundly impactful."
              </p>
              <p className="leader-journey">
                With an eye for aesthetics and a deep respect for traditional artistry, our Director has continuously pushed the boundaries of design. His journey involves bringing a fresh, modern perspective to classic jewelry, ensuring every piece resonates with the modern wearer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features 3-Column Section */}
      <section className="features-3col">
        <div className="feature-block dark video-bg-block">
          <img src={earringsBg} className="block-bg-video" alt="Diamond earrings" />
          <div className="block-content">
            <Sparkles size={32} className="feature-icon" strokeWidth={1} />
            <div className="feature-number">01</div>
            <h3 className="serif-text">VISION</h3>
            <p>
              We define the core of who you are and where you're going with bespoke pieces that resonate with your personal journey.
            </p>
          </div>
        </div>
        
        <div className="feature-block light">
          <Gem size={32} className="feature-icon" strokeWidth={1} />
          <div className="feature-number">02</div>
          <h3 className="serif-text">CRAFTSMANSHIP</h3>
          <p>
            We design a visual language that speaks before you do. Every diamond and silver cut is a testament to our precision.
          </p>
        </div>
        
        <div className="feature-block dark video-bg-block">
          <img src={presenceBg} className="block-bg-video" alt="Diamond ring on velvet" />
          <div className="block-content">
            <Sun size={32} className="feature-icon" strokeWidth={1} />
            <div className="feature-number">03</div>
            <h3 className="serif-text">PRESENCE</h3>
            <p>
              We build consistency across every touchpoint that matters, ensuring your elegance is felt in every room you enter.
            </p>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="showcase-section">
        <div className="showcase-image">
          <img 
            src={visionBg} 
            alt="Hand with diamond ring" 
          />
        </div>
        <div className="showcase-text">
          <div className="circular-badge">
            <span className="badge-text">
              THOUGHTFUL<br />—<br />INTELLIGENT<br />—<br />TIMELESS
            </span>
          </div>
          
          <h2 className="serif-text">
            True elegance<br />
            is silent.<br />
            Exceptional<br />craftsmanship<br />
            <span className="text-gold">is remembered.</span>
          </h2>
          <div className="showcase-line"></div>
          <p>
            We create pieces that don't chase attention. They earn recognition through subtle brilliance and unmatched quality.
          </p>
        </div>
      </section>

      {/* Bottom Quote Banner */}
      <section className="bottom-banner">
        <div className="quote-box">
          <div className="quote-mark">“</div>
          <div className="quote-divider"></div>
          <div className="quote-text">
            The most powerful pieces aren't the loudest.<br />
            They're the clearest.
          </div>
        </div>
        <Link to="/contact" className="legacy-link">
          LET'S BUILD YOUR LEGACY <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
};

export default AboutPage;
