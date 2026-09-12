import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import '../../pages/admin/AdminProductForm.css';

const MultiSelectDropdown = ({ options, selectedIds, onChange, placeholder, field }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedNames = options
    .filter(opt => selectedIds.includes(opt.id))
    .map(opt => opt.name);

  const displayValue = selectedNames.length > 0 
    ? (selectedNames.length > 2 ? `${selectedNames.slice(0, 2).join(', ')} + ${selectedNames.length - 2} more` : selectedNames.join(', '))
    : placeholder;

  return (
    <div className="multi-select-dropdown" ref={dropdownRef}>
      <div className="multi-select-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{displayValue}</span>
        <ChevronDown size={16} className={`arrow ${isOpen ? 'open' : ''}`} />
      </div>
      {isOpen && (
        <div className="multi-select-body checkbox-group">
          {options.map(opt => (
            <label key={opt.id} className="checkbox-label" onClick={(e) => e.stopPropagation()}>
              <input 
                type="checkbox" 
                value={opt.id} 
                checked={selectedIds.includes(opt.id)} 
                onChange={(e) => onChange(e, field)}
                style={{ marginRight: '8px' }}
              />
              {opt.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
