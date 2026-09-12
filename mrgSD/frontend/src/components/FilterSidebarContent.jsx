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
  const { collectionId: pathCollectionId } = useParams();
  const collectionId = pathCollectionId || searchParams.get('collection');
  const { categories, collections, occasions } = useShop();
  
  const typeFilter = searchParams.get('type');
  const occasionFilter = searchParams.get('occasion');
  const priceFilter = searchParams.get('price');

  const matchCollection = (c, searchParam) => {
      if (!searchParam) return false;
      const sp = searchParam.toLowerCase();
      if (c.id.toString() === sp) return true;
      if (sp === 'women' && c.name.toLowerCase().includes("women")) return true;
      if (sp === 'men' && c.name.toLowerCase() === "men's collection") return true;
      if (sp === 'kids' && c.name.toLowerCase().includes("kids")) return true;
      if (sp === 'religious' && c.name.toLowerCase().includes("religious")) return true;
      if (sp === 'special' && c.name.toLowerCase().includes("special")) return true;
      if (c.name.toLowerCase() === sp) return true;
      return false;
  };

  let activeCategories = categories;
  if (collectionId && collectionId !== 'all') {
    const collectionIds = collectionId.split(','); 
    const activeCollections = collections?.filter(c => collectionIds.some(id => matchCollection(c, id))) || [];
    
    if (activeCollections.length > 0) {
      const allowedCategoryIds = new Set(activeCollections.flatMap(c => c.category_ids || c.categoryIds || []));
      if (allowedCategoryIds.size > 0) {
        activeCategories = categories.filter(cat => allowedCategoryIds.has(cat.id));
      }
    }
  }


  
  const priceRanges = [
    { id: "under-2000", label: "Under ₹2,000" },
    { id: "2000-5000", label: "₹2,000 - ₹5,000" },
    { id: "5000-10000", label: "₹5,000 - ₹10,000" },
    { id: "over-10000", label: "Above ₹10,000" }
  ];

  const handleFilterSelect = (type, value) => {
    const currentPath = window.location.pathname;
    
    if (type === 'collection') {
      if (currentPath.startsWith('/products')) {
        const newParams = new URLSearchParams(searchParams);
        if (value === 'all') {
          newParams.delete('collection');
        } else {
          newParams.set('collection', value);
        }
        navigate(`${currentPath}?${newParams.toString()}`);
      } else {
        const basePath = currentPath.split('/')[1] || 'silver';
        if (value === 'all') {
          navigate(`/${basePath}?${searchParams.toString()}`);
        } else {
          navigate(`/${basePath}/${value}?${searchParams.toString()}`);
        }
      }
    } else {
      const newParams = new URLSearchParams(searchParams);
      if (newParams.get(type) === value) {
        newParams.delete(type);
      } else {
        newParams.set(type, value);
      }
      navigate(`${currentPath}?${newParams.toString()}`);
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
          {collections?.map(col => (
            <label key={col.id} className="custom-checkbox-label">
              <input 
                type="radio" 
                name="category"
                checked={collectionId === col.id.toString()} 
                onChange={() => handleFilterSelect('collection', col.id.toString())} 
              />
              <span className="checkbox-text">{col.name}</span>
            </label>
          ))}
        </div>
      </AccordionItem>

      <AccordionItem title="Product Type" defaultOpen={true} activeCount={typeFilter ? 1 : 0}>
        <div className="filter-checkbox-list">
          {activeCategories.map(cat => (
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
          {occasions?.map(occ => (
            <label key={occ.id} className="custom-checkbox-label">
              <input 
                type="radio" 
                name="occasion"
                checked={occasionFilter && occasionFilter.toString() === occ.id.toString()} 
                onChange={() => handleFilterSelect('occasion', occ.id.toString())} 
              />
              <span className="checkbox-text">{occ.name}</span>
            </label>
          ))}
        </div>
      </AccordionItem>
    </div>
  );
};

export default FilterSidebarContent;
