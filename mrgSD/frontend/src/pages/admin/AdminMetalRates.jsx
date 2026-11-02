import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { Edit2, Trash2, Eye, EyeOff, X, Plus } from 'lucide-react';
import './AdminMetalRates.css';

const AdminMetalRates = () => {
  const { 
    activeMetals, 
    allCreatedMetals, 
    updateMetalRates, 
    updateMetalType, 
    deleteMetalType, 
    toggleMetalVisibility, 
    metalRateHistory, 
    deleteMetalRatesHistory, 
    lastUpdated 
  } = useShop();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('update');
  
  // Edit Metal State
  const [editingMetal, setEditingMetal] = useState(null);
  const [editForm, setEditForm] = useState({
    metal_type: '',
    purity: '',
    unit: 'g',
    rate: '',
    is_active: true
  });
  const [editError, setEditError] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  
  // dynamic inputs state: { metal_name: "₹rate" }
  const [inputs, setInputs] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // History Tab Filters
  const [metalFilter, setMetalFilter] = useState('all'); 
  const [timeframeFilter, setTimeframeFilter] = useState('weekly'); 

  useEffect(() => {
    // Initialize inputs from activeMetals only on first load
    if (activeMetals && activeMetals.length > 0 && !hasInitialized) {
      const initialInputs = {};
      activeMetals.forEach(metal => {
        initialInputs[metal.metal_name] = `₹${metal.rate}`;
      });
      setInputs(initialInputs);
      setHasInitialized(true);
    }
  }, [activeMetals, hasInitialized]);

  const handleInputChange = (metal_name, value) => {
    setInputs(prev => ({ ...prev, [metal_name]: `₹${value.replace('₹', '').trim()}` }));
  };

  const getFilteredData = () => {
    let daysToKeep = 7;
    if (timeframeFilter === 'monthly') daysToKeep = 30;
    if (timeframeFilter === 'yearly') daysToKeep = 365;
    return metalRateHistory.slice(-daysToKeep);
  };

  const filteredData = getFilteredData();
  const displayData = [...filteredData].reverse();

  const handleSave = async (e) => {
    e.preventDefault();
    await updateMetalRates(inputs);
    setIsSaved(true);
    setInputs({}); // Clear fields after saving
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleOpenEdit = (metal) => {
    setEditingMetal(metal);
    setEditForm({
      metal_type: metal.metal_type || '',
      purity: metal.purity || '',
      unit: metal.unit || 'g',
      rate: metal.rate ? String(metal.rate) : '',
      is_active: metal.is_active !== undefined ? Boolean(metal.is_active) : true
    });
    setEditError('');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsSavingEdit(true);
    setEditError('');

    const numRate = parseFloat(String(editForm.rate).replace(/[₹,]/g, ''));
    if (isNaN(numRate)) {
      setEditError('Please enter a valid rate number.');
      setIsSavingEdit(false);
      return;
    }

    const payload = {
      metal_name: editingMetal.metal_name,
      metal_type: editForm.metal_type,
      purity: editForm.purity,
      unit: editForm.unit,
      rate: numRate,
      is_active: editForm.is_active
    };

    const res = await updateMetalType(editingMetal.id, payload);
    setIsSavingEdit(false);
    if (res?.success) {
      setEditingMetal(null);
    } else {
      setEditError(res?.error || 'Failed to update metal');
    }
  };

  const handleDeleteMetal = async (metal) => {
    const confirmMsg = `Are you sure you want to delete "${metal.purity} ${metal.metal_type}" (${metal.metal_name})?\nThis will remove it from configured metals.`;
    if (window.confirm(confirmMsg)) {
      await deleteMetalType(metal.id, metal.metal_name);
    }
  };

  const handleToggleVisibility = async (metal) => {
    await toggleMetalVisibility(metal);
  };

  // Distinct metal types for filtering
  const distinctTypes = activeMetals && activeMetals.length > 0 
      ? [...new Set(activeMetals.map(m => m.metal_type.toLowerCase()))] 
      : [];

  return (
    <div className="admin-rates-container">
      <div className="admin-page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Metal Rates Management</h1>
            <p>Update the daily rates displayed on the frontend.</p>
          </div>
          <button className="btn-save-rates" onClick={() => navigate('/admin/rates/new')} style={{ backgroundColor: '#1a1a1a' }}>
            + Add New Metal Type
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'update' ? 'active' : ''}`}
          onClick={() => setActiveTab('update')}
        >
          Update Current Rates
        </button>
        <button 
          className={`admin-tab ${activeTab === 'metals' ? 'active' : ''}`}
          onClick={() => setActiveTab('metals')}
        >
          Configured Metals ({allCreatedMetals?.length || activeMetals?.length || 0})
        </button>
        <button 
          className={`admin-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Rate History
        </button>
      </div>

      <div className="admin-rates-card">
        {activeTab === 'update' && (
          <form onSubmit={handleSave}>
            {(!activeMetals || activeMetals.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#666' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🪙</div>
                <h3 style={{ marginBottom: '0.5rem', color: '#333', fontFamily: '"Playfair Display", serif' }}>No Metal Types Found</h3>
                <p style={{ marginBottom: '1.5rem' }}>You haven't configured any metal types yet to update their rates.</p>
                <button type="button" className="btn-save-rates" onClick={() => navigate('/admin/rates/new')}>
                  Add Your First Metal Type
                </button>
              </div>
            ) : (
              <>
                {lastUpdated && (
                  <div style={{ marginBottom: '1.5rem', color: '#555', fontSize: '0.9rem', padding: '0.5rem 0.75rem', backgroundColor: '#f8f9fa', borderRadius: '4px', borderLeft: '3px solid var(--accent)' }}>
                    <strong>Last Updated:</strong> {lastUpdated}
                  </div>
                )}
                {activeMetals.map(metal => (
                  <div className="form-group" key={metal.metal_name}>
                    <label htmlFor={metal.metal_name}>
                      {metal.purity === 'Bullion' ? `${metal.metal_type} Bullion` : `${metal.purity} ${metal.metal_type}`} Rate (per {metal.unit})
                    </label>
                    <div className="input-with-prefix">
                      <span className="currency-prefix">₹</span>
                      <input 
                        type="text" 
                        id={metal.metal_name}
                        value={(inputs[metal.metal_name] || "").replace('₹', '')} 
                        onChange={(e) => handleInputChange(metal.metal_name, e.target.value)}
                        placeholder={`e.g. ${metal.rate}`}
                      />
                    </div>
                  </div>
                ))}

                <div className="form-actions">
                  <button type="submit" className="btn-save-rates">
                    Save Changes
                  </button>
                  {isSaved && <span className="save-success-msg">Rates updated successfully!</span>}
                </div>
              </>
            )}
          </form>
        )}

        {/* Configured Metals Management Tab */}
        {activeTab === 'metals' && (
          <div className="configured-metals-container">
            <div className="metals-tab-header">
              <div>
                <h3>All Configured Metals ({allCreatedMetals?.length || 0})</h3>
                <p>View created metals, modify specifications, toggle display visibility on the rates bar, or delete them.</p>
              </div>
            </div>

            {(!allCreatedMetals || allCreatedMetals.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#666' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🪙</div>
                <h3 style={{ marginBottom: '0.5rem', color: '#333' }}>No Metals Found</h3>
                <p style={{ marginBottom: '1.5rem' }}>No metal types configured yet.</p>
                <button type="button" className="btn-save-rates" onClick={() => navigate('/admin/rates/new')}>
                  Add Your First Metal Type
                </button>
              </div>
            ) : (
              <div className="history-table-container">
                <table className="history-table metals-table">
                  <thead>
                    <tr>
                      <th>Metal Type</th>
                      <th>Purity</th>
                      <th>ID (Slug)</th>
                      <th>Unit</th>
                      <th>Current Rate</th>
                      <th style={{ textAlign: 'center' }}>Show on Rates Bar</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allCreatedMetals.map((metal) => (
                      <tr key={metal.id || metal.metal_name}>
                        <td style={{ fontWeight: '600' }}>{metal.metal_type}</td>
                        <td>{metal.purity}</td>
                        <td><code>{metal.metal_name}</code></td>
                        <td>{metal.unit}</td>
                        <td style={{ fontWeight: '600' }}>₹{metal.rate}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            className={`metal-visibility-btn ${metal.is_active ? 'active' : 'inactive'}`}
                            onClick={() => handleToggleVisibility(metal)}
                            title={metal.is_active ? "Showing on website. Click to hide." : "Hidden from website. Click to show."}
                          >
                            {metal.is_active ? (
                              <>
                                <Eye size={14} /> Showing
                              </>
                            ) : (
                              <>
                                <EyeOff size={14} /> Hidden
                              </>
                            )}
                          </button>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              type="button"
                              className="metal-action-btn edit"
                              onClick={() => handleOpenEdit(metal)}
                              title="Edit metal details"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              type="button"
                              className="metal-action-btn delete"
                              onClick={() => handleDeleteMetal(metal)}
                              title="Delete metal type"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="rate-history-container">
            <h3>Rate Fluctuations</h3>
            
            <div className="history-controls">
              <div className="filter-group">
                <span className="filter-label">Metal:</span>
                <div className="filter-buttons">
                  <button type="button" className={`filter-btn ${metalFilter === 'all' ? 'active' : ''}`} onClick={() => setMetalFilter('all')}>All</button>
                  {distinctTypes.map(type => (
                     <button key={type} type="button" className={`filter-btn ${metalFilter === type ? 'active' : ''}`} onClick={() => setMetalFilter(type)} style={{textTransform: 'capitalize'}}>{type}</button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <span className="filter-label">Timeframe:</span>
                <div className="filter-buttons">
                  <button type="button" className={`filter-btn ${timeframeFilter === 'weekly' ? 'active' : ''}`} onClick={() => setTimeframeFilter('weekly')}>Weekly</button>
                  <button type="button" className={`filter-btn ${timeframeFilter === 'monthly' ? 'active' : ''}`} onClick={() => setTimeframeFilter('monthly')}>Monthly</button>
                  <button type="button" className={`filter-btn ${timeframeFilter === 'yearly' ? 'active' : ''}`} onClick={() => setTimeframeFilter('yearly')}>Yearly</button>
                </div>
              </div>

            </div>
            
            <div className="history-table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    {activeMetals && activeMetals.map(metal => {
                      if (metalFilter === 'all' || metalFilter === metal.metal_type.toLowerCase()) {
                         const name = metal.purity === 'Bullion' ? `${metal.metal_type} Bullion` : `${metal.purity} ${metal.metal_type}`;
                         return (
                           <th key={metal.metal_name} style={{ textAlign: 'center' }}>
                             {name}<br/>
                             <span style={{ fontSize: '0.85em', fontWeight: 'normal', color: '#777' }}>({metal.unit})</span>
                           </th>
                         );
                      }
                      return null;
                    })}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayData.map((entry, index) => {
                    const historyIndex = metalRateHistory.findIndex(h => h.date === entry.date);
                    const prevEntry = historyIndex > 0 ? metalRateHistory[historyIndex - 1] : null;

                    const renderValueWithDiff = (val, key) => {
                      if (val === undefined || val === null || isNaN(val)) return '-';
                      if (!prevEntry || prevEntry[key] === undefined || prevEntry[key] === null) return `₹${val}`;
                      const diff = parseFloat((val - prevEntry[key]).toFixed(2));
                      if (diff > 0) {
                        return (
                          <span>
                            ₹{val} <span style={{ color: '#28a745', fontSize: '0.85em', marginLeft: '4px' }}>▲ +{diff}</span>
                          </span>
                        );
                      } else if (diff < 0) {
                        return (
                          <span>
                            ₹{val} <span style={{ color: '#dc3545', fontSize: '0.85em', marginLeft: '4px' }}>▼ -{Math.abs(diff)}</span>
                          </span>
                        );
                      }
                      return `₹${val}`;
                    };

                    const formatDate = (dateStr) => {
                      if (!dateStr) return '';
                      const parts = dateStr.split('-');
                      if (parts.length === 3) {
                        return `${parts[2]}-${parts[1]}-${parts[0]}`;
                      }
                      return dateStr;
                    };

                    return (
                      <tr key={index}>
                        <td>{formatDate(entry.date)}</td>
                        {activeMetals && activeMetals.map(metal => {
                          if (metalFilter === 'all' || metalFilter === metal.metal_type.toLowerCase()) {
                             return <td key={metal.metal_name}>{renderValueWithDiff(entry[metal.metal_name], metal.metal_name)}</td>;
                          }
                          return null;
                        })}
                        <td>
                          <button 
                            className="delete-rate-btn"
                            title="Delete this historical rate"
                            style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '1.2rem' }}
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this historical rate entry? If it is the current active rate, the previous one will automatically become active.")) {
                                 const historyIndex = metalRateHistory.findIndex(h => h.date === entry.date);
                                 const realEntry = metalRateHistory[historyIndex];
                                 if (realEntry && realEntry.ids && realEntry.ids.length > 0) {
                                     deleteMetalRatesHistory(realEntry.ids);
                                 } else {
                                     alert("Could not find record IDs to delete.");
                                 }
                              }
                            }}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {displayData.length === 0 && (
                    <tr>
                      <td colSpan={(activeMetals ? activeMetals.length : 0) + 2} style={{ textAlign: 'center', padding: '2rem' }}>No history data available for this timeframe.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Metal Modal */}
      {editingMetal && (
        <div className="admin-modal-overlay" onClick={() => setEditingMetal(null)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Edit Metal: {editingMetal.purity} {editingMetal.metal_type}</h3>
              <button type="button" className="btn-close-modal" onClick={() => setEditingMetal(null)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label>Metal ID (Slug)</label>
                <input
                  type="text"
                  disabled
                  value={editingMetal.metal_name}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '6px' }}
                />
                <small style={{ color: '#777', display: 'block', marginTop: '4px' }}>Internal database identifier cannot be changed.</small>
              </div>

              <div className="form-group">
                <label>Base Metal Type</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gold, Silver, Platinum"
                  value={editForm.metal_type}
                  onChange={(e) => setEditForm({ ...editForm, metal_type: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px' }}
                />
              </div>

              <div className="form-group">
                <label>Purity</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 24K, 22K, 925, Bullion"
                  value={editForm.purity}
                  onChange={(e) => setEditForm({ ...editForm, purity: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px' }}
                />
              </div>

              <div className="form-group">
                <label>Unit</label>
                <select
                  value={editForm.unit}
                  onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px', backgroundColor: 'white' }}
                >
                  <option value="g">Gram (g)</option>
                  <option value="kg">Kilogram (kg)</option>
                  <option value="oz">Ounce (oz)</option>
                  <option value="tola">Tola</option>
                </select>
              </div>

              <div className="form-group">
                <label>Rate (₹)</label>
                <div className="input-with-prefix">
                  <span className="currency-prefix">₹</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 7450"
                    value={editForm.rate}
                    onChange={(e) => setEditForm({ ...editForm, rate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1.25rem', padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                <input
                  type="checkbox"
                  id="edit_metal_is_active"
                  checked={editForm.is_active}
                  onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="edit_metal_is_active" style={{ marginBottom: 0, cursor: 'pointer', fontWeight: '500' }}>
                  Show on Frontend Metal Rate Bar (Active)
                </label>
              </div>

              {editError && (
                <p style={{ color: '#dc3545', fontSize: '0.9rem', marginTop: '0.5rem' }}>{editError}</p>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingMetal(null)}
                  style={{ flex: 1, padding: '0.75rem', border: '1px solid #ccc', background: 'white', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-save-rates"
                  disabled={isSavingEdit}
                  style={{ flex: 1 }}
                >
                  {isSavingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMetalRates;
