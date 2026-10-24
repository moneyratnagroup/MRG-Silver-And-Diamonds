import React, { useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, ChevronDown, ChevronRight, ChevronLeft, X } from 'lucide-react';
import ProductsGallery from '../components/ProductsGallery';
import FilterDrawer from '../components/FilterDrawer';
import FilterSidebarContent from '../components/FilterSidebarContent';
import SidebarFilter from '../components/SidebarFilter';
import ActiveFilters from '../components/ActiveFilters';
import { useShop } from '../context/ShopContext';
import './Pages.css';
import './SilverPage.css';

const CollectionPage = () => {
  const { collectionId: pathCollectionId } = useParams();
  const [searchParams] = useSearchParams();
  const collectionId = pathCollectionId || searchParams.get('collection');
  const { products: allProductsContext, categories, collections } = useShop();
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  const scroll = (scrollOffset) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += scrollOffset;
    }
  };
  const [isFilterOpen, setIsFilterOpen] = useState((collectionId === 'all' || !collectionId) && window.innerWidth > 992);
  const [sortOption, setSortOption] = useState('default');
  const typeFilter = searchParams.get('type');
  const typeFiltersArray = typeFilter ? typeFilter.split(',') : [];
  const occasionFilter = searchParams.get('occasion');
  const metalFilter = searchParams.get('metal'); // 'gold' | 'silver' | 'diamond'

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

  // Filter by collection
  let products = (collectionId === 'all' || !collectionId)
    ? allProductsContext
    : allProductsContext.filter(p => p.collections && p.collections.some(c => matchCollection(c, collectionId)));

  // Filter by metal if selected via pill switcher
  if (metalFilter === 'gold') {
    products = products.filter(isGoldProduct);
  } else if (metalFilter === 'silver') {
    products = products.filter(isSilverProduct);
  } else if (metalFilter === 'diamond') {
    products = products.filter(isDiamondProduct);
  }

  if (typeFiltersArray.length > 0) {
    products = products.filter(p => p.category && typeFiltersArray.map(t => t.toUpperCase()).includes(p.category.toUpperCase()));
  }

  if (occasionFilter) {
    products = products.filter(p => p.occasions && p.occasions.some(o => o.id.toString() === occasionFilter));
  }

  const priceFilter = searchParams.get('price');
  if (priceFilter) {
    products = products.filter(p => {
      const val = parseFloat((p.price || "0").replace(/[^\d.]/g, '')) || 0;
      if (priceFilter === 'under-2000') return val < 2000;
      if (priceFilter === '2000-5000') return val >= 2000 && val <= 5000;
      if (priceFilter === '5000-10000') return val > 5000 && val <= 10000;
      if (priceFilter === 'over-10000') return val > 10000;
      if (priceFilter === 'under-20000') return val < 20000;
      if (priceFilter === '20000-40000') return val >= 20000 && val <= 40000;
      if (priceFilter === '40000-75000') return val > 40000 && val <= 75000;
      if (priceFilter === 'over-75000') return val > 75000;
      if (priceFilter === 'under-25000') return val < 25000;
      if (priceFilter === '25000-50000') return val >= 25000 && val <= 50000;
      if (priceFilter === '50000-100000') return val > 50000 && val <= 100000;
      if (priceFilter === 'over-100000') return val > 100000;
      return true;
    });
  }

  // Format title
  const isAll = collectionId === 'all' || !collectionId;
  const currentCollectionObj = collections?.find(c => matchCollection(c, collectionId));
  const baseTitle = isAll ? "All" : currentCollectionObj ? currentCollectionObj.name : "Collection";

  let displayTitle = isAll ? "All Products" : (baseTitle.toLowerCase().endsWith('collection') ? baseTitle : `${baseTitle} Collection`);
  if (metalFilter && metalFilter !== 'all') {
    if (metalFilter === 'gold') {
      displayTitle = "The Oro Collections";
    } else if (metalFilter === 'silver') {
      displayTitle = "The Eira Collections";
    } else if (metalFilter === 'diamond') {
      displayTitle = "The Nyera Collections";
    } else {
      const metalTitle = metalFilter.charAt(0).toUpperCase() + metalFilter.slice(1);
      displayTitle = isAll ? `All ${metalTitle} Jewelry` : `${metalTitle} ${displayTitle}`;
    }
  }
  if (typeFiltersArray.length === 1) {
    displayTitle = typeFiltersArray[0].charAt(0).toUpperCase() + typeFiltersArray[0].slice(1).toLowerCase();
  } else if (typeFiltersArray.length > 1) {
    displayTitle = `${typeFiltersArray.length} Selected Types`;
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

  const handleMetalSelect = (metalValue) => {
    const newParams = new URLSearchParams(searchParams);
    if (!metalValue || metalValue === 'all' || newParams.get('metal') === metalValue) {
      newParams.delete('metal');
    } else {
      newParams.set('metal', metalValue);
    }
    navigate(`${window.location.pathname}?${newParams.toString()}`);
  };

  const activeFiltersCount = (collectionId && collectionId !== 'all' ? 1 : 0) + (typeFiltersArray.length > 0 ? 1 : 0) + (occasionFilter ? 1 : 0) + (metalFilter && metalFilter !== 'all' ? 1 : 0);

  const activeMetalProp = metalFilter === 'diamond' ? 'diamonds' : (metalFilter && metalFilter !== 'all' ? metalFilter : 'all');

  const getCollectionBrandName = (product) => {
    const isGold = (product.collections && product.collections.some(c => c.name?.toLowerCase() === 'gold')) ||
      (product.category && product.category.toLowerCase() === 'gold') ||
      (product.material && product.material.toLowerCase() === 'gold') ||
      (product.metal && product.metal.toLowerCase().includes('gold')) ||
      (product.name && product.name.toLowerCase().includes('gold'));
    if (isGold) return "ORO";

    const isDiamond = (product.collections && product.collections.some(c => c.name?.toLowerCase() === 'diamonds')) ||
      (product.category && product.category.toLowerCase() === 'diamonds') ||
      (product.material && product.material.toLowerCase() === 'diamond') ||
      (product.metal && product.metal.toLowerCase().includes('diamond')) ||
      (product.name && product.name.toLowerCase().includes('diamond'));
    if (isDiamond) return "NYERA";

    return "EIRA";
  };

  return (
    <div className={`collection-page-container ivory-theme ${metalFilter && metalFilter !== 'all' ? `metal-filter-${metalFilter}` : ''}`}>
      <div className="collection-layout">
        <ProductsGallery
          title={displayTitle}
          tagline={typeFiltersArray.length > 0 ? `Explore our stunning collection of ${displayTitle.toLowerCase()}.` : isAll ? "From whispered subtleties to radiant statements — explore jewellery created to transcend time." : `Explore our exclusive ${baseTitle} jewelry, curated for elegance and style.`}
          products={displayProducts}
          useCartIcon={true}
          showMetalSubtitle={true}
          customSubtitle={getCollectionBrandName}
          activeFiltersComponent={
            <div className="collection-grid-top-header" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '28px', marginBottom: '0.75rem' }}>
                <span className="showing-pieces-text" style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.88rem', color: '#6d5b53', fontWeight: '500' }}>
                  Showing {displayProducts.length} {displayProducts.length === 1 ? 'piece' : 'pieces'}
                </span>
              </div>
              <ActiveFilters />
            </div>
          }
          sidebarComponent={
            isFilterOpen ? (
              <div className="desktop-only collection-sidebar-content">
                <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 className="sidebar-title" style={{ margin: 0, borderBottom: 'none' }}>Filter By</h3>
                  <button onClick={() => setIsFilterOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                    <X size={20} />
                  </button>
                </div>
                <FilterSidebarContent metal={activeMetalProp} />
              </div>
            ) : null
          }
          filterComponent={
            <div className="collection-toolbar-row">
              <div className="toolbar-left-col">
                <button className="pill-filter-btn" onClick={() => setIsFilterOpen(true)} style={{ margin: 0, display: isFilterOpen ? 'none' : 'flex' }}>
                  <Filter size={16} />
                  <span>Filter By</span>
                  {activeFiltersCount > 0 && <span className="filter-count-badge">{activeFiltersCount}</span>}
                  <ChevronDown size={16} />
                </button>
              </div>

              {/* Segmented Metal Capsule Switcher - Center Aligned */}
              <div className="toolbar-center-col">
                <div className="metal-segmented-capsule" role="group" aria-label="Metal filter">
                  <button
                    type="button"
                    className={`metal-segment-btn ${!metalFilter || metalFilter === 'all' ? 'active' : ''}`}
                    onClick={() => handleMetalSelect('all')}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    className={`metal-segment-btn ${metalFilter === 'gold' ? 'active' : ''}`}
                    onClick={() => handleMetalSelect('gold')}
                  >
                    Gold
                  </button>
                  <button
                    type="button"
                    className={`metal-segment-btn ${metalFilter === 'silver' ? 'active' : ''}`}
                    onClick={() => handleMetalSelect('silver')}
                  >
                    Silver
                  </button>
                  <button
                    type="button"
                    className={`metal-segment-btn ${metalFilter === 'diamond' ? 'active' : ''}`}
                    onClick={() => handleMetalSelect('diamond')}
                  >
                    Diamond
                  </button>
                </div>
              </div>

              <div className="toolbar-right-col">
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
                      backgroundColor: '#f8f6f0',
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
            </div>
          }
        />
      </div>

      <div className="mobile-only">
        <FilterDrawer isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} metal={activeMetalProp} />
      </div>
    </div>
  );
};

export default CollectionPage;
