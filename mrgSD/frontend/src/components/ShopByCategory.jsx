import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './ShopByCategory.css';

const categories = [
  { name: 'RINGS', desc: 'Timeless Elegance', img: 'https://images.unsplash.com/photo-1605100804763-247f529cb665?q=80&w=600&auto=format&fit=crop' },
  { name: 'EARRINGS', desc: 'Glamour in Every Detail', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop' },
  { name: 'PENDANTS', desc: 'Graceful & Meaningful', img: 'https://images.unsplash.com/photo-1599643478524-fb66f7f6a6c0?q=80&w=600&auto=format&fit=crop' },
  { name: 'CHAINS', desc: 'Strength & Sophistication', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop' },
  { name: 'BANGLES', desc: 'Tradition That Shines', img: 'https://images.unsplash.com/photo-1599643477874-c5aaffe71207?q=80&w=600&auto=format&fit=crop' },
  { name: 'BRACELETS', desc: 'Subtle. Stylish. You.', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop' },
  { name: 'NECKLACES', desc: 'Make Every Moment Special', img: 'https://images.unsplash.com/photo-1599643477874-c5aaffe71207?q=80&w=600&auto=format&fit=crop' },
  { name: 'ANKLETS', desc: 'Grace In Every Step', img: 'https://images.unsplash.com/photo-1515562141207-7a8ea3a19b88?q=80&w=600&auto=format&fit=crop' },
  { name: 'SILVER COINS', desc: 'Wealth. Blessings. Legacy.', img: 'https://images.unsplash.com/photo-1623141629853-22dc9a803738?q=80&w=600&auto=format&fit=crop' },
  { name: 'CUSTOMIZED', desc: 'Made Just For You', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop' }
];

const ShopByCategory = () => {
  return (
    <section className="shop-category-section">
      <div className="shop-category-header">
        <div className="category-title-with-lines">
          <div className="cat-line"></div>
          <Sparkles size={12} color="#C7A66A" className="cat-sparkle" />
          <span className="cat-subtitle">SHOP BY CATEGORY</span>
          <Sparkles size={12} color="#C7A66A" className="cat-sparkle" />
          <div className="cat-line"></div>
        </div>
      </div>

      <div className="category-grid-container">
        <Swiper
          modules={[Mousewheel, Pagination]}
          pagination={{ clickable: true }}
          grabCursor={true}
          mousewheel={{ forceToAxis: true }}
          speed={800}
          observer={true}
          observeParents={true}
          breakpoints={{
            0: {
              slidesPerView: 'auto',
              spaceBetween: 20
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 30
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 40
            }
          }}
          className="category-swiper"
        >
          {categories.map((cat, index) => (
            <SwiperSlide key={index} className="swiper-slide-auto">
              <div className="cat-item-wrapper">
                <Link to={`/products?type=${cat.name}`} className="cat-item" style={{ textDecoration: 'none' }}>
                  <div className="cat-image-outer">
                    <div className="cat-image-wrapper">
                      <img
                        src={cat.img}
                        alt={cat.name}
                        className="cat-image"
                        loading={index < 15 ? "eager" : "lazy"}
                      />
                    </div>
                  </div>
                  <h3 className="cat-name">{cat.name}</h3>
                  <p className="cat-desc">{cat.desc}</p>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="cat-explore-all">
        <Link to="/products" className="cat-explore-btn">
          EXPLORE ALL CATEGORIES <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
};

export default ShopByCategory;
