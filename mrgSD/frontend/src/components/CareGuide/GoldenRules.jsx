import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Droplets, Grid, Sparkles, Activity, Search } from 'lucide-react';
import './CareGuide.css';

const rules = [
  {
    num: '01',
    title: 'Keep It Away From Chemicals',
    desc: 'Perfume, cosmetics, chlorine and household chemicals can affect jewellery. Apply these before wearing your pieces.',
    icon: FlaskConical
  },
  {
    num: '02',
    title: 'Remove Before Bathing',
    desc: 'Avoid wearing jewellery while showering, swimming or exercising to prevent damage from water and sweat.',
    icon: Droplets
  },
  {
    num: '03',
    title: 'Store It Separately',
    desc: 'Keep individual pieces separated in soft pouches or distinct compartments to prevent scratches and tangling.',
    icon: Grid
  },
  {
    num: '04',
    title: 'Clean It Gently',
    desc: 'Use appropriate jewellery-cleaning methods and soft cloths designed specifically for each metal and gemstone.',
    icon: Sparkles
  },
  {
    num: '05',
    title: 'Avoid Unnecessary Impact',
    desc: 'Remove delicate jewellery during activities where it may be knocked, bent, or exposed to heavy pressure.',
    icon: Activity
  },
  {
    num: '06',
    title: 'Inspect Regularly',
    desc: 'Check clasps, settings and stones periodically to ensure everything is secure before wearing.',
    icon: Search
  }
];

const GoldenRules = () => {
  return (
    <section className="care-section-padding golden-rules-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="care-subheading-sans">ESSENTIALS</span>
        <h2 className="care-heading-serif" style={{ fontSize: '3rem', marginTop: '10px' }}>The Golden Rules of Jewellery Care</h2>
        
        <div className="rules-grid">
          {rules.map((rule, index) => {
            const Icon = rule.icon;
            return (
              <motion.div 
                key={index}
                className="rule-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="rule-number">{rule.num}</div>
                <div className="rule-header">
                  <Icon size={20} style={{ color: 'var(--care-accent)' }} />
                  <h3 className="rule-title">{rule.title}</h3>
                </div>
                <p className="rule-desc">{rule.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default GoldenRules;
