import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Autoplay, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
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

const displayCategories = [...categories, ...categories, ...categories, ...categories];

const ShopByCategory = () => {
  return (
    <section className="shop-category-section">
      <motion.div
        className="shop-category-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="category-title-with-lines">
          <div className="cat-line"></div>
          <Sparkles size={12} color="#C7A66A" className="cat-sparkle" />
          <span className="cat-subtitle">SHOP BY CATEGORY</span>
          <Sparkles size={12} color="#C7A66A" className="cat-sparkle" />
          <div className="cat-line"></div>
        </div>
        {/* <h2 className="cat-main-title">Find Your Perfect Style</h2>
        <p className="cat-description">Explore jewellery crafted for every occasion.</p> */}
        {/* <div className="cat-bottom-line-wrapper">
          <div className="cat-bottom-line"></div>
          <Sparkles size={10} color="#C7A66A" className="cat-sparkle-small" />
          <div className="cat-bottom-line"></div>
        </div> */}
      </motion.div>

      <motion.div 
        className="category-grid-container"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-50px" }}
      >
        <Swiper
          modules={[FreeMode, Autoplay, Mousewheel]}
          freeMode={true}
          grabCursor={true}
          mousewheel={{ forceToAxis: true }}
          loop={true}
          speed={4000}
          observer={true}
          observeParents={true}
          autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }}
          breakpoints={{
            0: {
              slidesPerView: 'auto',
              spaceBetween: 20,
              freeMode: true
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
          {displayCategories.map((cat, index) => (
            <SwiperSlide key={index} className="swiper-slide-auto">
              <motion.div
                className="cat-item-wrapper"
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  transition: { type: "spring", stiffness: 300, damping: 15 }
                }}
              >
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
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      <motion.div
        className="cat-explore-all"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Link to="/products" className="cat-explore-btn">
          EXPLORE ALL CATEGORIES <ArrowRight size={16} />
        </Link>
      </motion.div>
    </section>
  );
};

export default ShopByCategory;
