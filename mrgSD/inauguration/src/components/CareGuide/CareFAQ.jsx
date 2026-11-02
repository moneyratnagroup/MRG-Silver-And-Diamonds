import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import './CareGuide.css';

const faqs = [
  {
    q: 'Why does my silver jewellery tarnish?',
    a: 'Silver naturally tarnishes when it reacts with sulfur compounds in the air, moisture, and certain chemicals like perfumes or lotions. It is a natural process that can be managed with proper storage and occasional polishing.'
  },
  {
    q: 'Can I wear my silver jewellery while bathing?',
    a: 'It is highly recommended to remove silver jewellery before bathing, swimming, or entering hot tubs. Chlorine and harsh soaps can accelerate tarnishing and damage the metal over time.'
  },
  {
    q: 'How should I clean my diamond jewellery?',
    a: 'You can clean diamond jewellery at home by soaking it briefly in a gentle solution of warm water and mild dish soap, then gently brushing it with a soft baby toothbrush. Always rinse thoroughly and dry with a lint-free cloth.'
  },
  {
    q: 'How should I store silver jewellery?',
    a: 'Store silver in a cool, dry, and dark place. Ideally, keep pieces individually in airtight zip-lock bags with an anti-tarnish strip to prevent oxidation.'
  },
  {
    q: 'Can I use toothpaste to clean jewellery?',
    a: 'No, we strongly advise against using toothpaste. Toothpaste is abrasive and can cause microscopic scratches on both metals and softer gemstones, dulling their finish over time.'
  },
  {
    q: 'How often should jewellery be professionally inspected?',
    a: 'For pieces you wear frequently, especially those with prong settings like engagement rings, we recommend a professional inspection every 6 to 12 months to ensure stones remain secure.'
  },
  {
    q: 'Can all gemstones be cleaned in the same way?',
    a: 'No. While diamonds and sapphires can handle warm soapy water, porous stones like emeralds, opals, and pearls require extreme care and should only be cleaned with a slightly damp, soft cloth.'
  },
  {
    q: 'How should I store necklaces to prevent tangling?',
    a: 'Clasp the necklace before storing it, and either lay it completely flat in a designated box compartment or hang it vertically. Never throw multiple necklaces together in a single pouch.'
  }
];

const CareFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="care-section-padding">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div style={{ textAlign: 'center' }}>
          <span className="care-subheading-sans">KNOWLEDGE BASE</span>
          <h2 className="care-heading-serif" style={{ fontSize: '3rem', marginTop: '10px' }}>Frequently Asked Questions</h2>
        </div>

        <div className="faq-container">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="faq-item">
                <button 
                  className="faq-button"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  {faq.q}
                  <Plus size={20} className="faq-icon" />
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="faq-answer"
                    >
                      <div className="faq-answer-content">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default CareFAQ;
