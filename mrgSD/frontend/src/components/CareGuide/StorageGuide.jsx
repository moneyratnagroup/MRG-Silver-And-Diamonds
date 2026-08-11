import React from 'react';
import { motion } from 'framer-motion';
import './CareGuide.css';

const StorageGuide = () => {
  return (
    <section className="care-section-padding">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="storage-grid">
          
          <div>
            <span className="care-subheading-sans">STORAGE</span>
            <h2 className="care-heading-serif" style={{ fontSize: '3rem', margin: '10px 0 30px' }}>Where Beauty Rests Matters</h2>
            
            <div className="storage-items">
              <div className="storage-item">
                <h4>Rings</h4>
                <p>Store individually in ring slots to prevent scratches on the band or stones.</p>
              </div>
              <div className="storage-item">
                <h4>Necklaces</h4>
                <p>Store separately and flat, or hang them to avoid tangling and knotting of delicate chains.</p>
              </div>
              <div className="storage-item">
                <h4>Earrings</h4>
                <p>Keep pairs together and secure backs so they don't get lost or scratch other pieces.</p>
              </div>
              <div className="storage-item">
                <h4>Silver</h4>
                <p>Use dry, airtight storage when possible with anti-tarnish strips to prevent oxidation.</p>
              </div>
              <div className="storage-item">
                <h4>Delicate Jewellery</h4>
                <p>Use soft individual velvet or silk pouches for extra protection against dust and impact.</p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <img 
              src="/jewelleryBox.png" 
              alt="Premium Jewellery Box" 
              className="storage-image" 
            />
          </motion.div>
          
        </div>
      </motion.div>
    </section>
  );
};

export default StorageGuide;
