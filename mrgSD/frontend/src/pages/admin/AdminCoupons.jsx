import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Plus, Edit2, Trash2, X, Ticket } from 'lucide-react';
import './AdminCoupons.css';
import './AdminTestimonials.css'; // Reuse modal styles

const AdminCoupons = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, toggleCouponStatus } = useShop();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    code: '',
    type: 'percent',
    value: '',
    minCartValue: '',
    expiryDate: '',
    isActive: true
  });

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({ ...coupon });
    } else {
      setEditingCoupon(null);
      setFormData({
        id: null,
        code: '',
        type: 'percent',
        value: '',
        minCartValue: '',
        expiryDate: '',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      value: Number(formData.value),
      minCartValue: formData.minCartValue ? Number(formData.minCartValue) : null
    };

    if (editingCoupon) {
      updateCoupon(payload);
    } else {
      addCoupon(payload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      deleteCoupon(id);
    }
  };

  return (
    <div className="admin-coupons-container">
      <div className="admin-page-header">
        <h1>Promo Codes & Discounts</h1>
        <p>Manage discount coupons that customers can apply at checkout.</p>
      </div>

      <div className="admin-section-card">
        <div className="section-header-flex">
          <div>
            <h2>All Coupons</h2>
          </div>
          <button type="button" className="btn-add-item" onClick={() => handleOpenModal()}>
            <Plus size={18} />
            Create Coupon
          </button>
        </div>
        
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Min. Spend (₹)</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons && coupons.length > 0 ? (
                coupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td className="font-medium" style={{ letterSpacing: '1px' }}>
                      <Ticket size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                      {coupon.code}
                    </td>
                    <td>
                      {coupon.type === 'percent' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                    </td>
                    <td>{coupon.minCartValue ? `₹${coupon.minCartValue}` : 'None'}</td>
                    <td>{coupon.expiryDate || 'No Expiry'}</td>
                    <td>
                      <span className={`status-badge ${coupon.isActive ? 'active' : 'inactive'}`}>
                        {coupon.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                        <button 
                          className="btn-toggle" 
                          onClick={() => toggleCouponStatus(coupon.id)}
                          title="Toggle Status"
                        >
                          {coupon.isActive ? 'Disable' : 'Enable'}
                        </button>
                        <button type="button" className="btn-icon edit" onClick={() => handleOpenModal(coupon)} title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button type="button" className="btn-icon delete" onClick={() => handleDelete(coupon.id)} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-table">
                    No promo codes created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h2>
              <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="product-form">
              <div className="form-group">
                <label>Coupon Code *</label>
                <input 
                  type="text" 
                  name="code" 
                  value={formData.code} 
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase().replace(/\s/g, '') }))} 
                  required 
                  placeholder="e.g. WELCOME10"
                  style={{ textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group half">
                  <label>Discount Type</label>
                  <select name="type" value={formData.type} onChange={handleChange}>
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                
                <div className="form-group half">
                  <label>Discount Value *</label>
                  <input 
                    type="number" 
                    name="value" 
                    value={formData.value} 
                    onChange={handleChange} 
                    required 
                    min="1"
                    placeholder={formData.type === 'percent' ? "e.g. 10" : "e.g. 500"}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Minimum Cart Value (₹)</label>
                  <input 
                    type="number" 
                    name="minCartValue" 
                    value={formData.minCartValue} 
                    onChange={handleChange} 
                    placeholder="e.g. 2000 (Optional)"
                    min="0"
                  />
                </div>
                
                <div className="form-group half">
                  <label>Expiry Date</label>
                  <input 
                    type="date" 
                    name="expiryDate" 
                    value={formData.expiryDate} 
                    onChange={handleChange} 
                  />
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  id="isActive" 
                  name="isActive" 
                  checked={formData.isActive} 
                  onChange={handleChange} 
                  style={{ width: 'auto' }}
                />
                <label htmlFor="isActive" style={{ marginBottom: 0 }}>Coupon is Active</label>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-submit">
                  {editingCoupon ? 'Update Coupon' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
