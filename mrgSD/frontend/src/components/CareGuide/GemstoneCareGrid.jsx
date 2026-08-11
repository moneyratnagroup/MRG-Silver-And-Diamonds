import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Droplet, ShieldAlert, Archive } from 'lucide-react';
import './CareGuide.css';

const gemstones = [
  {
    name: 'Ruby',
    desc: 'Extremely durable, making them perfect for daily wear. However, heat treatments can be affected by extreme temperature changes.',
    cleaning: 'Warm soapy water and a soft brush.',
    water: 'Safe for brief exposure.',
    chemical: 'Avoid harsh chemicals.',
    storage: 'Store separately as they can scratch softer stones.',
    img: 'https://images.unsplash.com/photo-1605100804763-247f529cb665?q=80&w=500&auto=format&fit=crop'
  },
  {
    name: 'Emerald',
    desc: 'Naturally highly included (fractured) and often treated with oils. They require delicate care and are not suited for everyday heavy wear.',
    cleaning: 'Mild soap and water only. NEVER use ultrasonic cleaners.',
    water: 'Avoid submerging in water for long periods.',
    chemical: 'Avoid all chemicals, solvents, and heat.',
    storage: 'Wrap in soft tissue or cloth.',
    img: '/EJcare.png'
  },
  {
    name: 'Sapphire',
    desc: 'Very durable and excellent for daily wear, second only to diamonds in hardness.',
    cleaning: 'Warm soapy water or ultrasonic cleaners (if untreated).',
    water: 'Safe for normal exposure.',
    chemical: 'Resistant to most chemicals, but avoid strong acids.',
    storage: 'Store individually to prevent scratching other jewellery.',
    img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=500&auto=format&fit=crop'
  },
  {
    name: 'Pearl',
    desc: 'Organic and extremely delicate. Pearls easily lose their luster if exposed to chemicals, cosmetics, or acidic perspiration.',
    cleaning: 'Wipe gently with a soft, damp cloth after every wear.',
    water: 'Do not submerge. Keep away from water to protect the silk thread.',
    chemical: 'Strictly avoid perfume, hairspray, and cosmetics. Last on, first off.',
    storage: 'Store flat in a soft pouch. Do not hang pearl necklaces.',
    img: 'https://images.unsplash.com/photo-1515562141207-7a8ea3a19b88?q=80&w=500&auto=format&fit=crop'
  }
];

const GemstoneCareGrid = () => {
  return (
    <section id="gemstone-care" className="care-section-padding bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="care-subheading-sans">GEMSTONES</span>
        <h2 className="care-heading-serif" style={{ fontSize: '3rem', marginTop: '10px' }}>Every Gemstone Is Different</h2>
        <p style={{ color: 'var(--care-text-muted)', fontSize: '16px', maxWidth: '700px', marginBottom: '30px' }}>
          Different stones require different levels of care. Never assume that a cleaning method suitable for one gemstone is safe for another.
        </p>

        <div className="gemstone-grid">
          {gemstones.map((gem, index) => (
            <motion.div 
              key={index} 
              className="gem-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img src={gem.img} alt={gem.name} className="gem-img" />
              <div className="gem-content">
                <h3 className="gem-name care-heading-serif">{gem.name}</h3>
                <p className="gem-desc">{gem.desc}</p>
                
                <div className="gem-specs">
                  <div className="gem-spec-item">
                    <Sparkles size={16} />
                    <div className="gem-spec-text"><strong>Cleaning</strong>{gem.cleaning}</div>
                  </div>
                  <div className="gem-spec-item">
                    <Droplet size={16} />
                    <div className="gem-spec-text"><strong>Water</strong>{gem.water}</div>
                  </div>
                  <div className="gem-spec-item">
                    <ShieldAlert size={16} />
                    <div className="gem-spec-text"><strong>Chemicals</strong>{gem.chemical}</div>
                  </div>
                  <div className="gem-spec-item">
                    <Archive size={16} />
                    <div className="gem-spec-text"><strong>Storage</strong>{gem.storage}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default GemstoneCareGrid;
