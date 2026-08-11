import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import './CareGuide.css';

const CareHero = () => {
  const scrollToNav = () => {
    const navSection = document.getElementById('care-nav');
    if (navSection) {
      navSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="care-hero">
      <div className="care-hero-bg">
        {/* Using uploaded premium dark jewellery photography */}
        <img src="/jcarehero.png" alt="Luxury Jewellery Background" />
      </div>
      <div className="care-hero-gradient"></div>
      
      <motion.div 
        className="care-hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <span className="care-subheading-sans" style={{ color: '#fff' }}>JEWELLERY CARE</span>
        <h1 className="care-hero-title care-heading-serif">Jewellery Care Guide</h1>
        <p className="care-hero-subtitle">
          Preserve the brilliance. Protect the beauty. Treasure it for generations.
        </p>
        
        <button onClick={scrollToNav} className="care-cta-btn">
          Explore Care Tips
        </button>
      </motion.div>
      
      <div className="care-scroll-indicator" onClick={scrollToNav}>
        <span style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' }}>Scroll</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
};

export default CareHero;
