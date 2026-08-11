import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Info } from 'lucide-react';
import './CareGuide.css';

const JewelleryCareSection = ({ id, reverse, heading, subheading, desc, dos, donts, careTip, img, bgWhite }) => {
  return (
    <section id={id} className={`care-section-padding editorial-section ${bgWhite ? 'bg-white' : ''}`}>
      <div className={`editorial-row ${reverse ? 'reverse' : ''}`}>
        
        <motion.div 
          className="editorial-image-col"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="editorial-image-wrapper">
            <img src={img} alt={heading} />
          </div>
        </motion.div>

        <motion.div 
          className="editorial-content-col"
          initial={{ opacity: 0, x: reverse ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="care-subheading-sans">{subheading}</span>
          <h2 className="editorial-title care-heading-serif">{heading}</h2>
          <p className="editorial-desc">{desc}</p>

          <div className="do-avoid-grid">
            <div className="do-col">
              <h4><Check size={18} /> DO</h4>
              <ul className="do-avoid-list">
                {dos.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="avoid-col">
              <h4><X size={18} /> AVOID</h4>
              <ul className="do-avoid-list">
                {donts.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {careTip && (
            <div className={`care-tip-box ${!bgWhite ? 'dark' : ''}`}>
              <Info size={24} style={{ color: bgWhite ? 'var(--care-accent)' : 'white' }} />
              <p><strong>Care Tip:</strong> {careTip}</p>
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
};

export default JewelleryCareSection;
