import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Gem, Sun, Sparkles, Droplet } from 'lucide-react';
import './CareGuide.css';

const navItems = [
  {
    id: 'diamond-care',
    title: 'Diamond Care',
    desc: 'Keep your diamonds brilliant and secure.',
    icon: Gem,
    img: '/DJCare.png'
  },
  {
    id: 'silver-care',
    title: 'Silver Care',
    desc: 'Prevent tarnish and keep silver shining.',
    icon: Sparkles,
    img: '/SJcare.png'
  },
  {
    id: 'gold-care',
    title: 'Gold Care',
    desc: 'Protect the golden glow from scratches.',
    icon: Sun,
    img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'gemstone-care',
    title: 'Gemstone Care',
    desc: 'Specific care for sensitive stones.',
    icon: Droplet,
    img: '/EJcare.png'
  }
];

const CareCategoryNav = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="care-nav" className="care-section-padding" style={{ backgroundColor: 'var(--care-light)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center' }}
      >
        <h2 className="care-heading-serif" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>How to Care for Your Jewellery</h2>
        <p style={{ color: 'var(--care-text-muted)', fontSize: '15px' }}>Select a category below to view specific care instructions.</p>
        
        <div className="care-nav-grid">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className="care-nav-card"
                onClick={() => scrollToSection(item.id)}
                style={{ backgroundImage: `url(${item.img})` }}
              >
                <div className="care-nav-card-overlay"></div>
                <div className="care-nav-card-content">
                  <h3 className="care-nav-title">{item.title}</h3>
                  <p className="care-nav-desc">{item.desc}</p>
                  <ArrowRight size={20} className="care-nav-arrow" />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default CareCategoryNav;
