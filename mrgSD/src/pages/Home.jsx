import React from 'react';
import HeroSlider from '../components/HeroSlider';
import CategoriesMarquee from '../components/CategoriesMarquee';
import ShopByCollection from '../components/ShopByCollection';
import ProductsGallery from '../components/ProductsGallery';
import OurPromises from '../components/OurPromises';
import SmallBanner from '../components/SmallBanner';
import FeaturedCollection from '../components/FeaturedCollection';
import MetalRatesBar from '../components/MetalRatesBar';
import { useShop } from '../context/ShopContext';

const Home = () => {
  const { products } = useShop();
  const featuredProducts = products.slice(0, 4);

  return (
    <>
      <MetalRatesBar />
      <HeroSlider />
      <CategoriesMarquee />
      <ShopByCollection />
      <ProductsGallery 
        title="Our First Collection" 
        tagline="Introducing the inaugural Moneyratna Silver Collection—thoughtfully crafted with purity, elegance, and timeless design."
        products={featuredProducts} 
      />
      <OurPromises />
      <SmallBanner />
      <FeaturedCollection />
    </>
  );
};

export default Home;
