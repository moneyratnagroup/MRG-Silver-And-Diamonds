import React from 'react';
import { Link } from 'react-router-dom';
import './ShopByCollection.css';

const collections = [
  {
    title: "Women's Collection",
    linkId: "women",
    desc: "Elegant designs in silver and diamonds, crafted to celebrate every woman.",
    img: "https://images.unsplash.com/photo-1599643478514-4a1101858ff6?auto=format&fit=crop&q=80&w=600",
    bgColor: "#f4f0e6"
  },
  {
    title: "Men's Collection",
    linkId: "men",
    desc: "Bold, timeless and stylish silver pieces made for the modern man.",
    img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600",
    bgColor: "#e8e9e6"
  },
  {
    title: "Kids Collection",
    linkId: "kids",
    desc: "Adorable and safe silver jewelry perfect for your little ones.",
    img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600",
    bgColor: "#f2e4e4"
  },
  {
    title: "Couple Collection",
    linkId: "couple",
    desc: "Celebrate your bond with matching silver designs that last forever.",
    img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600",
    bgColor: "#efe5df"
  },
  {
    title: "pooja & idols Collection",
    linkId: "religious",
    desc: "Pure silver idols and pooja articles to bring home blessings and purity.",
    img: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80&w=600",
    bgColor: "#f3ead3"
  },
  {
    title: "Silver Coins & Gifts",
    linkId: "investment",
    desc: "A symbol of wealth and prosperity. Perfect for gifting and investment.",
    img: "https://images.unsplash.com/photo-1610970891636-681fb0db4fb0?auto=format&fit=crop&q=80&w=600",
    bgColor: "#e2e4e6"
  },
  {
    title: "Customized Jewellery",
    linkId: "special",
    desc: "Your vision, our craftsmanship. Create pieces as unique as you.",
    img: "https://images.unsplash.com/photo-1588444650733-d0767b0dc74d?auto=format&fit=crop&q=80&w=600",
    bgColor: "#e5e4e0"
  }
];

const ShopByCollection = () => {
  return (
    <section className="collection-section">
      <div className="collection-header">
        <div className="collection-header-overline">EXPLORE</div>
      </div>
      <div className="collection-grid">
        {collections.map((item, index) => (
          <Link to={`/collections/${item.linkId}`} className="collection-card" key={index}>
            <div className="collection-image-container">
              <img src={item.img} alt={item.title} />
              <div className="collection-overlay"></div>
            </div>
            <div className="collection-content">
              <h3 className="collection-card-title">{item.title}</h3>
              <div className="collection-card-divider">
                <span></span>
              </div>
              <p className="collection-card-desc">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ShopByCollection;
