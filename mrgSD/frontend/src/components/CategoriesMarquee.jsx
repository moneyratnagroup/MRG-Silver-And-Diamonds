import React from 'react';
import { Link } from 'react-router-dom';
import './CategoriesMarquee.css';

const categories = [
  { name: 'RINGS', img: 'https://images.unsplash.com/photo-1605100804763-247f529cb665?q=80&w=600&auto=format&fit=crop' },
  { name: 'PENDANTS', img: 'https://images.unsplash.com/photo-1599643478524-fb66f7f6a6c0?q=80&w=600&auto=format&fit=crop' },
  { name: 'EARRINGS', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop' },
  { name: 'BRACELETS', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop' },
  { name: 'MANGALSUTRA', img: 'https://images.unsplash.com/photo-1599643477874-c5aaffe71207?q=80&w=600&auto=format&fit=crop' },
  { name: 'DIAMOND ACCENTS', img: 'https://images.unsplash.com/photo-1515562141207-7a8ea3a19b88?q=80&w=600&auto=format&fit=crop' }
];

const CategoriesMarquee = () => {
  return (
    <section className="categories-section">
      <div className="categories-header">
        <div className="main-title-wrapper">
          <span className="main-title-line"></span>
          <h2 className="main-title">OUR CATEGORIES</h2>
          <span className="main-title-line"></span>
        </div>
      </div>

      <div className="marquee-container">
        <div className="marquee-track">
          {categories.map((cat, index) => (
            <Link to={`/collections/all?type=${cat.name}`} className="marquee-category-item" key={index} style={{textDecoration: 'none'}}>
              <div className="category-image-wrapper">
                <img src={cat.img} alt={cat.name} className="category-image" />
              </div>
              <span className="category-name">{cat.name}</span>
            </Link>
          ))}
          {/* Duplicate set for seamless scrolling */}
          {categories.map((cat, index) => (
            <Link to={`/collections/all?type=${cat.name}`} className="marquee-category-item" key={`dup-${index}`} style={{textDecoration: 'none'}}>
              <div className="category-image-wrapper">
                <img src={cat.img} alt={cat.name} className="category-image" />
              </div>
              <span className="category-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesMarquee;
