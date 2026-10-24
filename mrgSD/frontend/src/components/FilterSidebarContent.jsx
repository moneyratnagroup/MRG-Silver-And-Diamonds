import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate, useParams, useLocation } from 'react-router-dom';
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

const FilterSidebarContent = ({ metal: propMetal }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { collectionId: pathCollectionId } = useParams();
  const collectionId = pathCollectionId || searchParams.get('collection');
  const { categories, collections, occasions, products: allProductsContext } = useShop();
  
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

  // Products belonging to the active metal
  const metalProducts = useMemo(() => {
    if (!allProductsContext || allProductsContext.length === 0) return [];
    if (currentMetal === 'gold') return allProductsContext.filter(isGoldProduct);
    if (currentMetal === 'diamonds') return allProductsContext.filter(isDiamondProduct);
    if (currentMetal === 'silver') return allProductsContext.filter(isSilverProduct);
    return allProductsContext;
  }, [allProductsContext, currentMetal]);

  // Collections available for this specific metal
  const availableCollections = useMemo(() => {
    if (!collections || collections.length === 0) return [];
    if (currentMetal === 'all' || !allProductsContext || allProductsContext.length === 0) return collections;

    const filtered = collections.filter(col => {
      return metalProducts.some(p => 
        p.collections && p.collections.some(c => 
          (c.id && c.id.toString() === col.id.toString()) || 
          (c.name && c.name.toLowerCase() === col.name.toLowerCase()) ||
          matchCollection(c, col.id.toString()) ||
          matchCollection(c, col.name)
        )
      );
    });

    return filtered.length > 0 ? filtered : collections;
  }, [collections, metalProducts, currentMetal, allProductsContext]);

  // Product Types (categories) available for this metal and chosen collection
  const activeCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];

    let relevantProducts = metalProducts;
    if (collectionId && collectionId !== 'all') {
      relevantProducts = metalProducts.filter(p => 
        p.collections && p.collections.some(c => matchCollection(c, collectionId))
      );
    }

    if (currentMetal === 'all' && (!collectionId || collectionId === 'all') && (!allProductsContext || allProductsContext.length === 0)) {
      return categories;
    }

    if (relevantProducts.length === 0) {
      if (collectionId && collectionId !== 'all') {
        const collectionIds = collectionId.split(','); 
        const activeCols = collections?.filter(c => collectionIds.some(id => matchCollection(c, id))) || [];
        if (activeCols.length > 0) {
          const allowedIds = new Set(activeCols.flatMap(c => c.category_ids || c.categoryIds || []));
          if (allowedIds.size > 0) {
            return categories.filter(cat => allowedIds.has(cat.id));
          }
        }
      }
      if (!allProductsContext || allProductsContext.length === 0) return categories;
      return [];
    }

    const filtered = categories.filter(cat => {
      const catName = cat.name.toLowerCase().trim();
      return relevantProducts.some(p => {
        if (!p.category) return false;
        const pCat = p.category.toLowerCase().trim();
        return pCat === catName || pCat.includes(catName) || catName.includes(pCat);
      });
    });

    return filtered.length > 0 ? filtered : categories;
  }, [categories, collections, metalProducts, collectionId, currentMetal, allProductsContext]);

  // Occasions available for this specific metal
  const availableOccasions = useMemo(() => {
    if (!occasions || occasions.length === 0) return [];
    if (currentMetal === 'all' || !allProductsContext || allProductsContext.length === 0) return occasions;

    const filtered = occasions.filter(occ => {
      const occIdStr = occ.id.toString();
      const occName = occ.name.toLowerCase().trim();
      return metalProducts.some(p => 
        p.occasions && p.occasions.some(o => 
          (o.id && o.id.toString() === occIdStr) || 
          (o.name && o.name.toLowerCase().trim() === occName)
        )
      );
    });

    return filtered.length > 0 ? filtered : occasions;
  }, [occasions, metalProducts, currentMetal, allProductsContext]);

  // Metal-specific price brackets
  const priceRanges = useMemo(() => {
    if (currentMetal === 'gold') {
      return [
        { id: "under-20000", label: "Under ₹20,000" },
        { id: "20000-40000", label: "₹20,000 - ₹40,000" },
        { id: "40000-75000", label: "₹40,000 - ₹75,000" },
        { id: "over-75000", label: "Above ₹75,000" }
      ];
    }
    if (currentMetal === 'diamonds') {
      return [
        { id: "under-25000", label: "Under ₹25,000" },
        { id: "25000-50000", label: "₹25,000 - ₹50,000" },
        { id: "50000-100000", label: "₹50,000 - ₹1,00,000" },
        { id: "over-100000", label: "Above ₹1,00,000" }
      ];
    }
    return [
      { id: "under-2000", label: "Under ₹2,000" },
      { id: "2000-5000", label: "₹2,000 - ₹5,000" },
      { id: "5000-10000", label: "₹5,000 - ₹10,000" },
      { id: "over-10000", label: "Above ₹10,000" }
    ];
  }, [currentMetal]);

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

  const handleMultiSelect = (type, value) => {
    const currentPath = window.location.pathname;
    const newParams = new URLSearchParams(searchParams);
    const currentValues = newParams.get(type) ? newParams.get(type).split(',') : [];
    
    if (currentValues.includes(value)) {
      const updatedValues = currentValues.filter(v => v !== value);
      if (updatedValues.length > 0) {
        newParams.set(type, updatedValues.join(','));
      } else {
        newParams.delete(type);
      }
    } else {
      currentValues.push(value);
      newParams.set(type, currentValues.join(','));
    }
    
    navigate(`${currentPath}?${newParams.toString()}`);
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
          className="filter-clear-all-btn"
          style={{ 
            background: 'none', 
            border: 'none', 
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
          {availableCollections?.map(col => (
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

      {activeCategories.length > 0 && (
        <AccordionItem title="Product Type" defaultOpen={true} activeCount={typeFiltersArray.length}>
          <div className="filter-checkbox-list">
            {activeCategories.map(cat => (
              <label key={cat.id} className="custom-checkbox-label">
                <input 
                  type="checkbox" 
                  name="productType"
                  checked={typeFiltersArray.some(t => t.toLowerCase() === cat.name.toLowerCase())} 
                  onChange={() => handleMultiSelect('type', cat.name.toLowerCase())} 
                />
                <span className="checkbox-text">{cat.name}</span>
              </label>
            ))}
          </div>
        </AccordionItem>
      )}

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

      {availableOccasions.length > 0 && (
        <AccordionItem title="Occasion" defaultOpen={true} activeCount={occasionFilter ? 1 : 0}>
          <div className="filter-checkbox-list">
            {availableOccasions.map(occ => (
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
      )}
    </div>
  );
};

export default FilterSidebarContent;
