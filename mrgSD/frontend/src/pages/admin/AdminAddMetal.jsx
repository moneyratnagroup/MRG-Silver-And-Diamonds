import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import './AdminMetalRates.css';

const AdminAddMetal = () => {
  const { addNewMetalType } = useShop();
  const navigate = useNavigate();
  const [newMetal, setNewMetal] = useState({
    metal_name: '',
    metal_type: '',
    purity: '',
    unit: 'g',
    rate: ''
  });

  const handleAddMetal = async (e) => {
    e.preventDefault();
    const rateNum = parseFloat(newMetal.rate.replace(/[₹,]/g, ''));
    if (isNaN(rateNum)) {
      alert("Please enter a valid initial rate.");
      return;
    }
    await addNewMetalType({
      metal_name: newMetal.metal_name,
      metal_type: newMetal.metal_type,
      purity: newMetal.purity,
      unit: newMetal.unit,
      rate: rateNum,
      is_active: true
    });
    navigate('/admin/rates');
  };

  return (
    <div className="admin-rates-container">
      <div className="admin-page-header">
        <h1>Add New Metal Type</h1>
        <p>Configure a new metal type to track and display in your store.</p>
      </div>

      <div className="admin-rates-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleAddMetal}>
          <div className="form-group">
            <label>Metal ID (Slug)</label>
            <input 
              required 
              type="text" 
              placeholder="e.g. platinum950" 
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px' }} 
              value={newMetal.metal_name} 
              onChange={e => setNewMetal({...newMetal, metal_name: e.target.value.replace(/\s+/g, '')})} 
            />
            <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>No spaces allowed. This is the internal database ID.</small>
          </div>
          <div className="form-group">
            <label>Base Metal Type</label>
            <input 
              required 
              type="text" 
              placeholder="e.g. Platinum, Gold, Silver" 
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px' }} 
              value={newMetal.metal_type} 
              onChange={e => setNewMetal({...newMetal, metal_type: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Purity</label>
            <input 
              required 
              type="text" 
              placeholder="e.g. 950, 18K, Bullion" 
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px' }} 
              value={newMetal.purity} 
              onChange={e => setNewMetal({...newMetal, purity: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Unit</label>
            <select 
              required 
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px', backgroundColor: 'white' }} 
              value={newMetal.unit} 
              onChange={e => setNewMetal({...newMetal, unit: e.target.value})}
            >
              <option value="g">Gram (g)</option>
              <option value="kg">Kilogram (kg)</option>
              <option value="oz">Ounce (oz)</option>
              <option value="tola">Tola</option>
            </select>
          </div>
          <div className="form-group">
            <label>Initial Starting Rate</label>
            <div className="input-with-prefix">
              <span className="currency-prefix">₹</span>
              <input 
                required 
                type="text" 
                placeholder="e.g. 3500" 
                style={{ outline: 'none' }} 
                value={newMetal.rate} 
                onChange={e => setNewMetal({...newMetal, rate: e.target.value})} 
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button 
              type="button" 
              onClick={() => navigate('/admin/rates')} 
              style={{ flex: 1, padding: '0.75rem', border: '1px solid #ccc', background: 'white', borderRadius: '6px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button type="submit" className="btn-save-rates" style={{ flex: 1 }}>Save Metal</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddMetal;
