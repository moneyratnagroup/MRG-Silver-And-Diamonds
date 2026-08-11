import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertTriangle, Wrench, ShieldAlert, Zap, HelpCircle, AlertCircle } from 'lucide-react';
import './CareGuide.css';

const issues = [
  { text: 'Loose stones or rattling settings', icon: AlertTriangle },
  { text: 'Damaged or stiff clasps', icon: Wrench },
  { text: 'Bent, worn, or broken prongs', icon: ShieldAlert },
  { text: 'Broken chains or stretched links', icon: Zap },
  { text: 'Significant, stubborn tarnishing', icon: AlertCircle },
  { text: 'Structural damage to the metal', icon: HelpCircle }
];

const ProfessionalCare = () => {
  return (
    <section className="care-section-padding prof-care-section" style={{ position: 'relative', overflow: 'hidden' }}>
      <img 
        src="/pcare.png" 
        alt="Professional Care Background" 
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3, zIndex: 0 }} 
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <span className="care-subheading-sans" style={{ color: 'white' }}>EXPERT SERVICE</span>
        <h2 className="care-heading-serif" style={{ fontSize: '3rem', margin: '10px 0 20px', color: 'white' }}>
          When Your Jewellery Needs Professional Care
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', maxWidth: '700px', margin: '0 auto' }}>
          Some maintenance should only be performed by a professional jeweller. Seek professional assistance immediately if you notice any of the following to prevent permanent damage or loss of stones.
        </p>

        <div className="prof-care-grid">
          {issues.map((issue, index) => {
            const Icon = issue.icon;
            return (
              <motion.div 
                key={index} 
                className="prof-issue"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Icon size={24} />
                <span>{issue.text}</span>
              </motion.div>
            );
          })}
        </div>

        <div style={{ marginTop: '50px' }}>
          <p style={{ marginBottom: '20px', fontSize: '18px' }}>Need Professional Assistance?</p>
          <Link to="/contact" className="care-cta-btn care-btn-solid">
            Contact Moneyratna
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default ProfessionalCare;
