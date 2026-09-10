import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { X, Upload } from 'lucide-react';
import MultiSelectDropdown from './MultiSelectDropdown';
import './ProductFormModal.css';

const ProductFormModal = ({ isOpen, onClose, productToEdit }) => {
  const { addProduct, updateProduct, collections, occasions } = useShop();
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Rings',
    collectionIds: [],
    occasionIds: [],
    desc: '',
    img: ''
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        price: productToEdit.price.replace('₹', '').replace(',', ''),
        category: productToEdit.category,
        collectionIds: productToEdit.collections?.map(c => c.id) || [],
        occasionIds: productToEdit.occasions?.map(o => o.id) || [],
        desc: productToEdit.desc,
        img: productToEdit.img
      });
    } else {
      setFormData({
        name: '',
        price: '',
        category: 'Rings',
        collectionIds: [],
        occasionIds: [],
        desc: '',
        img: ''
      });
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    const id = parseInt(value);
    setFormData(prev => {
      const list = prev[field];
      if (checked) {
        return { ...prev, [field]: [...list, id] };
      } else {
        return { ...prev, [field]: list.filter(item => item !== id) };
      }
    });
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formDataObj = new FormData();
    formDataObj.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/v1/upload/', {
        method: 'POST',
        body: formDataObj,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      const imageUrl = `http://localhost:8000${data.url}`;

      setFormData(prev => ({ ...prev, [field]: imageUrl }));
    } catch (error) {
      alert("Error uploading image: " + error.message);
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format price
    const formattedPrice = `₹${Number(formData.price).toLocaleString('en-IN')}`;
    
    const productPayload = {
      name: formData.name,
      price: formattedPrice,
      category: formData.category,
      collection_ids: formData.collectionIds,
      occasion_ids: formData.occasionIds,
      desc: formData.desc,
      img: formData.img || 'https://images.unsplash.com/photo-1599643478514-4a1101858ff6?auto=format&fit=crop&q=80&w=600', // fallback image
      images: [{ image_url: formData.img || 'https://images.unsplash.com/photo-1599643478514-4a1101858ff6?auto=format&fit=crop&q=80&w=600', is_primary: true }]
    };

    if (productToEdit) {
      updateProduct({ ...productPayload, id: productToEdit.id });
    } else {
      addProduct(productPayload);
    }
    
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{productToEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label>Product Name <span style={{color: '#dc3545'}}>*</span></label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Diamond Stud Earrings"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group half">
              <label>Price (₹) <span style={{color: '#dc3545'}}>*</span></label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                required 
                placeholder="2999"
              />
            </div>
            
            <div className="form-group half">
              <label>Image URL or Upload</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  name="img" 
                  value={formData.img} 
                  onChange={handleChange} 
                  placeholder="https://..."
                  style={{ flex: 1 }}
                />
                <label className="btn-upload" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0 15px', background: '#e0e0e0', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <Upload size={16} />
                  <span>{isUploading ? '...' : 'Upload'}</span>
                  <input type="file" accept="image/*,image/webp" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'img')} disabled={isUploading} />
                </label>
              </div>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group half">
              <label>Product Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="Rings">Rings</option>
                <option value="Earrings">Earrings</option>
                <option value="Chains">Chains</option>
                <option value="Bracelets">Bracelets</option>
                <option value="Pendants">Pendants</option>
                <option value="Anklets">Anklets</option>
                <option value="Idols">Idols</option>
                <option value="Bullions">Bullions</option>
                <option value="Bridal">Bridal</option>
              </select>
            </div>
            
            <div className="form-group half">
              <label>Collections</label>
              <MultiSelectDropdown 
                options={collections} 
                selectedIds={formData.collectionIds} 
                onChange={handleCheckboxChange} 
                placeholder="Select Collections..." 
                field="collectionIds" 
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group full">
              <label>Occasions</label>
              <MultiSelectDropdown 
                options={occasions || []} 
                selectedIds={formData.occasionIds} 
                onChange={handleCheckboxChange} 
                placeholder="Select Occasions..." 
                field="occasionIds" 
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Description <span style={{color: '#dc3545'}}>*</span></label>
            <textarea 
              name="desc" 
              value={formData.desc} 
              onChange={handleChange} 
              rows="3"
              required
              placeholder="Describe the jewelry piece..."
            ></textarea>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit">
              {productToEdit ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
