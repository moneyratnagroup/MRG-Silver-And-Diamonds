import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { ArrowLeft, Upload } from 'lucide-react';
import MultiSelectDropdown from '../../components/admin/MultiSelectDropdown';
import './AdminProductForm.css';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminProducts: products, addProduct, updateProduct, categories, metals, coupons, collections, occasions } = useShop();
  
  const isEditing = Boolean(id);
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    originalPrice: '',
    price: '',
    category: 'Rings',
    collectionIds: [],
    occasionIds: [],
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
    lowStockThreshold: '5',
    isOfferAvailable: 'No',
    offerCouponCode: ''
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
          collectionIds: productToEdit.collections?.map(c => c.id) || [],
          occasionIds: productToEdit.occasions?.map(o => o.id) || [],
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
          lowStockThreshold: productToEdit.lowStockThreshold || 5,
          isOfferAvailable: productToEdit.isOfferAvailable ? 'Yes' : 'No',
          offerCouponCode: productToEdit.offerCouponCode || ''
        });
      }
    }
  }, [id, products, isEditing]);

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

      if (field === 'galleryImages') {
        setFormData(prev => ({ 
          ...prev, 
          [field]: prev[field] ? `${prev[field]}\n${imageUrl}` : imageUrl 
        }));
      } else {
        setFormData(prev => ({ ...prev, [field]: imageUrl }));
      }
    } catch (error) {
      alert("Error uploading image: " + error.message);
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.name) newErrors.name = true;
    if (!formData.price) newErrors.price = true;
    if (!formData.img) newErrors.img = true;
    if (!formData.desc) newErrors.desc = true;
    if (!formData.sku) newErrors.sku = true;
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop submission
    }
    setErrors({});
    
    // Format price
    const formattedPrice = `₹${Number(formData.price).toLocaleString('en-IN')}`;
    const formattedOriginalPrice = formData.originalPrice ? `₹${Number(formData.originalPrice).toLocaleString('en-IN')}` : null;
    
    const galleryArray = formData.galleryImages.split('\n').map(url => url.trim()).filter(url => url !== '');
    const finalImages = [formData.img || 'https://images.unsplash.com/photo-1599643478514-4a1101858ff6?auto=format&fit=crop&q=80&w=600'];
    if (formData.hoverImage) {
      finalImages.push(formData.hoverImage.trim());
    }
    finalImages.push(...galleryArray);

    const productPayload = {
      sku: formData.sku,
      name: formData.name,
      description: formData.desc,
      category_id: categories.find(c => c.name === formData.category)?.id || null,
      metal_id: metals.find(m => m.name === formData.metal)?.id || null,
      purity_id: null,
      selling_price: parseFloat(formData.price),
      mrp_price: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      is_new_arrival: false,
      is_featured: false,
      is_active: true,
      is_offer_available: formData.isOfferAvailable === 'Yes',
      offer_coupon_code: formData.isOfferAvailable === 'Yes' && formData.offerCouponCode ? formData.offerCouponCode : null,
      images: finalImages.map((url, idx) => ({ image_url: url, is_primary: idx === 0 })),
      occasion_ids: formData.occasionIds,
      stone_ids: [],
      collection_ids: formData.collectionIds
    };

    let result;
    if (isEditing) {
      // Assuming updateProduct also returns { success: ..., error: ... } or just update it to
      result = await updateProduct({ ...productPayload, id: parseInt(id) });
    } else {
      result = await addProduct(productPayload);
    }
    
    if (result && result.success) {
      navigate('/admin/products');
    } else {
      alert(result?.error || "Failed to save product. Please try again.");
    }
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
        <form onSubmit={handleSubmit} className="product-form" noValidate>
          <div className="form-group">
            <label>Product Name <span style={{color: '#dc3545'}}>*</span></label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className={errors.name ? 'input-error' : ''}
              placeholder="e.g. Diamond Stud Earrings"
            />
            {errors.name && <span className="error-text">required</span>}
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
              <label>Selling Price (₹) <span style={{color: '#dc3545'}}>*</span></label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                className={errors.price ? 'input-error' : ''}
                placeholder="2999"
              />
              {errors.price && <span className="error-text">required</span>}
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
          
          <h3 className="form-section-title">Media & Assets</h3>
          
          <div className="form-row">
            <div className="form-group half">
              <label>Main Image URL or Upload <span style={{color: '#dc3545'}}>*</span></label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  name="img" 
                  value={formData.img} 
                  onChange={handleChange} 
                  className={errors.img ? 'input-error' : ''}
                  placeholder="https://..."
                  style={{ flex: 1 }}
                />
                <label className="btn-upload" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0 15px', background: '#e0e0e0', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <Upload size={16} />
                  <span>{isUploading ? '...' : 'Upload'}</span>
                  <input type="file" accept="image/*,image/webp" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'img')} disabled={isUploading} />
                </label>
              </div>
              {errors.img && <span className="error-text">required</span>}
            </div>
            <div className="form-group half">
              <label>Hover Image URL (Optional) or Upload</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  name="hoverImage" 
                  value={formData.hoverImage} 
                  onChange={handleChange} 
                  placeholder="Image shown on mouse hover..."
                  style={{ flex: 1 }}
                />
                <label className="btn-upload" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0 15px', background: '#e0e0e0', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <Upload size={16} />
                  <span>{isUploading ? '...' : 'Upload'}</span>
                  <input type="file" accept="image/*,image/webp" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'hoverImage')} disabled={isUploading} />
                </label>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ margin: 0 }}>Gallery Images (One URL per line)</label>
                <label className="btn-upload" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', background: '#e0e0e0', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.85rem' }}>
                  <Upload size={14} />
                  <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                  <input type="file" accept="image/*,image/webp" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'galleryImages')} disabled={isUploading} />
                </label>
              </div>
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
            <label>Detailed Description <span style={{color: '#dc3545'}}>*</span></label>
            <textarea 
              name="desc" 
              value={formData.desc} 
              onChange={handleChange} 
              className={errors.desc ? 'input-error' : ''}
              rows="4"
              placeholder="Fully describe the jewelry piece..."
            ></textarea>
            {errors.desc && <span className="error-text">required</span>}
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
              <label>SKU <span style={{color: '#dc3545'}}>*</span></label>
              <input 
                type="text" 
                name="sku" 
                value={formData.sku} 
                onChange={handleChange} 
                className={errors.sku ? 'input-error' : ''}
                placeholder="e.g. MRG-RNG-001"
              />
              {errors.sku && <span className="error-text">required</span>}
            </div>
            <div className="form-group half">
              <label>Metal</label>
              <select name="metal" value={formData.metal} onChange={handleChange}>
                {metals && metals.map(m => (
                   <option key={m.id} value={m.name}>{m.name}</option>
                ))}
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

          <h3 className="form-section-title">Offers & Promotions</h3>
          
          <div className="form-row">
            <div className="form-group half">
              <label>Is Offer Available?</label>
              <select name="isOfferAvailable" value={formData.isOfferAvailable} onChange={handleChange}>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            {formData.isOfferAvailable === 'Yes' && (
              <div className="form-group half">
                <label>Select Coupon</label>
                <select name="offerCouponCode" value={formData.offerCouponCode} onChange={handleChange}>
                  <option value="">-- Select a Coupon --</option>
                  {coupons && coupons.filter(c => c.isActive).map(c => (
                    <option key={c.id} value={c.code}>{c.code} ({c.type === 'percent' ? `${c.value}% OFF` : `₹${c.value} OFF`})</option>
                  ))}
                </select>
              </div>
            )}
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
