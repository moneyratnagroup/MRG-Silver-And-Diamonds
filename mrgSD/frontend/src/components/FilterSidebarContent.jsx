import React, { useState } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import './Drawers.css';

export const AccordionItem = ({ title, children, defaultOpen = false, activeCount = 0 }) => {
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

const FilterSidebarContent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { collectionId } = useParams();
  const { categories } = useShop();
  
  const typeFilter = searchParams.get('type');
  const occasionFilter = searchParams.get('occasion');
  const priceFilter = searchParams.get('price');

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
  
  const priceRanges = [
    { id: "under-2000", label: "Under ₹2,000" },
    { id: "2000-5000", label: "₹2,000 - ₹5,000" },
    { id: "5000-10000", label: "₹5,000 - ₹10,000" },
    { id: "over-10000", label: "Above ₹10,000" }
  ];

  const handleFilterSelect = (type, value) => {
    if (type === 'collection') {
      navigate(`/silver/${value}?${searchParams.toString()}`);
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

  const handleClearAll = () => {
    navigate(window.location.pathname);
  };

  const hasActiveFilters = typeFilter || occasionFilter || priceFilter || (collectionId && collectionId !== 'all');

  return (
    <div className="filter-sidebar-content-wrapper">
      <div style={{ padding: '0 0 1rem 0', display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          onClick={handleClearAll} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#a84c19', 
            fontSize: '0.85rem', 
            fontWeight: '600', 
            cursor: 'pointer', 
            textDecoration: 'underline',
            opacity: hasActiveFilters ? 1 : 0.5
          }}
          disabled={!hasActiveFilters}
        >
          Clear All Filters
        </button>
      </div>
      <AccordionItem title="Categories" defaultOpen={true} activeCount={collectionId !== 'all' && collectionId ? 1 : 0}>
        <div className="filter-checkbox-list">
          <label className="custom-checkbox-label">
            <input 
              type="radio" 
              name="category"
              checked={collectionId === 'all' || !collectionId} 
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

      <AccordionItem title="Price Range" defaultOpen={true} activeCount={priceFilter ? 1 : 0}>
        <div className="filter-checkbox-list">
          {priceRanges.map(pr => (
            <label key={pr.id} className="custom-checkbox-label">
              <input 
                type="radio" 
                name="price"
                checked={priceFilter === pr.id} 
                onChange={() => handleFilterSelect('price', pr.id)} 
              />
              <span className="checkbox-text">{pr.label}</span>
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
  );
};

export default FilterSidebarContent;
