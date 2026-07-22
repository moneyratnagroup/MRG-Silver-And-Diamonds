import React from 'react';
import { Carousel } from 'react-bootstrap';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './HeroSlider.css';

const HeroSlider = () => {
  const { heroBanners } = useShop();

  return (
    <div className="modern-hero-container">
      <Carousel fade interval={6000} pause="hover" indicators={true} controls={false}>
        
        {heroBanners.map((banner) => (
          <Carousel.Item key={banner.id}>
            <div className="slide-content-wrapper">
              <div className="slide-image-layer">
                <img
                  className="modern-slide-image"
                  src={banner.image}
                  alt={banner.title.replace(/<[^>]*>?/gm, ' ')}
                />
                <div className="light-gradient-overlay"></div>
              </div>
              
              <div className="slide-text-layer">
                <div className="glass-card">
                  <h2 className="modern-slide-title" dangerouslySetInnerHTML={{ __html: banner.title }}></h2>
                  <div className="modern-divider">
                    <Sparkles size={14} className="modern-divider-icon" />
                  </div>
                  <p className="modern-slide-text">
                    {banner.subtitle}
                  </p>
                  <button className="modern-hero-btn">
                    {banner.buttonText} <ArrowRight size={18} className="btn-icon" />
                  </button>
                </div>
              </div>
            </div>
          </Carousel.Item>
        ))}

      </Carousel>
    </div>
  );
};

export default HeroSlider;
