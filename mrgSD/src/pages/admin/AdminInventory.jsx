import React, { useState, useMemo } from 'react';
import { useShop } from '../../context/ShopContext';
import './AdminInventory.css';

const AdminInventory = () => {
  const { products, updateInventory, inventoryMovements } = useShop();
  const [activeTab, setActiveTab] = useState('management'); // overview, management, history, reports

  // Adjust Stock Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustForm, setAdjustForm] = useState({
    type: 'add',
    quantity: '',
    reason: 'New Arrival',
    reference: '',
    notes: ''
  });

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStock, setFilterStock] = useState(''); // low, out, in

  // Calculations
  const totalSkus = products.length;
  const outOfStockCount = products.filter(p => p.stockQuantity === 0).length;
  const lowStockCount = products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold).length;
  
  const totalValue = products.reduce((acc, p) => {
    const price = parseFloat(p.price.replace(/[^\d.]/g, ''));
    return acc + (price * p.stockQuantity);
  }, 0);

  // Filtered Products for Management Table
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Search
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(searchLower) || (p.sku && p.sku.toLowerCase().includes(searchLower));
      
      // Category
      const matchesCategory = filterCategory ? p.category === filterCategory : true;
      
      // Stock Status
      let matchesStock = true;
      if (filterStock === 'out') matchesStock = p.stockQuantity === 0;
      else if (filterStock === 'low') matchesStock = p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold;
      else if (filterStock === 'in') matchesStock = p.stockQuantity > p.lowStockThreshold;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, filterCategory, filterStock]);

  const handleAdjustStock = (e) => {
    e.preventDefault();
    if (!selectedProduct || !adjustForm.quantity) return;
    
    updateInventory(selectedProduct.id, adjustForm);
    setIsModalOpen(false);
    setAdjustForm({ type: 'add', quantity: '', reason: 'New Arrival', reference: '', notes: '' });
  };

  const openAdjustModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="admin-inventory-container">
      <div className="inventory-header">
        <h1>Inventory Management</h1>
      </div>

      <div className="inventory-tabs">
        <button className={`inventory-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`inventory-tab ${activeTab === 'management' ? 'active' : ''}`} onClick={() => setActiveTab('management')}>Stock Management</button>
        <button className={`inventory-tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>Movement History</button>
        <button className={`inventory-tab ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>Reports</button>
      </div>

      {activeTab === 'overview' && (
        <div className="tab-content">
          <div className="inventory-stats-grid">
            <div className="inv-stat-card">
              <span className="inv-stat-title">Total SKUs</span>
              <span className="inv-stat-value">{totalSkus}</span>
            </div>
            <div className="inv-stat-card">
              <span className="inv-stat-title">Total Stock Value</span>
              <span className="inv-stat-value">₹{totalValue.toLocaleString('en-IN')}</span>
            </div>
            <div className={`inv-stat-card ${lowStockCount > 0 ? 'alert' : ''}`}>
              <span className="inv-stat-title">Low Stock Items</span>
              <span className="inv-stat-value">{lowStockCount}</span>
            </div>
            <div className={`inv-stat-card ${outOfStockCount > 0 ? 'alert' : ''}`}>
              <span className="inv-stat-title">Out of Stock</span>
              <span className="inv-stat-value">{outOfStockCount}</span>
            </div>
          </div>

          <h3>Recently Updated Products</h3>
          <div className="inventory-table-container">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {inventoryMovements.slice(0, 5).map(mov => (
                  <tr key={mov.id}>
                    <td>{new Date(mov.date).toLocaleDateString()}</td>
                    <td>{mov.productName}</td>
                    <td>
                      <span className={`stock-badge ${mov.type === 'add' ? 'stock-in' : 'stock-out'}`}>
                        {mov.type.toUpperCase()}
                      </span>
                    </td>
                    <td>{mov.quantity}</td>
                    <td>{mov.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'management' && (
        <div className="tab-content">
          <div className="inventory-filters">
            <div className="inv-filter-row">
              <input 
                type="text" 
                placeholder="Search by Product Name or SKU..." 
                className="inv-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select className="inv-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="">All Categories</option>
                <option value="Bracelets">Bracelets</option>
                <option value="Earrings">Earrings</option>
                <option value="Chains">Chains</option>
                <option value="Anklets">Anklets</option>
                <option value="Idols">Idols</option>
                <option value="Bullions">Bullions</option>
                <option value="Bridal">Bridal</option>
              </select>
              <select className="inv-select" value={filterStock} onChange={(e) => setFilterStock(e.target.value)}>
                <option value="">All Stock Status</option>
                <option value="in">In Stock</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="inventory-table-container">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Product & SKU</th>
                  <th>Specs</th>
                  <th>Stock Lvl</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => {
                  let status = 'In Stock';
                  let statusClass = 'stock-in';
                  if (p.stockQuantity === 0) {
                    status = 'Out of Stock';
                    statusClass = 'stock-out';
                  } else if (p.stockQuantity <= p.lowStockThreshold) {
                    status = 'Low Stock';
                    statusClass = 'stock-low';
                  }

                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="inv-prod-cell">
                          <img src={p.img} alt={p.name} className="inv-prod-img" />
                          <div className="inv-prod-info">
                            <h4>{p.name}</h4>
                            <p>{p.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: '#666' }}>
                          {p.metal} • {p.purity} • {p.weight}
                        </span>
                      </td>
                      <td style={{ fontWeight: '600' }}>{p.stockQuantity}</td>
                      <td>
                        <span className={`stock-badge ${statusClass}`}>{status}</span>
                      </td>
                      <td>
                        <button className="btn-adjust" onClick={() => openAdjustModal(p)}>
                          Adjust Stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No products found matching filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="tab-content">
          <div className="inventory-table-container">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Product</th>
                  <th>Adjustment</th>
                  <th>Reason</th>
                  <th>Reference</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {inventoryMovements.map(mov => (
                  <tr key={mov.id}>
                    <td>
                      <div>{new Date(mov.date).toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.75rem', color: '#888' }}>{new Date(mov.date).toLocaleTimeString()}</div>
                    </td>
                    <td>{mov.productName}</td>
                    <td>
                      <span className={`stock-badge ${mov.type === 'add' ? 'stock-in' : 'stock-out'}`}>
                        {mov.type === 'add' ? '+' : '-'}{mov.quantity}
                      </span>
                    </td>
                    <td>{mov.reason}</td>
                    <td>{mov.reference || '-'}</td>
                    <td style={{ maxWidth: '200px' }}>{mov.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="tab-content reports-grid">
          <div className="report-card">
            <h3>Low Stock Report</h3>
            {lowStockCount === 0 ? (
              <p>No low stock items.</p>
            ) : (
              <ul className="report-list">
                {products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold).map(p => (
                  <li key={p.id}>
                    <span>{p.name} ({p.sku})</span>
                    <span style={{ color: '#856404', fontWeight: '600' }}>{p.stockQuantity} left</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="report-card" style={{ borderColor: '#e53e3e' }}>
            <h3 style={{ color: '#e53e3e' }}>Out of Stock Report</h3>
            {outOfStockCount === 0 ? (
              <p>No out of stock items.</p>
            ) : (
              <ul className="report-list">
                {products.filter(p => p.stockQuantity === 0).map(p => (
                  <li key={p.id}>
                    <span>{p.name} ({p.sku})</span>
                    <span style={{ color: '#e53e3e', fontWeight: '600' }}>0</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="report-card">
            <h3>Inventory Value Summary</h3>
            <ul className="report-list">
              <li>
                <span>Total Items in Stock</span>
                <span>{products.reduce((acc, p) => acc + p.stockQuantity, 0)}</span>
              </li>
              <li>
                <span>Total Estimated Value</span>
                <span style={{ fontWeight: '700' }}>₹{totalValue.toLocaleString('en-IN')}</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {isModalOpen && selectedProduct && (
        <div className="inv-modal-overlay">
          <div className="inv-modal">
            <h2>Adjust Stock</h2>
            <p style={{ marginBottom: '1.5rem', color: '#666' }}>
              Product: <strong>{selectedProduct.name}</strong> ({selectedProduct.sku}) <br />
              Current Stock: {selectedProduct.stockQuantity}
            </p>
            
            <form onSubmit={handleAdjustStock} className="inv-modal-form">
              <div className="inv-form-group">
                <label>Adjustment Type</label>
                <select value={adjustForm.type} onChange={(e) => setAdjustForm({...adjustForm, type: e.target.value})}>
                  <option value="add">Add Stock (+)</option>
                  <option value="remove">Remove Stock (-)</option>
                </select>
              </div>
              
              <div className="inv-form-group">
                <label>Quantity</label>
                <input 
                  type="number" 
                  min="1" 
                  required
                  value={adjustForm.quantity}
                  onChange={(e) => setAdjustForm({...adjustForm, quantity: e.target.value})}
                  placeholder="Enter amount..."
                />
              </div>

              <div className="inv-form-group">
                <label>Reason</label>
                <select value={adjustForm.reason} onChange={(e) => setAdjustForm({...adjustForm, reason: e.target.value})}>
                  {adjustForm.type === 'add' ? (
                    <>
                      <option value="New Arrival">New Arrival / Restock</option>
                      <option value="Customer Return">Customer Return</option>
                      <option value="Found/Audit">Found during Audit</option>
                    </>
                  ) : (
                    <>
                      <option value="Sold Offline">Sold Offline</option>
                      <option value="Damaged">Damaged/Defective</option>
                      <option value="Lost/Audit">Lost during Audit</option>
                      <option value="Sent for Repair">Sent for Repair</option>
                    </>
                  )}
                </select>
              </div>

              <div className="inv-form-group">
                <label>Reference (Optional)</label>
                <input 
                  type="text" 
                  value={adjustForm.reference}
                  onChange={(e) => setAdjustForm({...adjustForm, reference: e.target.value})}
                  placeholder="e.g. PO Number, Invoice ID"
                />
              </div>

              <div className="inv-form-group full-width">
                <label>Notes (Optional)</label>
                <textarea 
                  rows="2"
                  value={adjustForm.notes}
                  onChange={(e) => setAdjustForm({...adjustForm, notes: e.target.value})}
                  placeholder="Additional context..."
                ></textarea>
              </div>

              <div className="inv-modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-confirm">Update Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
