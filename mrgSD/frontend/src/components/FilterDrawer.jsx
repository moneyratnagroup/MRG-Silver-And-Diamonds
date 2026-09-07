import React, { useState, useEffect } from 'react';
import { Offcanvas } from 'react-bootstrap';
import { X, ChevronRight } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import FilterSidebarContent from './FilterSidebarContent';
import './Drawers.css';

const FilterDrawer = ({ isOpen, setIsOpen }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClose = () => setIsOpen(false);
  const navigate = useNavigate();
  const { collectionId } = useParams();
  const [searchParams] = useSearchParams();
  const { products: allProductsContext } = useShop();

  const typeFilter = searchParams.get('type');
  const occasionFilter = searchParams.get('occasion');
  
  // Calculate result count based on current filters
  let filteredProducts = collectionId === 'all' || !collectionId ? allProductsContext : allProductsContext.filter(p => p.collection === collectionId);
  if (typeFilter) {
    filteredProducts = filteredProducts.filter(p => p.category && p.category.toUpperCase() === typeFilter.toUpperCase());
  }
  if (occasionFilter) {
    filteredProducts = filteredProducts.filter(p => p.occasion && p.occasion.toLowerCase() === occasionFilter.toLowerCase());
  }

  const handleClearAll = () => {
    navigate(window.location.pathname);
  };

  if (!isMobile) {
    return null;
  }

  return (
    <Offcanvas show={isOpen} onHide={handleClose} placement="start" className="new-filter-drawer">
      <div className="drawer-header-custom">
        <h2 className="drawer-title-custom">Filter By</h2>
        <button className="drawer-close-btn-custom" onClick={handleClose}>
          <X size={20} />
        </button>
      </div>
      
      <div className="drawer-scroll-body">
        <FilterSidebarContent />
      </div>

      <div className="drawer-footer-actions">
        <button className="btn-clear-filters" onClick={handleClearAll}>
          <span>Clear Filters</span> <ChevronRight size={16}/>
        </button>
        <button className="btn-show-results" onClick={handleClose}>
          <span>Show Result ({filteredProducts.length})</span> <ChevronRight size={16}/>
        </button>
      </div>
    </Offcanvas>
  );
};

export default FilterDrawer;

