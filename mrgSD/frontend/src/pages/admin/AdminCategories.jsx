import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Trash2 } from 'lucide-react';
import './AdminCategories.css';

const AdminCategories = () => {
  const { 
    categories, addCategory, deleteCategory, 
    collections, addCollection, deleteCollection 
  } = useShop();

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionSlug, setNewCollectionSlug] = useState('');

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
      addCollection(newCollectionSlug.trim(), newCollectionName.trim());
      setNewCollectionName('');
      setNewCollectionSlug('');
    }
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
          <h2>Product Collections</h2>
          <p className="section-desc">Thematic groupings (e.g., Bridal, Women's).</p>
          
          <div className="category-list">
            {collections.length > 0 ? collections.map(col => (
              <div key={col.id} className="category-item">
                <div className="category-item-info">
                  <span className="category-name">{col.displayName}</span>
                  <span className="category-slug">Slug: {col.name}</span>
                </div>
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
            )) : (
              <div className="empty-list">No collections added yet.</div>
            )}
          </div>

          <form className="add-category-form" style={{ flexDirection: 'column' }} onSubmit={handleAddCollection}>
            <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
              <input 
                type="text" 
                placeholder="Display Name (e.g. Kids Collection)" 
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
              <input 
                type="text" 
                placeholder="System Slug (e.g. kids)" 
                value={newCollectionSlug}
                onChange={(e) => setNewCollectionSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                required
              />
              <button type="submit" className="btn-add-inline">Add</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
