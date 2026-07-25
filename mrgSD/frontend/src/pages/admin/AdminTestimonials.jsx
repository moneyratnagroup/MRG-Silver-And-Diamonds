import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';
import './AdminTestimonials.css';

const AdminTestimonials = () => {
  const { testimonials, deleteTestimonial } = useShop();
  const navigate = useNavigate();

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
          <div className="admin-page-actions">
            <button className="btn-add-product" onClick={() => navigate('/admin/testimonials/new')}>
              <Plus size={20} /> Add Testimonial
            </button>
          </div>
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
                        <button className="btn-action edit" onClick={() => navigate(`/admin/testimonials/edit/${testimonial.id}`)}>
                          <Edit2 size={18} />
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

    </div>
  );
};

export default AdminTestimonials;
