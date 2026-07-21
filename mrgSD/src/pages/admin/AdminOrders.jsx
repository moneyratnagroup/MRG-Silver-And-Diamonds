import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Link } from 'react-router-dom';
import { Eye, Search } from 'lucide-react';
import './AdminOrders.css';

const AdminOrders = () => {
  const { orders } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Advanced Filters
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const getDeliveryStatus = (status) => {
    if (status === 'Delivered') return 'Delivered';
    if (status === 'Shipped') return 'In Transit';
    if (status === 'Cancelled') return 'Cancelled';
    return 'Pending Dispatch';
  };

  const isToday = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Stats Calculations
  const totalOrders = orders.length;
  const todaysOrders = orders.filter(o => isToday(o.date)).length;
  const processingCount = orders.filter(o => o.fulfillmentStatus === 'Processing').length;
  const shippedCount = orders.filter(o => o.fulfillmentStatus === 'Shipped').length;
  const deliveredCount = orders.filter(o => o.fulfillmentStatus === 'Delivered').length;
  const cancelledCount = orders.filter(o => o.fulfillmentStatus === 'Cancelled').length;
  const revenueToday = orders
    .filter(o => isToday(o.date) && o.paymentStatus !== 'Refunded') // Only count non-refunded
    .reduce((sum, o) => sum + o.total, 0);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || order.fulfillmentStatus === statusFilter;
    const matchesPaymentMethod = paymentMethodFilter === 'All' || order.paymentMethod === paymentMethodFilter;
    
    // Date Range
    let matchesDate = true;
    const orderDate = new Date(order.date);
    if (startDate) {
      matchesDate = matchesDate && orderDate >= new Date(startDate);
    }
    if (endDate) {
      // Set end date to end of day
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      matchesDate = matchesDate && orderDate <= end;
    }

    // Amount Range
    let matchesAmount = true;
    if (minAmount) {
      matchesAmount = matchesAmount && order.total >= Number(minAmount);
    }
    if (maxAmount) {
      matchesAmount = matchesAmount && order.total <= Number(maxAmount);
    }
    
    return matchesSearch && matchesStatus && matchesPaymentMethod && matchesDate && matchesAmount;
  });

  return (
    <div className="admin-orders-container">
      <div className="admin-page-header">
        <div className="header-actions">
          <div>
            <h1>Orders</h1>
            <p>Manage and fulfill customer orders.</p>
          </div>
        </div>
      </div>

      <div className="order-stats-grid">
        <div className="stat-card">
          <span className="stat-title">Total Orders</span>
          <h3 className="stat-value">{totalOrders}</h3>
        </div>
        <div className="stat-card">
          <span className="stat-title">Today's Orders</span>
          <h3 className="stat-value">{todaysOrders}</h3>
        </div>
        <div className="stat-card">
          <span className="stat-title">Processing</span>
          <h3 className="stat-value">{processingCount}</h3>
        </div>
        <div className="stat-card">
          <span className="stat-title">Shipped</span>
          <h3 className="stat-value">{shippedCount}</h3>
        </div>
        <div className="stat-card">
          <span className="stat-title">Delivered</span>
          <h3 className="stat-value">{deliveredCount}</h3>
        </div>
        <div className="stat-card">
          <span className="stat-title">Cancelled</span>
          <h3 className="stat-value">{cancelledCount}</h3>
        </div>
        <div className="stat-card" style={{ background: '#1a1a1a', color: 'white' }}>
          <span className="stat-title" style={{ color: '#ccc' }}>Revenue Today</span>
          <h3 className="stat-value" style={{ color: 'white' }}>₹{revenueToday.toLocaleString('en-IN')}</h3>
        </div>
      </div>

      <div className="orders-table-container">
        <div className="orders-filters">
          <div className="filters-top-row">
            <div className="search-bar">
              <Search size={18} color="#888" />
              <input 
                type="text" 
                placeholder="Search by Order ID, Customer Name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-tabs">
              {['All', 'New', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                <button 
                  key={status}
                  className={`filter-tab ${statusFilter === status ? 'active' : ''}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          
          <div className="advanced-filters-row">
            <div className="filter-group">
              <label>Payment Method</label>
              <select value={paymentMethodFilter} onChange={(e) => setPaymentMethodFilter(e.target.value)}>
                <option value="All">All Methods</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="COD">COD</option>
                <option value="Razorpay">Razorpay</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Date Range</label>
              <div className="filter-input-row">
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <span style={{color: '#888'}}>-</span>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>

            <div className="filter-group">
              <label>Amount Range (₹)</label>
              <div className="filter-input-row">
                <input type="number" placeholder="Min" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} style={{width: '90px'}} />
                <span style={{color: '#888'}}>-</span>
                <input type="number" placeholder="Max" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} style={{width: '90px'}} />
              </div>
            </div>
          </div>
        </div>

        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Order Status</th>
              <th>Delivery Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => {
              const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
              return (
                <tr key={order.id}>
                  <td>
                    <div className="order-id">{order.id}</div>
                  </td>
                  <td>
                    <div className="order-date" style={{ marginTop: 0 }}>{formatDate(order.date)}</div>
                  </td>
                  <td>
                    <div className="order-customer">
                      <span className="order-customer-name">{order.customer.name}</span>
                      <span className="order-customer-email">{order.customer.email}</span>
                    </div>
                  </td>
                  <td>{order.customer.phone}</td>
                  <td>{totalItems} item{totalItems !== 1 && 's'}</td>
                  <td style={{ fontWeight: '600' }}>
                    ₹{order.total.toLocaleString('en-IN')}
                  </td>
                  <td>
                    <span className={`status-badge ${order.paymentStatus.toLowerCase()}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`fulfillment-badge ${order.fulfillmentStatus.toLowerCase()}`}>
                      {order.fulfillmentStatus}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.9rem', color: '#555', fontWeight: '500' }}>
                      {getDeliveryStatus(order.fulfillmentStatus)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link to={`/admin/orders/${order.id}`} className="btn-view-order">
                      <Eye size={16} />
                      View Details
                    </Link>
                  </td>
                </tr>
              );
            })}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '3rem' }}>
                  No orders match your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
