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
    shortDesc: '',
    careInstructions: '',
    img: '',
    galleryImages: '',
    hoverImage: '',
    videoUrl: '',
    sku: '',
    metal: 'Silver',
    purity: '925',
    weight: '',
    finish: '',
    stoneType: 'None',
    stoneWeight: '',
    hallmarked: 'Yes',
    certificate: 'No',
    stockQuantity: '',
    lowStockThreshold: '5'
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
          shortDesc: productToEdit.shortDesc || '',
          careInstructions: productToEdit.careInstructions || '',
          img: productToEdit.img,
          galleryImages: productToEdit.images ? productToEdit.images.slice(1).join('\n') : '',
          hoverImage: productToEdit.hoverImage || '',
          videoUrl: productToEdit.videoUrl || '',
          sku: productToEdit.sku || '',
          metal: productToEdit.metal || 'Silver',
          purity: productToEdit.purity || '925',
          weight: productToEdit.weight ? productToEdit.weight.replace('g', '') : '',
          finish: productToEdit.finish || '',
          stoneType: productToEdit.stoneType || 'None',
          stoneWeight: productToEdit.stoneWeight || '',
          hallmarked: productToEdit.hallmarked !== false ? 'Yes' : 'No',
          certificate: productToEdit.certificate === true ? 'Yes' : 'No',
          stockQuantity: productToEdit.stockQuantity || 0,
          lowStockThreshold: productToEdit.lowStockThreshold || 5
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
    
    const galleryArray = formData.galleryImages.split('\n').map(url => url.trim()).filter(url => url !== '');
    const finalImages = [formData.img || 'https://images.unsplash.com/photo-1599643478514-4a1101858ff6?auto=format&fit=crop&q=80&w=600', ...galleryArray];

    const productPayload = {
      name: formData.name,
      originalPrice: formattedOriginalPrice,
      price: formattedPrice,
      category: formData.category,
      collection: formData.collection,
      desc: formData.desc,
      shortDesc: formData.shortDesc,
      careInstructions: formData.careInstructions,
      img: formData.img || 'https://images.unsplash.com/photo-1599643478514-4a1101858ff6?auto=format&fit=crop&q=80&w=600',
      images: finalImages,
      hoverImage: formData.hoverImage,
      videoUrl: formData.videoUrl,
      sku: formData.sku,
      metal: formData.metal,
      purity: formData.purity,
      weight: formData.weight ? `${formData.weight}g` : '',
      finish: formData.finish,
      stoneType: formData.stoneType,
      stoneWeight: formData.stoneWeight,
      hallmarked: formData.hallmarked === 'Yes',
      certificate: formData.certificate === 'Yes',
      stockQuantity: parseInt(formData.stockQuantity, 10) || 0,
      lowStockThreshold: parseInt(formData.lowStockThreshold, 10) || 5
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
          
          <h3 className="form-section-title">Media & Assets</h3>
          
          <div className="form-row">
            <div className="form-group half">
              <label>Main Image URL (Required)</label>
              <input 
                type="url" 
                name="img" 
                value={formData.img} 
                onChange={handleChange} 
                placeholder="https://..."
                required
              />
            </div>
            <div className="form-group half">
              <label>Hover Image URL (Optional)</label>
              <input 
                type="url" 
                name="hoverImage" 
                value={formData.hoverImage} 
                onChange={handleChange} 
                placeholder="Image shown on mouse hover..."
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Gallery Images (Optional, one URL per line)</label>
              <textarea 
                name="galleryImages" 
                value={formData.galleryImages} 
                onChange={handleChange} 
                rows="4"
                placeholder="https://image1...&#10;https://image2..."
              ></textarea>
            </div>
            <div className="form-group half">
              <label>Product Video URL (Optional 360° view)</label>
              <input 
                type="url" 
                name="videoUrl" 
                value={formData.videoUrl} 
                onChange={handleChange} 
                placeholder="e.g. YouTube or MP4 link..."
              />
            </div>
          </div>

          <h3 className="form-section-title">Product Description</h3>
          
          <div className="form-group">
            <label>Short Description (For product cards)</label>
            <input 
              type="text" 
              name="shortDesc" 
              value={formData.shortDesc} 
              onChange={handleChange} 
              placeholder="A brief 1-sentence highlight..."
            />
          </div>

          <div className="form-group">
            <label>Detailed Description</label>
            <textarea 
              name="desc" 
              value={formData.desc} 
              onChange={handleChange} 
              rows="4"
              required
              placeholder="Fully describe the jewelry piece..."
            ></textarea>
          </div>

          <div className="form-group">
            <label>Care Instructions (Optional)</label>
            <textarea 
              name="careInstructions" 
              value={formData.careInstructions} 
              onChange={handleChange} 
              rows="3"
              placeholder="e.g. Keep away from water and perfume..."
            ></textarea>
          </div>

          <h3 className="form-section-title">Jewellery Details</h3>
          
          <div className="form-row">
            <div className="form-group half">
              <label>SKU</label>
              <input 
                type="text" 
                name="sku" 
                value={formData.sku} 
                onChange={handleChange} 
                placeholder="e.g. MRG-RNG-001"
                required
              />
            </div>
            <div className="form-group half">
              <label>Metal</label>
              <select name="metal" value={formData.metal} onChange={handleChange}>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Purity</label>
              <select name="purity" value={formData.purity} onChange={handleChange}>
                <option value="925">925 (Sterling Silver)</option>
                <option value="999">999 (Pure Silver)</option>
                <option value="22k">22k Gold</option>
                <option value="18k">18k Gold</option>
              </select>
            </div>
            <div className="form-group half">
              <label>Weight (grams)</label>
              <input 
                type="number" 
                step="0.01"
                name="weight" 
                value={formData.weight} 
                onChange={handleChange} 
                placeholder="e.g. 15"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Finish (Optional)</label>
              <input 
                type="text" 
                name="finish" 
                value={formData.finish} 
                onChange={handleChange} 
                placeholder="e.g. Matte, High Polish, Oxidized"
              />
            </div>
            <div className="form-group half">
              <label>Hallmarked</label>
              <select name="hallmarked" value={formData.hallmarked} onChange={handleChange}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Stone Type</label>
              <select name="stoneType" value={formData.stoneType} onChange={handleChange}>
                <option value="None">None</option>
                <option value="Cubic Zirconia">Cubic Zirconia (CZ)</option>
                <option value="Diamond">Diamond</option>
                <option value="Gemstone">Other Gemstone</option>
              </select>
            </div>
            <div className="form-group half">
              <label>Stone Weight (Optional)</label>
              <input 
                type="text" 
                name="stoneWeight" 
                value={formData.stoneWeight} 
                onChange={handleChange} 
                placeholder="e.g. 0.5 ct"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Certificate Included</label>
              <select name="certificate" value={formData.certificate} onChange={handleChange}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <h3 className="form-section-title">Initial Inventory</h3>

          <div className="form-row">
            <div className="form-group half">
              <label>Initial Stock Quantity</label>
              <input 
                type="number" 
                name="stockQuantity" 
                value={formData.stockQuantity} 
                onChange={handleChange} 
                placeholder="0"
                min="0"
              />
            </div>
            <div className="form-group half">
              <label>Low Stock Alert Threshold</label>
              <input 
                type="number" 
                name="lowStockThreshold" 
                value={formData.lowStockThreshold} 
                onChange={handleChange} 
                placeholder="5"
                min="0"
              />
            </div>
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
