import React from 'react';
import { Sparkles } from 'lucide-react';
import HeroSlider from '../components/HeroSlider';
import ShopByCategory from '../components/ShopByCategory';
import ProductsGallery from '../components/ProductsGallery';
import OurPromises from '../components/OurPromises';
import FeaturedCollection from '../components/FeaturedCollection';
import SplitGateway from '../components/SplitGateway';
import AnnouncementBar from '../components/AnnouncementBar';
import { useShop } from '../context/ShopContext';
import './Home.css';
import imgeditorialimg from '../assets/Golden Family Jewellery Celebration.webp';
// import imgforhim from '../assets/for him.webp';
// import imgforher from '../assets/forher.webp';
// import imgkids from '../assets/kids.webp';

const Home = () => {
  const { products } = useShop();
  const featuredProducts = products.slice(0, 4);

  return (
    <>
      <HeroSlider />
      <AnnouncementBar />
      <ShopByCategory />
      <section className="home-editorial-section-new">
        <div className="editorial-new-content">
          <div className="editorial-new-text">
            <div className="editorial-new-eyebrow">
              <span className="editorial-new-eyebrow-line"></span>
              MORE THAN JEWELLERY
            </div>
            <h2 className="editorial-new-heading">
              Jewellery for Every <br /> Chapter of <span>Your Life</span>
            </h2>
            <p className="editorial-new-description">
              From everyday moments to life’s biggest celebrations, our jewellery is created to become part of the memories you’ll treasure for years to come.
            </p>
            <div className="editorial-new-divider">
              <span className="editorial-new-divider-line"></span>
              <Sparkles size={14} color="#c9a76b" fill="#c9a76b" />
              <span className="editorial-new-divider-line"></span>
            </div>
            <button className="editorial-new-button">
              DISCOVER OUR STORY <span>&rarr;</span>
            </button>
          </div>
          <div className="editorial-new-image-container">
            <img src={imgeditorialimg} alt="Golden Family Jewellery Celebration" loading="lazy" />
          </div>
        </div>
      </section>
      {/* <div className="home-products-container">
        <ProductsGallery
          title="The Signature Debut"
          tagline="Discover our inaugural curation of masterpieces—thoughtfully crafted with absolute purity and designed to mark the beginning of a beautiful legacy."
          products={featuredProducts}
        />
      </div> */}
      <OurPromises />
      <div className="home-products-container">
        <FeaturedCollection />
      </div>
      <SplitGateway />
    </>
  );
};

export default Home;
