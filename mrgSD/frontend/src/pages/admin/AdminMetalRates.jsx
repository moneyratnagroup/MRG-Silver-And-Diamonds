import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './AdminMetalRates.css';

const AdminMetalRates = () => {
  const { activeMetals, updateMetalRates, metalRateHistory, deleteMetalRatesHistory } = useShop();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('update');
  
  // dynamic inputs state: { metal_name: "₹rate" }
  const [inputs, setInputs] = useState({});
  const [isSaved, setIsSaved] = useState(false);

  // History Tab Filters
  const [metalFilter, setMetalFilter] = useState('all'); 
  const [timeframeFilter, setTimeframeFilter] = useState('weekly'); 
  const [showGraph, setShowGraph] = useState(false);

  useEffect(() => {
    // Initialize inputs from activeMetals when it loads or changes
    const initialInputs = {};
    if (activeMetals && activeMetals.length > 0) {
      activeMetals.forEach(metal => {
        if (!inputs[metal.metal_name]) {
           initialInputs[metal.metal_name] = `₹${metal.rate}`;
        }
      });
      if (Object.keys(initialInputs).length > 0) {
         setInputs(prev => ({ ...prev, ...initialInputs }));
      }
    }
  }, [activeMetals]);

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
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Color mapping for chart
  const colors = ["#FFD700", "#C0C0C0", "#CD7F32", "#4caf50", "#2196f3", "#9c27b0", "#ff9800"];
  const getColor = (index) => colors[index % colors.length];

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
          className={`admin-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Rate History
        </button>
      </div>

      <div className="admin-rates-card">
        {activeTab === 'update' && (
          <form onSubmit={handleSave}>
            {activeMetals && activeMetals.map(metal => (
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
          </form>
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

              <button type="button" className="toggle-graph-btn" onClick={() => setShowGraph(!showGraph)}>
                {showGraph ? 'Hide Graph' : 'Show Graph'}
              </button>
            </div>
            
            {showGraph && (
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(tick) => {
                        if (!tick) return '';
                        const parts = tick.split('-');
                        if (parts.length === 3) {
                          return `${parts[2]}-${parts[1]}`;
                        }
                        return tick;
                      }}
                    />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip 
                       formatter={(value) => [`₹${value}`, ""]}
                       labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Legend />
                    {activeMetals && activeMetals.map((metal, index) => {
                       if (metalFilter === 'all' || metalFilter === metal.metal_type.toLowerCase()) {
                          const name = metal.purity === 'Bullion' ? `${metal.metal_type} Bullion` : `${metal.purity} ${metal.metal_type}`;
                          return <Line key={metal.metal_name} type="monotone" dataKey={metal.metal_name} name={name} stroke={getColor(index)} dot={timeframeFilter === 'yearly' ? false : true} />;
                       }
                       return null;
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

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
    </div>
  );
};

export default AdminMetalRates;
