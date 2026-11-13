import React from 'react';
import ProductsGallery from '../components/ProductsGallery';
import { useShop } from '../context/ShopContext';
import './Pages.css';
import './SilverPage.css';

const CollectionPage = () => {
  const { products: allProductsContext } = useShop();
  const displayProducts = allProductsContext;

  const getCollectionBrandName = (product) => {
    const isGold = (product.collections && product.collections.some(c => c.name?.toLowerCase() === 'gold')) ||
      (product.category && product.category.toLowerCase() === 'gold') ||
      (product.material && product.material.toLowerCase() === 'gold') ||
      (product.metal && product.metal.toLowerCase().includes('gold')) ||
      (product.name && product.name.toLowerCase().includes('gold'));
    if (isGold) return "ORO";

    const isDiamond = (product.collections && product.collections.some(c => c.name?.toLowerCase() === 'diamonds')) ||
      (product.category && product.category.toLowerCase() === 'diamonds') ||
      (product.material && product.material.toLowerCase() === 'diamond') ||
      (product.metal && product.metal.toLowerCase().includes('diamond')) ||
      (product.name && product.name.toLowerCase().includes('diamond'));
    if (isDiamond) return "NYERA";

    return "EIRA";
  };

  return (
    <div className="collection-page-container ivory-theme">
      <div className="collection-layout">
        <ProductsGallery
          title="All Products"
          tagline="From whispered subtleties to radiant statements — explore jewellery created to transcend time."
          products={displayProducts}
          useCartIcon={true}
          showMetalSubtitle={true}
          customSubtitle={getCollectionBrandName}
          activeFiltersComponent={
            <div className="collection-grid-top-header" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '28px', marginBottom: '0.75rem' }}>
                <span className="showing-pieces-text" style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.88rem', color: '#6d5b53', fontWeight: '500' }}>
                  Showing {displayProducts.length} {displayProducts.length === 1 ? 'piece' : 'pieces'}
                </span>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default CollectionPage;
