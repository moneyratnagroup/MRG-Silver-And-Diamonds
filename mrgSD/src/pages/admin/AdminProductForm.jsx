import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { ArrowLeft } from 'lucide-react';
import './AdminProductForm.css';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, categories, collections } = useShop();
  
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    originalPrice: '',
    price: '',
    category: 'Rings',
    collection: 'women',
    desc: '',
    img: ''
  });

  useEffect(() => {
    if (isEditing) {
      const productToEdit = products.find(p => p.id === parseInt(id));
      if (productToEdit) {
        setFormData({
          name: productToEdit.name,
          originalPrice: productToEdit.originalPrice ? productToEdit.originalPrice.replace('₹', '').replace(',', '') : '',
          price: productToEdit.price.replace('₹', '').replace(',', ''),
          category: productToEdit.category,
          collection: productToEdit.collection,
          desc: productToEdit.desc,
          img: productToEdit.img
        });
      }
    }
  }, [id, products, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format price
    const formattedPrice = `₹${Number(formData.price).toLocaleString('en-IN')}`;
    const formattedOriginalPrice = formData.originalPrice ? `₹${Number(formData.originalPrice).toLocaleString('en-IN')}` : null;
    
    const productPayload = {
      name: formData.name,
      originalPrice: formattedOriginalPrice,
      price: formattedPrice,
      category: formData.category,
      collection: formData.collection,
      desc: formData.desc,
      img: formData.img || 'https://images.unsplash.com/photo-1599643478514-4a1101858ff6?auto=format&fit=crop&q=80&w=600', // fallback image
      images: [formData.img || 'https://images.unsplash.com/photo-1599643478514-4a1101858ff6?auto=format&fit=crop&q=80&w=600']
    };

    if (isEditing) {
      updateProduct({ ...productPayload, id: parseInt(id) });
    } else {
      addProduct(productPayload);
    }
    
    navigate('/admin/products');
  };

  return (
    <div className="admin-product-form-container">
      <div className="admin-page-header form-header">
        <button className="btn-back" onClick={() => navigate('/admin/products')}>
          <ArrowLeft size={20} />
          Back to Products
        </button>
        <h1>{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
      </div>

      <div className="admin-form-card">
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
              <label>Original Price (MRP)</label>
              <input 
                type="number" 
                name="originalPrice" 
                value={formData.originalPrice} 
                onChange={handleChange} 
                placeholder="Optional e.g. 3999"
              />
            </div>

            <div className="form-group half">
              <label>Selling Price (₹)</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                required 
                placeholder="2999"
              />
            </div>
          </div>
          
          <div className="form-row">
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
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group half">
              <label>Collection</label>
              <select name="collection" value={formData.collection} onChange={handleChange}>
                {collections.map(c => (
                  <option key={c.id} value={c.name}>{c.displayName}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="desc" 
              value={formData.desc} 
              onChange={handleChange} 
              rows="4"
              required
              placeholder="Describe the jewelry piece..."
            ></textarea>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/admin/products')}>Cancel</button>
            <button type="submit" className="btn-submit">
              {isEditing ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;
