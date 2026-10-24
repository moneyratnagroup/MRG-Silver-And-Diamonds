import React, { useState, useEffect, useMemo } from 'react';
import { Offcanvas } from 'react-bootstrap';
import { X, ChevronRight } from 'lucide-react';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import FilterSidebarContent from './FilterSidebarContent';
import './Drawers.css';

const FilterDrawer = ({ isOpen, setIsOpen, theme, metal: propMetal }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClose = () => setIsOpen(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { collectionId } = useParams();
  const [searchParams] = useSearchParams();
  const { products: allProductsContext } = useShop();

  const currentPath = location.pathname;
  const currentMetal = propMetal || (
    currentPath.startsWith('/silver') ? 'silver' :
    currentPath.startsWith('/gold') ? 'gold' :
    currentPath.startsWith('/diamonds') ? 'diamonds' : 'all'
  );

  const typeFilter = searchParams.get('type');
  const typeFiltersArray = typeFilter ? typeFilter.split(',') : [];
  const occasionFilter = searchParams.get('occasion');
  const priceFilter = searchParams.get('price');

  const matchCollection = (c, searchParam) => {
    if (!searchParam) return false;
    const sp = searchParam.toLowerCase();
    if (c.id && c.id.toString() === sp) return true;
    if (sp === 'women' && c.name && c.name.toLowerCase().includes("women")) return true;
    if (sp === 'men' && c.name && c.name.toLowerCase() === "men's collection") return true;
    if (sp === 'kids' && c.name && c.name.toLowerCase().includes("kids")) return true;
    if (sp === 'religious' && c.name && c.name.toLowerCase().includes("religious")) return true;
    if (sp === 'special' && c.name && c.name.toLowerCase().includes("special")) return true;
    if (c.name && c.name.toLowerCase() === sp) return true;
    return false;
  };

  const isGoldProduct = (p) => (
    (p.collections && p.collections.some(c => c.name?.toLowerCase() === 'gold')) ||
    (p.category && p.category.toLowerCase() === 'gold') ||
    (p.material && p.material.toLowerCase() === 'gold') ||
    (p.metal && p.metal.toLowerCase().includes('gold')) ||
    (p.name && p.name.toLowerCase().includes('gold'))
  );

  const isDiamondProduct = (p) => (
    (p.collections && p.collections.some(c => c.name?.toLowerCase() === 'diamonds')) || 
    (p.category && p.category.toLowerCase() === 'diamonds') || 
    (p.material && p.material.toLowerCase() === 'diamond') ||
    (p.metal && p.metal.toLowerCase().includes('diamond')) ||
    (p.name && p.name.toLowerCase().includes('diamond'))
  );

  const isSilverProduct = (p) => !isGoldProduct(p) && !isDiamondProduct(p);
  
  // Calculate result count based on metal and current filters
  const filteredProducts = useMemo(() => {
    if (!allProductsContext || allProductsContext.length === 0) return [];
    
    let list = allProductsContext;
    if (currentMetal === 'gold') list = list.filter(isGoldProduct);
    else if (currentMetal === 'diamonds') list = list.filter(isDiamondProduct);
    else if (currentMetal === 'silver') list = list.filter(isSilverProduct);

    if (collectionId && collectionId !== 'all') {
      list = list.filter(p => p.collections && p.collections.some(c => matchCollection(c, collectionId)));
    }
    if (typeFiltersArray.length > 0) {
      list = list.filter(p => p.category && typeFiltersArray.map(t => t.toUpperCase()).includes(p.category.toUpperCase()));
    }
    if (occasionFilter) {
      list = list.filter(p => p.occasions && p.occasions.some(o => o.id && o.id.toString() === occasionFilter));
    }
    if (priceFilter) {
      list = list.filter(p => {
        const val = parseFloat((p.price || "0").replace(/[^\d.]/g, '')) || 0;
        // Silver brackets
        if (priceFilter === 'under-2000') return val < 2000;
        if (priceFilter === '2000-5000') return val >= 2000 && val <= 5000;
        if (priceFilter === '5000-10000') return val > 5000 && val <= 10000;
        if (priceFilter === 'over-10000') return val > 10000;
        // Gold brackets
        if (priceFilter === 'under-20000') return val < 20000;
        if (priceFilter === '20000-40000') return val >= 20000 && val <= 40000;
        if (priceFilter === '40000-75000') return val > 40000 && val <= 75000;
        if (priceFilter === 'over-75000') return val > 75000;
        // Diamond brackets
        if (priceFilter === 'under-25000') return val < 25000;
        if (priceFilter === '25000-50000') return val >= 25000 && val <= 50000;
        if (priceFilter === '50000-100000') return val > 50000 && val <= 100000;
        if (priceFilter === 'over-100000') return val > 100000;
        return true;
      });
    }
    return list;
  }, [allProductsContext, currentMetal, collectionId, typeFilter, occasionFilter, priceFilter]);

  const handleClearAll = () => {
    navigate(window.location.pathname);
  };

  if (!isMobile) {
    return null;
  }

  const themeClass = theme ? `${theme}-theme` : '';

  return (
    <Offcanvas show={isOpen} onHide={handleClose} placement="start" className={`new-filter-drawer ${themeClass}`}>
      <div className="drawer-header-custom">
        <h2 className="drawer-title-custom">Filter By</h2>
        <button className="drawer-close-btn-custom" onClick={handleClose}>
          <X size={20} />
        </button>
      </div>
      
      <div className="drawer-scroll-body">
        <FilterSidebarContent metal={currentMetal} />
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

