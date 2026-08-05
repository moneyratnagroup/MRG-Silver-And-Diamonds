import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const ShopByCategory = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

      <div className="category-grid-container">
        {isMobile ? (
          <Swiper
            modules={[FreeMode, Pagination]}
            freeMode={true}
            grabCursor={true}
            slidesPerView={'auto'}
            spaceBetween={20}
            pagination={{ clickable: true }}
            className="mobile-category-swiper"
          >
            {categories.map((cat, index) => (
              <SwiperSlide key={index} className="cat-item-wrapper swiper-slide-auto">
                <Link to={`/silver/all?type=${cat.name}`} className="cat-item" style={{ textDecoration: 'none' }}>
                  <div className="cat-image-outer">
                    <div className="cat-image-wrapper">
                      <img src={cat.img} alt={cat.name} className="cat-image" loading="lazy" />
                    </div>
                  </div>
                  <h3 className="cat-name">{cat.name}</h3>
                  <p className="cat-desc">{cat.desc}</p>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <motion.div
            className="category-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {categories.map((cat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="cat-item-wrapper"
                whileHover={{
                  scale: 1.15,
                  y: -10,
                  transition: { type: "spring", stiffness: 300, damping: 15 }
                }}
              >
                <Link to={`/silver/all?type=${cat.name}`} className="cat-item" style={{ textDecoration: 'none' }}>
                  <div className="cat-image-outer">
                    <div className="cat-image-wrapper">
                      <img src={cat.img} alt={cat.name} className="cat-image" loading="lazy" />
                    </div>
                  </div>
                  <h3 className="cat-name">{cat.name}</h3>
                  <p className="cat-desc">{cat.desc}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <motion.div
        className="cat-explore-all"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Link to="/silver/all" className="cat-explore-btn">
          EXPLORE ALL CATEGORIES <ArrowRight size={16} />
        </Link>
      </motion.div>
    </section>
  );
};

export default ShopByCategory;
