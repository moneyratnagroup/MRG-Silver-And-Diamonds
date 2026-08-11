import React from 'react';
import HeroSlider from '../components/HeroSlider';
import ShopByCategory from '../components/ShopByCategory';
import ProductsGallery from '../components/ProductsGallery';
import OurPromises from '../components/OurPromises';
import SmallBanner from '../components/SmallBanner';
import FeaturedCollection from '../components/FeaturedCollection';
import SplitGateway from '../components/SplitGateway';
import MetalRatesBar from '../components/MetalRatesBar';
import { useShop } from '../context/ShopContext';
import './Home.css';

const Home = () => {
  const { products } = useShop();
  const featuredProducts = products.slice(0, 4);

  return (
    <>
      <MetalRatesBar />
      <HeroSlider />
      <ShopByCategory />
      <ProductsGallery 
        title="The Signature Debut" 
        tagline="Discover our inaugural curation of masterpieces—thoughtfully crafted with absolute purity and designed to mark the beginning of a beautiful legacy."
        products={featuredProducts} 
      />
      <section className="home-editorial-section">
        <h2 className="home-editorial-heading">Jewellery for Every Chapter of Your Life</h2>
        <div className="home-bento-grid">
          <div className="bento-right-col">
            <div className="home-editorial-image-wrapper">
              <img src="/editorialimg.png" alt="Jewellery for Every Chapter of Life" className="home-editorial-image" loading="lazy" />
              <div className="home-editorial-overlay">
                <p>From first love to forever, from one generation to the next we craft memories that lasts a lifetime</p>
              </div>
            </div>
          </div>
          <div className="bento-left-col">
            <div className="bento-card">
              <img src="/forher.png" alt="For Her" loading="lazy" className="bento-card-image" />
              <div className="bento-card-overlay">
                <h3>For Her</h3>
                <button className="bento-explore-btn">Explore</button>
              </div>
            </div>
            <div className="bento-card">
              <img src="/for him.png" alt="For Him" loading="lazy" className="bento-card-image" />
              <div className="bento-card-overlay">
                <h3>For Him</h3>
                <button className="bento-explore-btn">Explore</button>
              </div>
            </div>
            <div className="bento-card">
              <img src="/kids.png" alt="Kids Collection" loading="lazy" className="bento-card-image" />
              <div className="bento-card-overlay">
                <h3>Kids Collection</h3>
                <button className="bento-explore-btn">Explore</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <OurPromises />
      <SmallBanner />
      <FeaturedCollection />
      <SplitGateway />
    </>
  );
};

export default Home;
