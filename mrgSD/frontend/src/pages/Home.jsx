import React from 'react';
import HeroSlider from '../components/HeroSlider';
import ShopByCategory from '../components/ShopByCategory';
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
      <ShopByCategory />
      <ProductsGallery 
        title="The Signature Debut" 
        tagline="Discover our inaugural curation of masterpieces—thoughtfully crafted with absolute purity and designed to mark the beginning of a beautiful legacy."
        products={featuredProducts} 
      />
      <OurPromises />
      <SmallBanner />
      <FeaturedCollection />
    </>
  );
};

export default Home;
