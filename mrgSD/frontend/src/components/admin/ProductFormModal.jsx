import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { X } from 'lucide-react';
import './ProductFormModal.css';

const ProductFormModal = ({ isOpen, onClose, productToEdit }) => {
  const { addProduct, updateProduct } = useShop();
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Rings',
    collection: 'women',
    desc: '',
    img: ''
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        price: productToEdit.price.replace('₹', '').replace(',', ''),
        category: productToEdit.category,
        collection: productToEdit.collection,
        desc: productToEdit.desc,
        img: productToEdit.img
      });
    } else {
      setFormData({
        name: '',
        price: '',
        category: 'Rings',
        collection: 'women',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format price
    const formattedPrice = `₹${Number(formData.price).toLocaleString('en-IN')}`;
    
    const productPayload = {
      name: formData.name,
      price: formattedPrice,
      category: formData.category,
      collection: formData.collection,
      desc: formData.desc,
      img: formData.img || 'https://images.unsplash.com/photo-1599643478514-4a1101858ff6?auto=format&fit=crop&q=80&w=600', // fallback image
      images: [formData.img || 'https://images.unsplash.com/photo-1599643478514-4a1101858ff6?auto=format&fit=crop&q=80&w=600']
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
            <label>Product Name</label>
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
              <label>Price (₹)</label>
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
              <label>Image URL</label>
              <input 
                type="text" 
                name="img" 
                value={formData.img} 
                onChange={handleChange} 
                placeholder="https://..."
              />
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
              <label>Collection</label>
              <select name="collection" value={formData.collection} onChange={handleChange}>
                <option value="women">Women's Collection</option>
                <option value="men">Men's Collection</option>
                <option value="kids">Kids Collection</option>
                <option value="religious">Religious</option>
                <option value="investment">Investment</option>
                <option value="special">Special/Bridal</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Description</label>
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
