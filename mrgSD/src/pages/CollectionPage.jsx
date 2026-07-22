import React, { useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import ProductsGallery from '../components/ProductsGallery';
import FilterDrawer from '../components/FilterDrawer';
import SidebarFilter from '../components/SidebarFilter';
import { useShop } from '../context/ShopContext';
import './Pages.css';

const CollectionPage = () => {
  const { collectionId } = useParams();
  const [searchParams] = useSearchParams();
  const { products: allProductsContext, categories } = useShop();
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  
  const scroll = (scrollOffset) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += scrollOffset;
    }
  };
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const typeFilter = searchParams.get('type');
  const occasionFilter = searchParams.get('occasion');
  
  // Filter by collection
  let products = collectionId === 'all' 
    ? allProductsContext 
    : allProductsContext.filter(p => p.collection === collectionId);
  
  if (typeFilter) {
    products = products.filter(p => p.category && p.category.toUpperCase() === typeFilter.toUpperCase());
  }

  if (occasionFilter) {
    products = products.filter(p => p.occasion && p.occasion.toLowerCase() === occasionFilter.toLowerCase());
  }
  
  // Format title
  const isAll = collectionId === 'all';
  const baseTitle = isAll ? "All" : collectionId ? collectionId.charAt(0).toUpperCase() + collectionId.slice(1) : "Collection";
  
  let displayTitle = isAll ? "All Products" : `${baseTitle} Collection`;
  if (typeFilter) {
    displayTitle = typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1).toLowerCase();
  }

  const activeFiltersCount = (collectionId !== 'all' ? 1 : 0) + (typeFilter ? 1 : 0) + (occasionFilter ? 1 : 0);

  return (
    <div className="collection-page-container">
      <div className="collection-layout">
        <div className="collection-main">
          <ProductsGallery 
            title={displayTitle}
            tagline={typeFilter ? `Explore our stunning collection of ${displayTitle.toLowerCase()}.` : isAll ? "Browse our entire catalog of premium silver and diamond jewelry." : `Explore our exclusive ${baseTitle} jewelry, curated for elegance and style.`}
            products={products}
            filterComponent={
              <button className="pill-filter-btn" onClick={() => setIsFilterOpen(true)}>
                <Filter size={16} />
                <span>Filter By</span>
                {activeFiltersCount > 0 && <span className="filter-count-badge">{activeFiltersCount}</span>}
                <ChevronDown size={16} />
              </button>
            }
          />
        </div>
      </div>

      <FilterDrawer isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} />
    </div>
  );
};

export default CollectionPage;
