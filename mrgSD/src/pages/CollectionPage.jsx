import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter } from 'lucide-react';
import ProductsGallery from '../components/ProductsGallery';
import FilterDrawer from '../components/FilterDrawer';
import SidebarFilter from '../components/SidebarFilter';
import { useShop } from '../context/ShopContext';
import './Pages.css';

const CollectionPage = () => {
  const { collectionId } = useParams();
  const [searchParams] = useSearchParams();
  const { products: allProductsContext } = useShop();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const typeFilter = searchParams.get('type');
  
  // Filter by collection
  let products = collectionId === 'all' 
    ? allProductsContext 
    : allProductsContext.filter(p => p.collection === collectionId);
  
  if (typeFilter) {
    products = products.filter(p => p.category && p.category.toUpperCase() === typeFilter.toUpperCase());
  }
  
  // Format title
  const isAll = collectionId === 'all';
  const baseTitle = isAll ? "All" : collectionId ? collectionId.charAt(0).toUpperCase() + collectionId.slice(1) : "Collection";
  
  let displayTitle = isAll ? "All Products" : `${baseTitle} Collection`;
  if (typeFilter) {
    displayTitle = typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1).toLowerCase();
  }

  return (
    <div className="collection-page-container">
      {isAll && (
        <div className="collection-actions-bar mobile-only">
          <button className="btn-filter" onClick={() => setIsFilterOpen(true)}>
            <Filter size={18} className="me-2" />
            Filter Categories
          </button>
        </div>
      )}
      
      <div className={`collection-layout ${isAll ? 'with-sidebar' : ''}`}>
        {isAll && (
          <aside className="collection-sidebar desktop-only">
            <h3 className="sidebar-title">Categories</h3>
            <SidebarFilter />
          </aside>
        )}
        
        <div className="collection-main">
          <ProductsGallery 
            title={displayTitle}
            tagline={typeFilter ? `Explore our stunning collection of ${displayTitle.toLowerCase()}.` : isAll ? "Browse our entire catalog of premium silver and diamond jewelry." : `Explore our exclusive ${baseTitle} jewelry, curated for elegance and style.`}
            products={products}
          />
        </div>
      </div>

      <FilterDrawer isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} />
    </div>
  );
};

export default CollectionPage;
