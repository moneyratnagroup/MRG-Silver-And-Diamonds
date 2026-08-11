import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './CareGuide.css';

const CareCTA = () => {
  return (
    <section className="care-cta-section">
      <img 
        src="/finalCTABanner.png" 
        alt="Luxury Jewellery Background" 
        className="care-cta-bg" 
      />
      
      <motion.div 
        className="care-cta-content"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="care-heading-serif" style={{ fontSize: '3.5rem', margin: '0 0 20px' }}>
          Care for the Jewellery.<br />Preserve the Memory.
        </h2>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.6', opacity: 0.9, marginBottom: '40px' }}>
          Every piece tells a story. With the right care, its brilliance can remain part of yours for years to come.
        </p>
        
        <div className="care-cta-btns">
          <Link to="/products" className="care-cta-btn care-btn-solid">
            Explore Jewellery
          </Link>
          <Link to="/contact" className="care-cta-btn">
            Contact Us
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default CareCTA;
