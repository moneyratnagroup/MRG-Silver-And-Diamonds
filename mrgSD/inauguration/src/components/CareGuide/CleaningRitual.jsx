import React from 'react';
import { motion } from 'framer-motion';
import './CareGuide.css';

const steps = [
  { num: '01', title: 'Prepare', desc: 'Prepare a soft cloth and the appropriate cleaning materials.' },
  { num: '02', title: 'Clean', desc: 'Gently clean the jewellery using the correct method for the stone and metal.' },
  { num: '03', title: 'Rinse', desc: 'Remove any remaining residue where appropriate for the jewellery type.' },
  { num: '04', title: 'Dry', desc: 'Dry completely using a soft, clean, lint-free cloth.' },
  { num: '05', title: 'Store', desc: 'Return the jewellery to its individual storage space.' }
];

const CleaningRitual = () => {
  return (
    <section className="care-section-padding cleaning-ritual-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center' }}
      >
        <span className="care-subheading-sans">PROCESS</span>
        <h2 className="care-heading-serif" style={{ fontSize: '3rem', margin: '10px 0 20px' }}>A Gentle Cleaning Ritual</h2>
        <p style={{ color: 'var(--care-text-muted)', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
          Follow these five essential steps to maintain the brilliance and longevity of your pieces safely.
        </p>

        <div className="timeline-container">
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="timeline-step"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
            >
              <div className="step-marker"></div>
              <div className="step-num">{step.num}</div>
              <h4 className="step-title">{step.title}</h4>
              <p className="step-desc">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default CleaningRitual;
