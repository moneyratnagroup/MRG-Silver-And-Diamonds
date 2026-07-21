import React from 'react';
import { Offcanvas } from 'react-bootstrap';
import { X, Filter } from 'lucide-react';
import SidebarFilter from './SidebarFilter';
import './Drawers.css';

const FilterDrawer = ({ isOpen, setIsOpen }) => {
  const handleClose = () => setIsOpen(false);

  return (
    <Offcanvas show={isOpen} onHide={handleClose} placement="end" className="custom-drawer">
      <Offcanvas.Header>
        <Offcanvas.Title className="drawer-title">
          <Filter size={20} className="me-2" />
          FILTER CATEGORIES
        </Offcanvas.Title>
        <button className="drawer-close-btn" onClick={handleClose}>
          <X size={24} />
        </button>
      </Offcanvas.Header>
      
      <Offcanvas.Body className="drawer-body p-0">
        <SidebarFilter onNavigate={handleClose} />
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default FilterDrawer;
