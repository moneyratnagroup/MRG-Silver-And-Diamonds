import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { API_URL, fetchWithAuth } from '../../utils/api';
import { ArrowLeft, Upload, Plus } from 'lucide-react';
import MultiSelectDropdown from '../../components/admin/MultiSelectDropdown';
import './AdminProductForm.css';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminProducts, products, addProduct, updateProduct, categories, metals, collections, occasions, coupons } = useShop();
  const isEditing = Boolean(id);
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [stones, setStones] = useState([]);
  const [showAddStone, setShowAddStone] = useState(false);
  const [stoneName, setStoneName] = useState('');
  const [stoneError, setStoneError] = useState('');
  const [savingStone, setSavingStone] = useState(false);
  const [purities, setPurities] = useState([]);

  useEffect(() => {
    fetchWithAuth('/api/v1/products/purities').then(async response => {
      if (!response.ok) throw new Error('Unable to load purities. Please reload the page.');
      setPurities(await response.json());
    }).catch(error => setStoneError(error.message));
  }, [isEditing]);

  useEffect(() => {
    fetchWithAuth('/api/v1/products/stones')
      .then(async response => {
        if (!response.ok) throw new Error('Unable to load stones.');
        setStones(await response.json());
      })
      .catch(error => setStoneError(error.message));
  }, [isEditing]);

  const handleSaveStone = async () => {
    const name = stoneName.trim();
    if (!name || name.length > 100 || name.toLowerCase() === 'none') {
      setStoneError('Enter a stone name of up to 100 characters other than None.');
      return;
    }
    const existing = stones.find(stone => stone.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      setFormData(prev => ({ ...prev, stoneType: existing.name }));
      setShowAddStone(false);
      setStoneName('');
      setStoneError('');
      return;
    }
    setSavingStone(true);
    setStoneError('');
    try {
      const response = await fetchWithAuth('/api/v1/products/stones', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error('Unable to save stone. Please try again.');
      const stone = await response.json();
      setStones(prev => [...prev, stone]);
      setFormData(prev => ({ ...prev, stoneType: stone.name }));
      setShowAddStone(false);
      setStoneName('');
    } catch (error) {
      setStoneError(error.message);
    } finally {
      setSavingStone(false);
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    originalPrice: '',
    price: '',
    category: '',
    collectionIds: [],
    occasionIds: [],
    desc: '',
    shortDesc: '',
    careInstructions: '',
    img: '',
    galleryImages: '',
    hoverImage: '',
    videoUrl: '',
    sku: `MRG-${Math.floor(100000 + Math.random() * 900000)}`,
    metal: '',
    purity: '',
    weight: '',
    grossWeight: '',
    makingCharges: '',
    finish: '',
    stoneType: 'None',
    stoneWeight: '',
    hallmarked: 'Yes',
    certificate: 'No',
    stockQuantity: '',
    lowStockThreshold: '5',
    isOfferAvailable: 'No',
    offerCouponCode: '',
    status: 'DRAFT'
  });

  const hasStone = formData.stoneType !== 'None';
  const grossWeight = Number(formData.grossWeight);
  const stoneWeight = hasStone ? Number(formData.stoneWeight) : 0;
  const validWeights = formData.grossWeight !== '' && Number.isFinite(grossWeight) && grossWeight > 0
    && (!hasStone || formData.stoneWeight !== '') && Number.isFinite(stoneWeight)
    && stoneWeight >= 0 && stoneWeight <= grossWeight;
  const netWeight = validWeights ? Number((grossWeight - stoneWeight).toFixed(4)) : '';

  useEffect(() => {
    if (isEditing) {
      const productToEdit = adminProducts.find(p => p.id === parseInt(id));
      if (productToEdit) {
        setFormData({
          name: productToEdit.name,
          originalPrice: productToEdit.originalPrice ? productToEdit.originalPrice.replace('₹', '').replace(',', '') : '',
          price: productToEdit.price.replace('₹', '').replace(',', ''),
          category: productToEdit.category || '',
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
          metal: productToEdit.metal || '',
          purity: productToEdit.purityId ?? '',
          grossWeight: productToEdit.grossWeight ?? '',
          makingCharges: productToEdit.makingCharges ?? '',
          weight: productToEdit.weight ? productToEdit.weight.replace('g', '') : '',
          finish: productToEdit.finish || '',
          stoneType: productToEdit.stones?.[0]?.name || 'None',
          stoneWeight: productToEdit.stoneWeight ?? '',
          hallmarked: productToEdit.hallmarked !== false ? 'Yes' : 'No',
          certificate: productToEdit.certificate === true ? 'Yes' : 'No',
          stockQuantity: productToEdit.stockQuantity || 0,
          lowStockThreshold: productToEdit.lowStockThreshold || 5,
          isOfferAvailable: productToEdit.isOfferAvailable ? 'Yes' : 'No',
          offerCouponCode: productToEdit.offerCouponCode || '',
          status: productToEdit.status || 'DRAFT'
        });
      }
    }
  }, [id, adminProducts, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'metal' ? { purity: '' } : {}),
      ...(name === 'stoneType' && value === 'None' ? { stoneWeight: '' } : {}),
    }));
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
      const response = await fetchWithAuth(`/api/v1/upload/`, {
        method: 'POST',
        body: formDataObj,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      const imageUrl = `${API_URL}${data.url}`;

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
    {
      if (!formData.purity || !purities.some(purity => purity.id === Number(formData.purity) && purity.metal_id === metals.find(metal => metal.name === formData.metal)?.id)) newErrors.purity = 'Select a purity for the selected metal.';
      if (!validWeights) newErrors.weights = 'Enter a positive gross weight and a stone weight between zero and gross weight.';
      if (formData.makingCharges === '' || !Number.isFinite(Number(formData.makingCharges)) || Number(formData.makingCharges) < 0) {
        newErrors.makingCharges = 'Enter making charges of zero or more.';
      }
    }

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
      purity_id: Number(formData.purity),
      gross_weight: grossWeight,
      stone_weight: stoneWeight,
      making_charges: Number(formData.makingCharges),
      selling_price: parseFloat(formData.price),
      mrp_price: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      is_new_arrival: false,
      is_featured: false,
      status: formData.status,
      is_offer_available: formData.isOfferAvailable === 'Yes',
      offer_coupon_code: formData.isOfferAvailable === 'Yes' && formData.offerCouponCode ? formData.offerCouponCode : null,
      images: finalImages.map((url, idx) => ({ image_url: url, is_primary: idx === 0 })),
      occasion_ids: formData.occasionIds,
      stone_ids: formData.stoneType === 'None'
        ? []
        : stones.filter(stone => stone.name === formData.stoneType).map(stone => stone.id),
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
            <label>Product Name <span style={{ color: '#dc3545' }}>*</span></label>
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
              <label>Selling Price (₹) <span style={{ color: '#dc3545' }}>*</span></label>
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
                <option value="">-- Select Product Type --</option>
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
            <div className="form-group half">
              <label>Status <span style={{ color: '#dc3545' }}>*</span></label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="DRAFT">Draft (Hidden from customers)</option>
                <option value="PUBLISHED">Published (Visible to customers)</option>
                <option value="ARCHIVED">Archived (Discontinued)</option>
              </select>
            </div>

            <div className="form-group half">
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
              <label>Main Image URL or Upload <span style={{ color: '#dc3545' }}>*</span></label>
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
              {formData.img && (
                <div style={{ marginTop: '10px' }}>
                  <img src={formData.img} alt="Main Preview" style={{ height: '80px', width: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
                </div>
              )}
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
              {formData.hoverImage && (
                <div style={{ marginTop: '10px' }}>
                  <img src={formData.hoverImage} alt="Hover Preview" style={{ height: '80px', width: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
                </div>
              )}
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
              {formData.galleryImages && formData.galleryImages.trim() !== '' && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {formData.galleryImages.split('\n').map(url => url.trim()).filter(url => url !== '').map((url, idx) => (
                    <img key={idx} src={url} alt={`Gallery ${idx + 1}`} style={{ height: '60px', width: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
                  ))}
                </div>
              )}
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
            <label>Detailed Description <span style={{ color: '#dc3545' }}>*</span></label>
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
              <label>SKU <span style={{ color: '#dc3545' }}>*</span></label>
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
                <option value="">-- Select Metal --</option>
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
                <option value="">-- Select Purity --</option>
                {purities.filter(purity => purity.metal_id === metals.find(metal => metal.name === formData.metal)?.id).map(purity => (
                  <option key={purity.id} value={purity.id}>{purity.name}</option>
                ))}
              </select>
              {errors.purity && <p className="error-text" role="alert">{errors.purity}</p>}
            </div>
            <div className="form-group half">
              <label>Gross Weight (grams)</label>
              <input
                type="number"
                step="0.01"
                name="grossWeight"
                value={formData.grossWeight}
                onChange={handleChange}
                placeholder="e.g. 15"
              />
            </div>
          </div>

            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="product-net-weight">Net Metal Weight (grams)</label>
                <input id="product-net-weight" type="number" value={netWeight} readOnly placeholder="Calculated automatically" />
                <small>Gross weight minus stone weight; both weights are in grams.</small>
                {errors.weights && <p className="error-text" role="alert">{errors.weights}</p>}
              </div>
              <div className="form-group half">
                <label htmlFor="product-making-charges">Making Charges (INR per product)</label>
                <input id="product-making-charges" type="number" name="makingCharges" value={formData.makingCharges} min="0" step="0.01" onChange={handleChange} placeholder="e.g. 450" />
                {errors.makingCharges && <p className="error-text" role="alert">{errors.makingCharges}</p>}
              </div>
            </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Colour (Optional)</label>
              <select name="finish" value={formData.finish} onChange={handleChange}>
                <option value="">-- Select Colour --</option>
                <option value="Silver">Silver</option>
                <option value="Rose Gold">Rose Gold</option>
                <option value="Yellow Gold">Yellow Gold</option>
                <option value="Rhodium Plated">Rhodium Plated</option>
              </select>
            </div>
            <div className="form-group half">
              <label>Hallmarked</label>
              <select name="hallmarked" value={formData.hallmarked} onChange={handleChange}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <div className="form-row add-product-stone-row">
            <div className="form-group half">
              <label htmlFor="product-stone-type">Stone Type</label>
              <div className="stone-type-control">
              <select id="product-stone-type" name="stoneType" value={formData.stoneType} onChange={handleChange}>
                <option value="None">None</option>
                {stones.filter(stone => stone.name.toLowerCase() !== 'none').map(stone => (
                  <option key={stone.id} value={stone.name}>{stone.name}</option>
                ))}
              </select>
              {<button type="button" className="stone-add-button" aria-label="Add stone" title="Add stone" aria-expanded={showAddStone} onClick={() => { setShowAddStone(prev => !prev); setStoneError(''); }}><Plus size={18} /></button>}
              </div>
              {showAddStone && (
                <div className="stone-add-panel">
                  <label htmlFor="new-stone-name">Stone Name (Required)</label>
                  <input id="new-stone-name" type="text" value={stoneName} maxLength={100} placeholder="e.g. Ruby or Emerald" disabled={savingStone} onChange={e => setStoneName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (!savingStone) handleSaveStone(); } }} />
                  <div className="stone-add-actions">
                    <button type="button" onClick={handleSaveStone} disabled={savingStone}>{savingStone ? 'Saving...' : 'Save stone'}</button>
                    <button type="button" disabled={savingStone} onClick={() => { setShowAddStone(false); setStoneName(''); setStoneError(''); }}>Cancel</button>
                  </div>
                </div>
              )}
              {stoneError && <p role="alert">{stoneError}</p>}
            </div>
            {(formData.stoneType !== 'None') && (
              <div className="form-group half">
                <label>Stone Weight (grams)</label>
                <input
                  type="number"
                  min="0"
                  step="0.0001"
                  name="stoneWeight"
                  value={formData.stoneWeight}
                  onChange={handleChange}
                  placeholder="e.g. 0.1 g"
                />
                {<small>Enter grams: 1 carat = 0.2 grams.</small>}
              </div>
            )}
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
              {isEditing ? 'Update' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;
