import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { Trash2, ChevronDown, Plus, X, Pencil } from 'lucide-react';
import { toast } from 'react-toastify';
import './AdminCategories.css';

const AdminCategories = () => {
  const {
    categories, addCategory, deleteCategory,
    collections, addCollection, updateCollection, deleteCollection
  } = useShop();

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionSlug, setNewCollectionSlug] = useState('');

  // Modal state
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [editingCollectionId, setEditingCollectionId] = useState(null);

  // Custom multi-select dropdown state
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const handleAddCollection = (e) => {
    e.preventDefault();
    if (newCollectionName.trim() && newCollectionSlug.trim()) {
      if (editingCollectionId) {
        updateCollection(editingCollectionId, newCollectionSlug.trim(), newCollectionName.trim(), selectedCategories);
        toast.success('Collection updated successfully!');
      } else {
        addCollection(newCollectionSlug.trim(), newCollectionName.trim(), selectedCategories);
        toast.success('Collection added successfully!');
      }
      resetModalState();
    }
  };

  const openAddModal = () => {
    setEditingCollectionId(null);
    setNewCollectionName('');
    setNewCollectionSlug('');
    setSelectedCategories([]);
    setIsCollectionModalOpen(true);
  };

  const openEditModal = (col) => {
    setEditingCollectionId(col.id);
    setNewCollectionName(col.displayName);
    setNewCollectionSlug(col.name);
    setSelectedCategories(col.categoryIds || []);
    setIsCollectionModalOpen(true);
  };

  const resetModalState = () => {
    setEditingCollectionId(null);
    setNewCollectionName('');
    setNewCollectionSlug('');
    setSelectedCategories([]);
    setIsDropdownOpen(false);
    setIsCollectionModalOpen(false);
  };

  const toggleCategorySelection = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="admin-categories-container">
      <div className="admin-page-header">
        <h1>Categories & Collections</h1>
        <p>Manage the product organization tags available in your store.</p>
      </div>

      <div className="categories-grid">
        {/* Categories Column */}
        <div className="admin-section-card">
          <h2>Product Categories</h2>
          <p className="section-desc">Primary types of jewelry (e.g., Rings, Necklaces).</p>

          <div className="category-list">
            {categories.length > 0 ? categories.map(cat => (
              <div key={cat.id} className="category-item">
                <div className="category-item-info">
                  <span className="category-name">{cat.name}</span>
                </div>
                <button
                  className="btn-icon delete"
                  onClick={() => {
                    if (window.confirm('Delete this category?')) deleteCategory(cat.id);
                  }}
                  title="Delete Category"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )) : (
              <div className="empty-list">No categories added yet.</div>
            )}
          </div>

          <form className="add-category-form" onSubmit={handleAddCategory}>
            <input
              type="text"
              placeholder="New Category Name..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              required
            />
            <button type="submit" className="btn-add-inline">Add</button>
          </form>
        </div>

        {/* Collections Column */}
        <div className="admin-section-card">
          <div className="section-header-flex">
            <div>
              <h2>Product Collections</h2>
              <p className="section-desc">Thematic groupings (e.g., Bridal, Women's).</p>
            </div>
            <button
              className="btn-add-collection"
              onClick={openAddModal}
            >
              <Plus size={16} /> Add
            </button>
          </div>

          <div className="category-list">
            {collections.length > 0 ? collections.map(col => (
              <div key={col.id} className="category-item">
                <div className="category-item-info">
                  <span className="category-name">{col.displayName}</span>
                  <span className="category-slug">Slug: {col.name}</span>
                  {col.categoryIds && col.categoryIds.length > 0 && (
                    <span
                      className="category-slug linked-cats-link"
                      onClick={() => openEditModal(col)}
                    >
                      {col.categoryIds.length} Linked Categories
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn-icon edit"
                    onClick={() => openEditModal(col)}
                    title="Edit Collection"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="btn-icon delete"
                    onClick={() => {
                      if (window.confirm('Delete this collection?')) deleteCollection(col.id);
                    }}
                    title="Delete Collection"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )) : (
              <div className="empty-list">No collections added yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Collection Modal */}
      {isCollectionModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingCollectionId ? 'Edit Collection' : 'Add New Collection'}</h2>
              <button className="btn-close-modal" onClick={resetModalState}>
                <X size={24} />
              </button>
            </div>

            <form className="add-collection-modal-form" onSubmit={handleAddCollection}>
              <div className="form-group">
                <label>Collection Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kids Collection"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>System Slug</label>
                <input
                  type="text"
                  placeholder="e.g. kids"
                  value={newCollectionSlug}
                  onChange={(e) => setNewCollectionSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Linked Categories</label>
                <div className="custom-dropdown-container" ref={dropdownRef}>
                  <div
                    className={`custom-dropdown-header ${isDropdownOpen ? 'open' : ''}`}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span>{selectedCategories.length > 0 ? `${selectedCategories.length} Selected` : 'Select Categories'}</span>
                    <ChevronDown size={16} />
                  </div>

                  {isDropdownOpen && (
                    <div className="custom-dropdown-list">
                      {categories.length === 0 ? (
                        <div className="dropdown-empty">No categories available</div>
                      ) : (
                        categories.map(cat => (
                          <label key={cat.id} className="dropdown-list-item">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(cat.id)}
                              onChange={() => toggleCategorySelection(cat.id)}
                            />
                            <span>{cat.name}</span>
                          </label>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={resetModalState}>Cancel</button>
                <button type="submit" className="btn-save">{editingCollectionId ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
