import React from 'react';
import { Sparkles, Watch, Baby, Sun, Coins, Crown, LayoutGrid, CircleDot } from 'lucide-react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import './Drawers.css'; // Reusing the filter styles

const SidebarFilter = ({ onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const categories = [
    { title: "All Collections", path: "/collections/all", icon: <LayoutGrid size={20}/> },
    { title: "Women's Collection", path: "/collections/women", icon: <Sparkles size={20}/> },
    { title: "Men's Collection", path: "/collections/men", icon: <Watch size={20}/> },
    { title: "Kids Collection", path: "/collections/kids", icon: <Baby size={20}/> },
    { title: "Religious & Idols", path: "/collections/religious", icon: <Sun size={20}/> },
    { title: "Investment & Coins", path: "/collections/investment", icon: <Coins size={20}/> },
    { title: "Special & Bridal", path: "/collections/special", icon: <Crown size={20}/> },
  ];

  const productTypes = [
    { title: "Rings", type: "RINGS" },
    { title: "Earrings", type: "EARRINGS" },
    { title: "Bracelets", type: "BRACELETS" },
    { title: "Chains", type: "CHAINS" },
    { title: "Pendants", type: "PENDANTS" },
    { title: "Anklets", type: "ANKLETS" },
    { title: "Mangalsutra", type: "MANGALSUTRA" },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className="sidebar-filter-container">
      <div className="filter-categories-list mb-4">
        {categories.map((cat, idx) => {
          const isActive = location.pathname === cat.path && !searchParams.get('type');
          return (
            <button 
              key={idx} 
              className={`filter-category-btn ${isActive ? 'active-filter' : ''}`} 
              onClick={() => handleNavigate(cat.path)}
            >
              <span className="filter-category-icon">{cat.icon}</span>
              <span className="filter-category-title">{cat.title}</span>
            </button>
          );
        })}
      </div>

      <h4 className="sidebar-subtitle" style={{fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: '1rem', color: '#1a1a1a', borderBottom: '1px solid #e0e0e0', paddingBottom: '0.5rem'}}>Product Types</h4>
      <div className="filter-categories-list">
        {productTypes.map((pt, idx) => {
          const isActive = searchParams.get('type') === pt.type;
          return (
            <button 
              key={idx} 
              className={`filter-category-btn ${isActive ? 'active-filter' : ''}`} 
              onClick={() => handleNavigate(`/collections/all?type=${pt.type}`)}
              style={{ padding: '0.75rem 0', gap: '1rem' }}
            >
              <span className="filter-category-icon" style={{ opacity: 0.5 }}><CircleDot size={14}/></span>
              <span className="filter-category-title">{pt.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarFilter;
