import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, Truck, Award, RefreshCw, Heart, ShoppingCart, ChevronDown, ChevronUp, LayoutGrid, List } from 'lucide-react';
import './InvestmentPage.css';

const InvestmentPage = () => {
  const { type } = useParams();
  const { products, addToCart, toggleWishlist, isInWishlist } = useShop();
  
  // States
  const [activeTab, setActiveTab] = useState(type || 'all');
  const [investmentProducts, setInvestmentProducts] = useState([]);
  
  // Filter States
  const [filters, setFilters] = useState({
    metal: { Gold: false, Silver: false, Copper: false },
    productType: { Coins: false, Bars: false },
    purity: { '999 (Purest)': false, '995 (Standard Gold)': false }
  });
  const [weightValue, setWeightValue] = useState(50); // mock slider

  // Accordion States
  const [accordionOpen, setAccordionOpen] = useState({
    metalType: true,
    productType: true,
    purity: true,
    weight: true
  });

  useEffect(() => {
    if (type) setActiveTab(type);
    else setActiveTab('all');
  }, [type]);

  useEffect(() => {
    let filtered = products.filter(p => p.collection === 'investment');

    // Filter by Top Tab
    if (activeTab === 'gold-coins') filtered = filtered.filter(p => p.metal === 'Gold' && p.category === 'Coins');
    else if (activeTab === 'gold-bars') filtered = filtered.filter(p => p.metal === 'Gold' && p.category === 'Bars');
    else if (activeTab === 'silver-coins') filtered = filtered.filter(p => p.metal === 'Silver' && p.category === 'Coins');
    else if (activeTab === 'silver-bars') filtered = filtered.filter(p => p.metal === 'Silver' && p.category === 'Bars');
    else if (activeTab === 'copper-bars') filtered = filtered.filter(p => p.metal === 'Copper' && p.category === 'Bars');

    // Filter by Sidebar (Metal)
    const activeMetals = Object.keys(filters.metal).filter(k => filters.metal[k]);
    if (activeMetals.length > 0) {
      filtered = filtered.filter(p => activeMetals.includes(p.metal));
    }

    // Filter by Sidebar (Product Type)
    const activeTypes = Object.keys(filters.productType).filter(k => filters.productType[k]);
    if (activeTypes.length > 0) {
      filtered = filtered.filter(p => activeTypes.includes(p.category));
    }

    // Filter by Sidebar (Purity)
    const activePurity = Object.keys(filters.purity).filter(k => filters.purity[k]);
    if (activePurity.length > 0) {
      filtered = filtered.filter(p => {
        if (activePurity.includes('999 (Purest)') && p.purity === '999') return true;
        if (activePurity.includes('995 (Standard Gold)') && p.purity === '995') return true;
        return false;
      });
    }

    setInvestmentProducts(filtered);
  }, [activeTab, products, filters]);

  const toggleAccordion = (section) => {
    setAccordionOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (category, name) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [name]: !prev[category][name]
      }
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      metal: { Gold: false, Silver: false, Copper: false },
      productType: { Coins: false, Bars: false },
      purity: { '999 (Purest)': false, '995 (Standard Gold)': false }
    });
    setWeightValue(50);
  };

  // Mock counts based on the design
  const counts = {
    Gold: 32, Silver: 24, Copper: 8, Coins: 38, Bars: 26, '999 (Purest)': 48, '995 (Standard Gold)': 16
  };

  return (
    <div className="inv-page">
      {/* Hero Section */}
      <div className="inv-hero">
        <div className="inv-hero-content">
          <p className="inv-hero-tagline">PURE. CERTIFIED. TIMELESS.</p>
          <h1 className="inv-hero-title">Premium<br/><span className="gold-text">Coins & Bars</span></h1>
          <p className="inv-hero-desc">Featuring 999 and 995 certified purity<br/>in gold, silver and copper.</p>
          <button className="btn-gold-primary">
            Explore Collection <span className="arrow">→</span>
          </button>
        </div>
        {/* Placeholder for the background image which is handled in CSS */}
      </div>

      {/* Top Tabs */}
      <div className="inv-tabs-container">
        <div className="inv-tabs">
          <button onClick={() => setActiveTab('all')} className={`inv-tab ${activeTab === 'all' ? 'active' : ''}`}>All Products</button>
          <button onClick={() => setActiveTab('gold-coins')} className={`inv-tab ${activeTab === 'gold-coins' ? 'active' : ''}`}>Gold Coins</button>
          <button onClick={() => setActiveTab('gold-bars')} className={`inv-tab ${activeTab === 'gold-bars' ? 'active' : ''}`}>Gold Bars</button>
          <button onClick={() => setActiveTab('silver-coins')} className={`inv-tab ${activeTab === 'silver-coins' ? 'active' : ''}`}>Silver Coins</button>
          <button onClick={() => setActiveTab('silver-bars')} className={`inv-tab ${activeTab === 'silver-bars' ? 'active' : ''}`}>Silver Bars</button>
          <button onClick={() => setActiveTab('copper-bars')} className={`inv-tab ${activeTab === 'copper-bars' ? 'active' : ''}`}>Copper Bars</button>
        </div>
      </div>

      <div className="inv-main-layout">
        {/* Sidebar Filters */}
        <aside className="inv-sidebar">
          <div className="filter-header">
            <h3>FILTERS</h3>
            <button onClick={clearAllFilters} className="clear-all">Clear All</button>
          </div>

          <div className="filter-section">
            <div className="filter-section-header" onClick={() => toggleAccordion('metalType')}>
              <h4>METAL TYPE</h4>
              {accordionOpen.metalType ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {accordionOpen.metalType && (
              <div className="filter-options">
                {Object.keys(filters.metal).map(m => (
                  <label key={m} className="custom-checkbox">
                    <input type="checkbox" checked={filters.metal[m]} onChange={() => handleCheckboxChange('metal', m)} />
                    <span className="checkmark"></span>
                    <span className="label-text">{m} <span>({counts[m] || 0})</span></span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="filter-section">
            <div className="filter-section-header" onClick={() => toggleAccordion('productType')}>
              <h4>PRODUCT TYPE</h4>
              {accordionOpen.productType ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {accordionOpen.productType && (
              <div className="filter-options">
                {Object.keys(filters.productType).map(p => (
                  <label key={p} className="custom-checkbox">
                    <input type="checkbox" checked={filters.productType[p]} onChange={() => handleCheckboxChange('productType', p)} />
                    <span className="checkmark"></span>
                    <span className="label-text">{p} <span>({counts[p] || 0})</span></span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="filter-section">
            <div className="filter-section-header" onClick={() => toggleAccordion('purity')}>
              <h4>PURITY</h4>
              {accordionOpen.purity ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {accordionOpen.purity && (
              <div className="filter-options">
                {Object.keys(filters.purity).map(p => (
                  <label key={p} className="custom-checkbox">
                    <input type="checkbox" checked={filters.purity[p]} onChange={() => handleCheckboxChange('purity', p)} />
                    <span className="checkmark"></span>
                    <span className="label-text">{p.split(' ')[0]} {p.includes('Purest') ? '(Purest)' : '(Standard Gold)'} <span>({counts[p] || 0})</span></span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="filter-section">
            <div className="filter-section-header" onClick={() => toggleAccordion('weight')}>
              <h4>WEIGHT</h4>
              {accordionOpen.weight ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {accordionOpen.weight && (
              <div className="filter-options">
                 <input type="range" min="1" max="100" value={weightValue} onChange={(e) => setWeightValue(e.target.value)} className="weight-slider" />
                 <div className="weight-labels">
                    <span>1g</span>
                    <span>1kg+</span>
                 </div>
              </div>
            )}
          </div>
          
          <button className="btn-gold-primary w-100 mt-3" onClick={() => {}}>Apply Filters</button>
        </aside>

        {/* Main Content Area */}
        <div className="inv-content">
          <div className="inv-controls">
            <div className="sort-dropdown">
              <span className="sort-label">Sort by:</span>
              <select className="sort-select">
                <option>Popular</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
            <div className="view-toggles">
              <button className="view-toggle active"><LayoutGrid size={18} /></button>
              <button className="view-toggle"><List size={18} /></button>
            </div>
          </div>

          <div className="inv-grid">
            {investmentProducts.map(product => (
              <div key={product.id} className="inv-card">
                <div className="inv-card-img-box">
                  <div className="inv-purity-badge">
                    <span className="p-num">{product.purity}</span>
                    <span className="p-text">PURITY</span>
                  </div>
                  <button className="inv-wishlist-btn" onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}>
                    <Heart size={18} fill={isInWishlist(product.id) ? "#d3a863" : "none"} color={isInWishlist(product.id) ? "#d3a863" : "#888"} />
                  </button>
                  <img src={product.img} alt={product.name} />
                </div>
                <div className="inv-card-details">
                  <h3 className="inv-card-title">{product.name}</h3>
                  <div className="inv-card-meta">
                    {product.karats && <span>{product.karats} | {product.purity} Purity</span>}
                    {!product.karats && <span>{product.purity} Purity</span>}
                  </div>
                  <div className="inv-card-weight">{product.weight}</div>
                  <div className="inv-card-price-row">
                    <span className="inv-price">{product.price}</span>
                    <span className={`inv-change ${product.priceChange?.startsWith('-') ? 'negative' : 'positive'}`}>
                      {product.priceChange}
                    </span>
                  </div>
                  <button className="btn-gold-primary full-width" onClick={(e) => { e.preventDefault(); addToCart(product); }}>
                    Add to Cart <ShoppingCart size={16} className="ms-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="inv-pagination">
             <button className="page-arrow">←</button>
             <button className="page-num active">1</button>
             <button className="page-num">2</button>
             <button className="page-num">3</button>
             <button className="page-num">4</button>
             <button className="page-num">5</button>
             <button className="page-arrow">→</button>
          </div>
        </div>
      </div>

      {/* Trust Signals */}
      <div className="inv-trust-section">
        <div className="trust-col">
          <div className="trust-icon-circle"><ShieldCheck size={32} /></div>
          <div>
            <h4>100% Certified<br/>Authenticity</h4>
            <p>All coins and bars are certified for purity and weight.</p>
          </div>
        </div>
        <div className="trust-col">
          <div className="trust-icon-circle"><Truck size={32} /></div>
          <div>
            <h4>Secure Insured<br/>Shipping</h4>
            <p>Fully insured and secure delivery across India.</p>
          </div>
        </div>
        <div className="trust-col">
          <div className="trust-icon-circle"><Award size={32} /></div>
          <div>
            <h4>Hallmarked<br/>Products</h4>
            <p>All products are hallmarked and government approved.</p>
          </div>
        </div>
        <div className="trust-col">
          <div className="trust-icon-circle"><RefreshCw size={32} /></div>
          <div>
            <h4>Trusted Buyback<br/>Policy</h4>
            <p>We buy back your metals at live market rates.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentPage;
