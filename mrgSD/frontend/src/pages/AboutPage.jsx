import React from 'react';
import { Target, Eye, Gem, ShieldCheck } from 'lucide-react';
import ImageTrail from '../components/ImageTrail';
import './Pages.css';

const AboutPage = () => {
  const trailImages = [
    'https://images.unsplash.com/photo-1599643478524-fb66f7f6f1c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1573408301145-b98c46544405?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <ImageTrail items={trailImages}>
        <section className="about-hero">
          <div className="about-hero-image">
            <img 
              src="https://i.pinimg.com/736x/66/31/93/663193bce0667fc08c591bcee1510a94.jpg" 
              alt="Elegant Jewelry" 
            />
          </div>
          <div className="about-hero-overlay">
            <h1 className="about-title">Our Story</h1>
            <p className="about-subtitle">Crafting timeless elegance and capturing life's precious moments.</p>
          </div>
        </section>
      </ImageTrail>

      {/* Story Section */}
      <section className="about-section story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-content">
              <h2>A Legacy of Purity and Perfection</h2>
              <p>
                At MRG Silver and Diamonds, our journey began with a simple passion: to create 
                breathtaking pieces that capture the essence of life's most precious moments. 
                For over two decades, we have been at the forefront of crafting exquisite silver 
                and diamond jewelry that blends traditional artistry with contemporary design.
              </p>
              <p>
                Every piece in our collection is a testament to our unwavering commitment to quality, 
                sustainability, and impeccable craftsmanship. We source only the finest materials, 
                ensuring that each creation is as enduring as the memories it represents.
              </p>
            </div>
            <div className="story-image">
              <img 
                src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Jewelry Craftsmanship" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="about-section mission-vision-section bg-light">
        <div className="container">
          <div className="mv-grid">
            <div className="mv-card">
              <div className="mv-icon-wrapper">
                <Target size={32} />
              </div>
              <h3>Our Mission</h3>
              <p>
                To provide our customers with meticulously crafted, ethically sourced jewelry 
                that celebrates individuality and style. We strive to create an unparalleled 
                shopping experience built on trust, transparency, and exceptional service.
              </p>
            </div>
            <div className="mv-card">
              <div className="mv-icon-wrapper">
                <Eye size={32} />
              </div>
              <h3>Our Vision</h3>
              <p>
                To be the world's most trusted and beloved destination for luxury silver and 
                diamond jewelry, inspiring confidence and radiating elegance in every generation, 
                while pioneering sustainable practices in the industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-section values-section">
        <div className="container">
          <div className="section-header text-center">
            <h2>Our Core Values</h2>
            <div className="divider"></div>
          </div>
          <div className="values-grid">
            <div className="value-item">
              <Gem size={40} className="value-icon" />
              <h4>Uncompromising Quality</h4>
              <p>We accept nothing less than perfection in every cut, polish, and setting.</p>
            </div>
            <div className="value-item">
              <ShieldCheck size={40} className="value-icon" />
              <h4>Trust & Integrity</h4>
              <p>Transparency and honesty are the foundation of every relationship we build.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
