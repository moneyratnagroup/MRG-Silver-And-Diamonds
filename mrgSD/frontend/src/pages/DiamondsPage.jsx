import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown } from 'lucide-react';
import ProductsGallery from '../components/ProductsGallery';
import FilterDrawer from '../components/FilterDrawer';
import { useShop } from '../context/ShopContext';
import './Pages.css';

const DiamondsPage = () => {
  const [searchParams] = useSearchParams();
  const { products: allProductsContext } = useShop();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('default');
  
  const typeFilter = searchParams.get('type');
  const occasionFilter = searchParams.get('occasion');
  
  // Filter specifically for diamonds
  let products = allProductsContext.filter(p => 
    (p.collection && p.collection.toLowerCase() === 'diamonds') || 
    (p.category && p.category.toLowerCase() === 'diamonds') || 
    (p.material && p.material.toLowerCase() === 'diamond')
  );
  
  if (typeFilter) {
    products = products.filter(p => p.category && p.category.toUpperCase() === typeFilter.toUpperCase());
  }

  if (occasionFilter) {
    products = products.filter(p => p.occasion && p.occasion.toLowerCase() === occasionFilter.toLowerCase());
  }
  
  // Sort products
  let displayProducts = [...products];
  if (sortOption === 'a-z') {
    displayProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === 'z-a') {
    displayProducts.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortOption === 'price-low-high') {
    displayProducts.sort((a, b) => {
      const priceA = parseFloat((a.price || "0").replace(/[^\d.]/g, '')) || 0;
      const priceB = parseFloat((b.price || "0").replace(/[^\d.]/g, '')) || 0;
      return priceA - priceB;
    });
  } else if (sortOption === 'price-high-low') {
    displayProducts.sort((a, b) => {
      const priceA = parseFloat((a.price || "0").replace(/[^\d.]/g, '')) || 0;
      const priceB = parseFloat((b.price || "0").replace(/[^\d.]/g, '')) || 0;
      return priceB - priceA;
    });
  }

  const activeFiltersCount = (typeFilter ? 1 : 0) + (occasionFilter ? 1 : 0);

  return (
    <div className="collection-page-container">
      <div className="collection-layout">
        <div className="collection-main">
          <ProductsGallery 
            title="Diamonds Collection"
            tagline="Discover our exclusive range of certified diamond jewelry, crafted to perfection."
            products={displayProducts}
            filterComponent={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '1.5rem' }}>
                <button className="pill-filter-btn" onClick={() => setIsFilterOpen(true)} style={{ margin: 0 }}>
                  <Filter size={16} />
                  <span>Filter By</span>
                  {activeFiltersCount > 0 && <span className="filter-count-badge">{activeFiltersCount}</span>}
                  <ChevronDown size={16} />
                </button>
                
                <div className="sort-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1rem', color: '#555', fontWeight: '500' }} className="d-none d-sm-inline">Sort by:</span>
                  <select 
                    className="custom-sort-select" 
                    value={sortOption} 
                    onChange={(e) => setSortOption(e.target.value)}
                    style={{
                      padding: '0.5rem 2.2rem 0.5rem 1rem',
                      borderRadius: '50px',
                      border: '1px solid #e0e0e0',
                      backgroundColor: '#fff',
                      fontSize: '1rem',
                      fontFamily: '"Inter", sans-serif',
                      color: '#333',
                      outline: 'none',
                      cursor: 'pointer',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23333%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '14px',
                      minWidth: '160px'
                    }}
                  >
                    <option value="default">Featured</option>
                    <option value="a-z">Alphabetically, A-Z</option>
                    <option value="z-a">Alphabetically, Z-A</option>
                    <option value="price-low-high">Price, low to high</option>
                    <option value="price-high-low">Price, high to low</option>
                  </select>
                </div>
              </div>
            }
          />
        </div>
      </div>

      <FilterDrawer isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} />
    </div>
  );
};

export default DiamondsPage;
