import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import './CareGuide.css';

const dosList = [
  "Store jewellery individually",
  "Clean with suitable materials",
  "Put jewellery on after cosmetics",
  "Inspect clasps and settings periodically",
  "Keep jewellery dry when storing"
];

const dontsList = [
  "Expose jewellery to harsh chemicals",
  "Store pieces tangled together",
  "Use abrasive materials or toothbrushes",
  "Wear delicate pieces during heavy activity",
  "Use the same cleaning method for every gemstone"
];

const DosDonts = () => {
  return (
    <section className="care-section-padding dos-donts-section" style={{ position: 'relative', overflow: 'hidden' }}>
      <img 
        src="/do&donot.png" 
        alt="Do's and Don'ts Background" 
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3, zIndex: 0 }} 
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <span className="care-subheading-sans" style={{ color: 'white' }}>SUMMARY</span>
        <h2 className="care-heading-serif" style={{ fontSize: '3rem', marginTop: '10px', color: 'white' }}>Do's & Don'ts</h2>
        
        <div className="dd-grid">
          <motion.div 
            className="dd-card dd-do"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="dd-header care-heading-serif">
              <Check size={32} /> DO
            </div>
            <ul className="dd-list">
              {dosList.map((item, index) => (
                <li key={index}><Check size={20} /> {item}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            className="dd-card dd-dont"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="dd-header care-heading-serif">
              <X size={32} /> DON'T
            </div>
            <ul className="dd-list">
              {dontsList.map((item, index) => (
                <li key={index}><X size={20} /> {item}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default DosDonts;
