import React from 'react';
import { Carousel } from 'react-bootstrap';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './HeroSlider.css';

const CustomDiamond = ({ size = 20, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C12 2 12 10 22 12C22 12 12 14 12 22C12 22 12 14 2 12C2 12 12 10 12 2Z" />
  </svg>
);

const HeroSlider = () => {
  const { heroBanners } = useShop();

  return (
    <div className="modern-hero-container">
      <Carousel fade interval={6000} pause="hover" indicators={true} controls={false}>
        
        {heroBanners.filter(b => b.status === 'publish').map((banner) => (
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
                  {banner.preTitle && <span className="modern-slide-pretitle">{banner.preTitle}</span>}
                  <h2 className="modern-slide-title" dangerouslySetInnerHTML={{ __html: banner.title }}></h2>
                  <div className="modern-divider">
                    <CustomDiamond size={20} className="modern-divider-icon" />
                  </div>
                  {banner.subtitle && (
                    <p className="modern-slide-text">
                      {banner.subtitle}
                    </p>
                  )}
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
