import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import './AdminTestimonials.css';

const AdminTestimonialForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { testimonials, addTestimonial, updateTestimonial } = useShop();
  
  const [formData, setFormData] = useState({
    id: null,
    customerName: '',
    place: '',
    image: null,
    imagePreview: '',
    rating: 5,
    message: '',
    isActive: true,
    displayOrder: 0,
    adminNotes: ''
  });

  useEffect(() => {
    if (id) {
      const existing = testimonials.find(t => t.id === parseInt(id, 10));
      if (existing) {
        setFormData({
          id: existing.id,
          customerName: existing.customerName || '',
          place: existing.place || '',
          image: existing.imageKey || null,
          imagePreview: existing.image || '',
          rating: existing.rating || 5,
          message: existing.message || '',
          isActive: existing.isActive !== undefined ? existing.isActive : true,
          displayOrder: existing.displayOrder !== undefined ? existing.displayOrder : 0,
          adminNotes: existing.adminNotes || ''
        });
      }
    }
  }, [id, testimonials]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      if (files && files[0]) {
        setFormData(prev => ({
          ...prev,
          image: files[0],
          imagePreview: URL.createObjectURL(files[0])
        }));
      }
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: name === 'rating' || name === 'displayOrder' ? parseInt(value, 10) || 0 : value 
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    let finalImageKey = formData.image;

    // If there is a newly selected file (it's a File object, not a string URL)
    if (formData.image instanceof File) {
      const uploadData = new FormData();
      uploadData.append('file', formData.image);
      
      try {
        const res = await fetch("http://localhost:8000/api/v1/upload/", {
          method: 'POST',
          body: uploadData
        });
        if (res.ok) {
          const data = await res.json();
          finalImageKey = data.url;
        } else {
          alert("Image upload failed");
          return;
        }
      } catch (err) {
        console.error("Upload error", err);
        alert("Image upload error");
        return;
      }
    }

    const payloadToSave = { ...formData, imageKey: finalImageKey };

    if (id) {
      const success = await updateTestimonial(payloadToSave);
      if (success) {
        alert("Testimonial updated successfully!");
        navigate('/admin/testimonials');
      } else {
        alert("Failed to update testimonial.");
      }
    } else {
      const success = await addTestimonial(payloadToSave);
      if (success) {
        alert("Testimonial added successfully!");
        navigate('/admin/testimonials');
      } else {
        alert("Failed to add testimonial.");
      }
    }
  };

  return (
    <div className="admin-testimonials-container">
      <div className="admin-page-header">
        <h1>{id ? 'Edit Testimonial' : 'Add New Testimonial'}</h1>
        <p>Fill out the fields below to {id ? 'update this' : 'create a new'} customer testimonial.</p>
      </div>

      <div className="admin-rates-card" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <form onSubmit={handleSave} className="product-form">
          <div className="form-row">
            <div className="form-group half">
              <label>Customer Name *</label>
              <input 
                type="text" 
                name="customerName" 
                value={formData.customerName} 
                onChange={handleChange} 
                required 
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="form-group half">
              <label>Location / Place</label>
              <input 
                type="text" 
                name="place" 
                value={formData.place} 
                onChange={handleChange} 
                placeholder="e.g. Mumbai, India"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group half">
              <label>Customer Image (Choose Image)</label>
              <input 
                type="file" 
                name="image" 
                accept="image/*"
                onChange={handleChange} 
              />
              {formData.imagePreview && (
                <div className="img-preview-box" style={{ marginTop: '10px', width: '120px', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
                  <img src={formData.imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>
            
            <div className="form-group half">
              <label>Star Rating *</label>
              <select 
                name="rating" 
                value={formData.rating} 
                onChange={handleChange}
                required
              >
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Review Message *</label>
            <textarea 
              name="message" 
              value={formData.message} 
              onChange={handleChange} 
              required
              rows="4"
              placeholder="Customer's feedback..."
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group half" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
              <input 
                type="checkbox" 
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                style={{ width: 'auto', marginBottom: 0 }}
              />
              <label htmlFor="isActive" style={{ marginBottom: 0 }}>Is Active (Visible on site)</label>
            </div>
            <div className="form-group half">
              <label>Display Order (Priority)</label>
              <input 
                type="number" 
                name="displayOrder" 
                value={formData.displayOrder} 
                onChange={handleChange} 
                placeholder="e.g. 1"
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Admin Notes (Internal Only)</label>
            <textarea 
              name="adminNotes" 
              value={formData.adminNotes} 
              onChange={handleChange} 
              rows="2"
              placeholder="e.g. Received via WhatsApp. Approved photo usage."
            ></textarea>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" onClick={() => navigate('/admin/testimonials')} style={{ flex: 1, padding: '0.75rem', border: '1px solid #ccc', background: 'white', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" className="btn-submit" style={{ flex: 1 }}>
              {id ? 'Update Testimonial' : 'Save Testimonial'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminTestimonialForm;
