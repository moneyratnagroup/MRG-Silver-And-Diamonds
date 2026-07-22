import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';
import './AdminTestimonials.css';

const AdminTestimonials = () => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useShop();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    customerName: '',
    message: '',
    image: '',
    rating: 5,
    place: ''
  });

  const handleOpenModal = (testimonial = null) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({ ...testimonial });
    } else {
      setEditingTestimonial(null);
      setFormData({
        id: null,
        customerName: '',
        message: '',
        image: '',
        rating: 5,
        place: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'rating' ? parseInt(value, 10) : value 
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingTestimonial) {
      updateTestimonial(formData);
    } else {
      addTestimonial(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      deleteTestimonial(id);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} style={{ color: i < rating ? '#eab308' : '#e5e7eb', fontSize: '1.2rem' }}>★</span>
    ));
  };

  return (
    <div className="admin-testimonials-container">
      <div className="admin-page-header">
        <h1>Testimonials Management</h1>
        <p>Manage customer reviews and feedback displayed on the website.</p>
      </div>

      <div className="admin-section-card">
        <div className="section-header-flex">
          <div>
            <h2>All Testimonials</h2>
          </div>
          <button type="button" className="btn-add-item" onClick={() => handleOpenModal()}>
            <Plus size={18} />
            Add Testimonial
          </button>
        </div>
        
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Name</th>
                <th>Place</th>
                <th>Rating</th>
                <th>Message</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials && testimonials.length > 0 ? (
                testimonials.map((testimonial) => (
                  <tr key={testimonial.id}>
                    <td>
                      <div className="table-img-container">
                        {testimonial.image ? (
                          <img src={testimonial.image} alt={testimonial.customerName} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Star size={20} color="#ccc" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="font-medium">{testimonial.customerName}</td>
                    <td>{testimonial.place || '-'}</td>
                    <td>
                      <div className="star-rating-display">
                        {renderStars(testimonial.rating)}
                      </div>
                    </td>
                    <td><div className="truncate-text">{testimonial.message}</div></td>
                    <td>
                      <div className="table-actions">
                        <button type="button" className="btn-icon edit" onClick={() => handleOpenModal(testimonial)} title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button type="button" className="btn-icon delete" onClick={() => handleDelete(testimonial.id)} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-table">
                    No testimonials found. Add some to display on your site!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Testimonial Form Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
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
                  <label>Customer Image URL</label>
                  <input 
                    type="url" 
                    name="image" 
                    value={formData.image} 
                    onChange={handleChange} 
                    placeholder="https://..."
                  />
                  {formData.image && (
                    <div className="table-img-container" style={{ marginTop: '10px' }}>
                      <img src={formData.image} alt="Preview" />
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
              
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-submit">
                  {editingTestimonial ? 'Update Testimonial' : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
