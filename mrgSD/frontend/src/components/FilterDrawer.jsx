import React, { useState } from 'react';
import { Offcanvas } from 'react-bootstrap';
import { X, ChevronRight } from 'lucide-react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import './Drawers.css';

const AccordionItem = ({ title, children, defaultOpen = false, activeCount = 0 }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="filter-accordion-item">
      <button className="filter-accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <span className="filter-accordion-title">
          {title} {activeCount > 0 && <span className="active-badge-small">{activeCount}</span>}
        </span>
        <span className={`filter-accordion-icon ${isOpen ? 'open' : ''}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </span>
      </button>
      {isOpen && (
        <div className="filter-accordion-body">
          {children}
        </div>
      )}
    </div>
  );
};

const FilterDrawer = ({ isOpen, setIsOpen }) => {
  const handleClose = () => setIsOpen(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { collectionId } = useParams();
  const { categories, products: allProductsContext } = useShop();
  
  const typeFilter = searchParams.get('type');
  const occasionFilter = searchParams.get('occasion');
  
  // Calculate result count based on current filters
  let filteredProducts = collectionId === 'all' ? allProductsContext : allProductsContext.filter(p => p.collection === collectionId);
  if (typeFilter) {
    filteredProducts = filteredProducts.filter(p => p.category && p.category.toUpperCase() === typeFilter.toUpperCase());
  }
  if (occasionFilter) {
    filteredProducts = filteredProducts.filter(p => p.occasion && p.occasion.toLowerCase() === occasionFilter.toLowerCase());
  }

  const collectionCategories = [
    { title: "Women", id: "women" },
    { title: "Men", id: "men" },
    { title: "Kids", id: "kids" },
    { title: "Investment", id: "investment" },
    { title: "Gift", id: "special" },
    { title: "Couple", id: "couple" },
    { title: "Religious", id: "religious" }
  ];

  const occasionsList = ["Daily", "Office", "Modern", "Traditional"];

  const handleClearAll = () => {
    navigate('/collections/all');
  };

  const handleFilterSelect = (type, value) => {
    if (type === 'collection') {
      navigate(`/collections/${value}?${searchParams.toString()}`);
    } else {
      const newParams = new URLSearchParams(searchParams);
      if (newParams.get(type) === value) {
        newParams.delete(type);
      } else {
        newParams.set(type, value);
      }
      navigate(`?${newParams.toString()}`);
    }
  };

  return (
    <Offcanvas show={isOpen} onHide={handleClose} placement="start" className="new-filter-drawer">
      <div className="drawer-header-custom">
        <h2 className="drawer-title-custom">Filter By</h2>
        <button className="drawer-close-btn-custom" onClick={handleClose}>
          <X size={20} />
        </button>
      </div>
      
      <div className="drawer-scroll-body">
        <AccordionItem title="Categories" defaultOpen={true} activeCount={collectionId !== 'all' ? 1 : 0}>
          <div className="filter-checkbox-list">
            <label className="custom-checkbox-label">
              <input 
                type="radio" 
                name="category"
                checked={collectionId === 'all'} 
                onChange={() => handleFilterSelect('collection', 'all')} 
              />
              <span className="checkbox-text">All Categories</span>
            </label>
            {collectionCategories.map(cat => (
              <label key={cat.id} className="custom-checkbox-label">
                <input 
                  type="radio" 
                  name="category"
                  checked={collectionId === cat.id} 
                  onChange={() => handleFilterSelect('collection', cat.id)} 
                />
                <span className="checkbox-text">{cat.title}</span>
              </label>
            ))}
          </div>
        </AccordionItem>

        <AccordionItem title="Product Type" defaultOpen={true} activeCount={typeFilter ? 1 : 0}>
          <div className="filter-checkbox-list">
            {categories.map(cat => (
              <label key={cat.id} className="custom-checkbox-label">
                <input 
                  type="radio" 
                  name="productType"
                  checked={typeFilter && typeFilter.toLowerCase() === cat.name.toLowerCase()} 
                  onChange={() => handleFilterSelect('type', cat.name.toLowerCase())} 
                />
                <span className="checkbox-text">{cat.name}</span>
              </label>
            ))}
          </div>
        </AccordionItem>

        <AccordionItem title="Occasion" defaultOpen={true} activeCount={occasionFilter ? 1 : 0}>
          <div className="filter-checkbox-list">
            {occasionsList.map(occ => (
              <label key={occ} className="custom-checkbox-label">
                <input 
                  type="radio" 
                  name="occasion"
                  checked={occasionFilter && occasionFilter.toLowerCase() === occ.toLowerCase()} 
                  onChange={() => handleFilterSelect('occasion', occ.toLowerCase())} 
                />
                <span className="checkbox-text">{occ}</span>
              </label>
            ))}
          </div>
        </AccordionItem>
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
