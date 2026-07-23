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

    </div>
  );
};

export default SidebarFilter;
