import React from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { X } from 'lucide-react';
import './ActiveFilters.css';

const ActiveFilters = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { collectionId: pathCollectionId } = useParams();
  const collectionId = pathCollectionId || searchParams.get('collection');
  const { collections, occasions } = useShop();

  const typeFilter = searchParams.get('type');
  const occasionFilter = searchParams.get('occasion');
  const priceFilter = searchParams.get('price');

  const hasActiveFilters = typeFilter || occasionFilter || priceFilter || (collectionId && collectionId !== 'all');

  if (!hasActiveFilters) {
    return null;
  }

  const handleRemoveFilter = (filterKey) => {
    const currentPath = window.location.pathname;

    if (filterKey === 'collection') {
      const basePath = currentPath.split('/')[1] || 'products';
      navigate(`/${basePath}/all${window.location.search}`);
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete(filterKey);
      navigate(`${currentPath}?${newParams.toString()}`);
    }
  };

  const handleClearAll = () => {
    const currentPath = window.location.pathname;
    const basePath = currentPath.split('/')[1] || 'products';
    if (pathCollectionId) {
       navigate(`/${basePath}/all`);
    } else {
       navigate(currentPath);
    }
  };

  const getCollectionName = (id) => {
    if (id.toLowerCase() === 'women') return "Women's";
    if (id.toLowerCase() === 'men') return "Men's";
    if (id.toLowerCase() === 'kids') return "Kids";
    if (id.toLowerCase() === 'religious') return "Religious";
    if (id.toLowerCase() === 'special') return "Special";
    if (collections && collections.length > 0) {
      const found = collections.find(c => c.id.toString() === id.toString() || c.name.toLowerCase() === id.toLowerCase());
      if (found) return found.name.replace(/ collection$/i, '').trim();
    }
    return id.charAt(0).toUpperCase() + id.slice(1);
  };

  const getOccasionName = (id) => {
    if (occasions && occasions.length > 0) {
      const found = occasions.find(o => o.id.toString() === id.toString() || o.name.toLowerCase() === id.toLowerCase());
      if (found) return found.name;
    }
    return id.charAt(0).toUpperCase() + id.slice(1);
  };

  const formatPrice = (priceKey) => {
    switch (priceKey) {
      case 'under-2000': return 'Under ₹2000';
      case '2000-5000': return '₹2000 - ₹5000';
      case '5000-10000': return '₹5000 - ₹10000';
      case 'over-10000': return 'Over ₹10000';
      default: return priceKey;
    }
  };

  return (
    <div className="active-filters-container">
      {collectionId && collectionId !== 'all' && (
        <button className="active-filter-pill" onClick={() => handleRemoveFilter('collection')}>
          {getCollectionName(collectionId)}
          <X size={14} className="filter-pill-close" />
        </button>
      )}
      
      {typeFilter && (
        <button className="active-filter-pill" onClick={() => handleRemoveFilter('type')}>
          {typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1).toLowerCase()}
          <X size={14} className="filter-pill-close" />
        </button>
      )}

      {occasionFilter && (
        <button className="active-filter-pill" onClick={() => handleRemoveFilter('occasion')}>
          {getOccasionName(occasionFilter)}
          <X size={14} className="filter-pill-close" />
        </button>
      )}

      {priceFilter && (
        <button className="active-filter-pill" onClick={() => handleRemoveFilter('price')}>
          {formatPrice(priceFilter)}
          <X size={14} className="filter-pill-close" />
        </button>
      )}

      {hasActiveFilters && (
        <button className="active-filter-clear-all" onClick={handleClearAll}>
          Clear All
        </button>
      )}
    </div>
  );
};

export default ActiveFilters;
