import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { ArrowLeft, Printer, Check, Eye, Download, Edit } from 'lucide-react';
import './AdminOrderDetails.css';

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus, updateOrderTracking, processRefund } = useShop();
  
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  
  // Tracking state
  const [courier, setCourier] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [shippingDate, setShippingDate] = useState('');
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [deliveredDate, setDeliveredDate] = useState('');

  useEffect(() => {
    const foundOrder = orders.find(o => o.id === id);
    if (foundOrder) {
      setOrder(foundOrder);
      setStatus(foundOrder.fulfillmentStatus);
      if (foundOrder.tracking) {
        setCourier(foundOrder.tracking.courier || '');
        setTrackingId(foundOrder.tracking.trackingId || '');
        setTrackingUrl(foundOrder.tracking.url || '');
        setShippingDate(foundOrder.tracking.shippingDate || '');
        setExpectedDelivery(foundOrder.tracking.expectedDelivery || '');
        setDeliveredDate(foundOrder.tracking.deliveredDate || '');
      }
    }
  }, [id, orders]);

  if (!order) {
    return (
      <div className="admin-order-details-container">
        <p>Loading order details...</p>
      </div>
    );
  }

  const handleStatusUpdate = (e) => {
    e.preventDefault();
    updateOrderStatus(order.id, status);
    alert(`Order ${order.id} status updated to ${status}`);
  };

  const handleSaveTracking = () => {
    updateOrderTracking(order.id, { 
      courier, 
      trackingId, 
      url: trackingUrl, 
      shippingDate, 
      expectedDelivery, 
      deliveredDate 
    });
    alert(`Tracking info saved for ${order.id}`);
  };

  const handleRefund = () => {
    if(window.confirm("Are you sure you want to cancel and refund this order? This cannot be undone.")) {
      processRefund(order.id);
      alert(`Order ${order.id} has been cancelled and marked as refunded.`);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const getTimelineSteps = () => {
    const isCancelled = order.fulfillmentStatus === 'Cancelled';
    const s = order.fulfillmentStatus;
    
    // Define logic for what steps are completed based on current status
    const statusValues = {
      'New': 1,
      'Processing': 2,
      'Packed': 3,
      'Shipped': 4,
      'Out for Delivery': 5,
      'Delivered': 6
    };
    
    const currentLevel = statusValues[s] || 0;
    
    return [
      { label: 'Order Placed', completed: true, current: false },
      { label: 'Payment Confirmed', completed: order.paymentStatus === 'Paid', current: false },
      { label: 'Processing', completed: currentLevel > 2, current: currentLevel === 2 },
      { label: 'Packed', completed: currentLevel > 3, current: currentLevel === 3 },
      { label: 'Shipped', completed: currentLevel > 4, current: currentLevel === 4 },
      { label: 'Out for Delivery', completed: currentLevel > 5, current: currentLevel === 5 },
      { label: 'Delivered', completed: currentLevel === 6, current: currentLevel === 6 }
    ];
  };

  return (
    <div className="admin-order-details-container">
      <div className="admin-page-header form-header order-header-row">
        <div>
          <button className="btn-back" onClick={() => navigate('/admin/orders')}>
            <ArrowLeft size={20} />
            Back to Orders
          </button>
          <h1 style={{ marginTop: '1rem', marginBottom: '0' }}>Order {order.id}</h1>
          <p style={{ color: '#888', marginTop: '0.25rem' }}>Placed on {formatDate(order.date)}</p>
          <div className="order-badges">
            <span className={`status-badge ${order.paymentStatus.toLowerCase()}`}>
              Payment: {order.paymentStatus}
            </span>
            <span className={`fulfillment-badge ${order.fulfillmentStatus.toLowerCase()}`}>
              Fulfillment: {order.fulfillmentStatus}
            </span>
          </div>
        </div>
        <div className="header-actions-group">
          <button className="btn-action-outline" onClick={() => window.print()}>
            <Eye size={16} />
            View Invoice
          </button>
          <button className="btn-action-outline" onClick={() => {
            alert("To download as PDF, simply click Print and choose 'Save as PDF' as your destination.");
            window.print();
          }}>
            <Download size={16} />
            Download PDF
          </button>
          <button className="btn-action-outline" onClick={() => window.print()}>
            <Printer size={16} />
            Print
          </button>
          <button className="btn-action-primary" onClick={() => document.getElementById('status-select').focus()}>
            <Edit size={16} />
            Update Status
          </button>
        </div>
      </div>

      <div className="order-grid">
        <div className="order-main-col">
          <details className="order-timeline-section" open>
            <summary><h3>Order Status Timeline</h3></summary>
            <div className="timeline-container">
              {order.fulfillmentStatus === 'Cancelled' ? (
                <div className="timeline-step">
                  <div className="timeline-icon cancelled">✕</div>
                  <div className="timeline-content cancelled">Order Cancelled</div>
                </div>
              ) : (
                getTimelineSteps().map((step, index) => (
                  <div key={index} className="timeline-step">
                    <div className={`timeline-icon ${step.completed ? 'completed' : step.current ? 'current' : ''}`}>
                      {step.completed ? <Check size={14} /> : (step.current ? '●' : '○')}
                    </div>
                    <div className={`timeline-content ${step.completed ? 'completed' : step.current ? 'current' : 'pending'}`}>
                      {step.label}
                    </div>
                  </div>
                ))
              )}
            </div>
          </details>

          <details className="order-section" open>
            <summary><h3>Items Ordered</h3></summary>
            <div className="order-items-list">
              {order.items.map(item => {
                const priceVal = parseFloat(item.price.replace(/[^\d.]/g, ''));
                const itemTotal = priceVal * item.quantity;
                return (
                  <div key={item.id} className="order-item">
                    <div className="item-img-container">
                      <img src={item.img} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <p className="item-name">{item.name}</p>
                      <div className="item-specs">
                        {item.sku && (
                          <div className="spec-item">
                            <span className="spec-label">SKU</span>
                            <span className="spec-value">{item.sku}</span>
                          </div>
                        )}
                        {item.metal && (
                          <div className="spec-item">
                            <span className="spec-label">Metal</span>
                            <span className="spec-value">{item.metal}</span>
                          </div>
                        )}
                        {item.purity && (
                          <div className="spec-item">
                            <span className="spec-label">Purity</span>
                            <span className="spec-value">{item.purity}</span>
                          </div>
                        )}
                        {item.weight && (
                          <div className="spec-item">
                            <span className="spec-label">Weight</span>
                            <span className="spec-value">{item.weight}</span>
                          </div>
                        )}
                        {item.size && (
                          <div className="spec-item">
                            <span className="spec-label">Size</span>
                            <span className="spec-value">{item.size}</span>
                          </div>
                        )}
                      </div>
                      <p className="item-price-qty">{item.price} × {item.quantity}</p>
                    </div>
                    <div className="item-total">
                      ₹{itemTotal.toLocaleString('en-IN')}
                    </div>
                  </div>
                );
              })}
            </div>
          </details>

          <details className="order-section" open>
            <summary><h3>Customer & Shipping Details</h3></summary>
            <div className="customer-info-grid">
              <div className="info-group">
                <label>Customer Name</label>
                <p>{order.customer.name}</p>
              </div>
              <div className="info-group">
                <label>Email Address</label>
                <p>{order.customer.email}</p>
              </div>
              <div className="info-group">
                <label>Phone Number</label>
                <p>{order.customer.phone}</p>
              </div>
              <div className="info-group">
                <label>Shipping Address</label>
                <p>{order.customer.address}</p>
              </div>
              {order.tracking && order.tracking.courier && (
                <>
                  <div className="info-group">
                    <label>Courier Partner</label>
                    <p>{order.tracking.courier}</p>
                  </div>
                  <div className="info-group">
                    <label>Tracking Number</label>
                    <p>
                      {order.tracking.url ? (
                        <a href={order.tracking.url} target="_blank" rel="noreferrer" style={{color: '#007bff'}}>
                          {order.tracking.trackingId}
                        </a>
                      ) : (
                        order.tracking.trackingId
                      )}
                    </p>
                  </div>
                  {order.tracking.shippingDate && (
                    <div className="info-group">
                      <label>Shipping Date</label>
                      <p>{order.tracking.shippingDate}</p>
                    </div>
                  )}
                  {order.tracking.expectedDelivery && (
                    <div className="info-group">
                      <label>Expected Delivery</label>
                      <p>{order.tracking.expectedDelivery}</p>
                    </div>
                  )}
                  {order.tracking.deliveredDate && (
                    <div className="info-group">
                      <label>Delivered Date</label>
                      <p>{order.tracking.deliveredDate}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </details>
        </div>

        <div className="order-side-col">
          <details className="order-section" open>
            <summary><h3>Order Summary</h3></summary>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.discount > 0 && (
              <div className="summary-row discount">
                <span>Discount</span>
                <span>-₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </details>

          <details className="order-section" open>
            <summary><h3>Update Fulfillment</h3></summary>
            {order.refundStatus === 'Refunded' ? (
              <div className="refunded-badge">This order has been cancelled and refunded.</div>
            ) : (
              <>
                <form onSubmit={handleStatusUpdate} className="update-status-form">
                  <label style={{ fontSize: '0.85rem', color: '#666' }}>Current Status: {order.fulfillmentStatus}</label>
                  <select id="status-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="New">New</option>
                    <option value="Processing">Processing</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <button type="submit" className="btn-update">Update Status</button>
                </form>

                {(status === 'Processing' || status === 'Shipped' || status === 'Delivered') && (
                  <div className="tracking-form">
                    <h4>Tracking Information</h4>
                    <div className="tracking-inputs" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <input 
                        type="text" 
                        placeholder="Courier Name (e.g. BlueDart)"
                        value={courier}
                        onChange={(e) => setCourier(e.target.value)}
                      />
                      <input 
                        type="text" 
                        placeholder="Tracking ID"
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                      />
                      <input 
                        type="url" 
                        placeholder="Tracking URL"
                        value={trackingUrl}
                        onChange={(e) => setTrackingUrl(e.target.value)}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: '#666', width: '100px' }}>Shipping Date:</span>
                        <input 
                          type="date" 
                          title="Shipping Date"
                          value={shippingDate}
                          onChange={(e) => setShippingDate(e.target.value)}
                          style={{ flex: 1 }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: '#666', width: '100px' }}>Expected Delivery:</span>
                        <input 
                          type="date" 
                          title="Expected Delivery Date"
                          value={expectedDelivery}
                          onChange={(e) => setExpectedDelivery(e.target.value)}
                          style={{ flex: 1 }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: '#666', width: '100px' }}>Delivered Date:</span>
                        <input 
                          type="date" 
                          title="Delivered Date"
                          value={deliveredDate}
                          onChange={(e) => setDeliveredDate(e.target.value)}
                          style={{ flex: 1 }}
                        />
                      </div>
                    </div>
                    <button type="button" className="btn-save-tracking" onClick={handleSaveTracking}>
                      Save Tracking
                    </button>
                  </div>
                )}

                {(order.paymentStatus === 'Paid' && order.fulfillmentStatus !== 'Delivered') && (
                  <div className="refund-section">
                    <button type="button" className="btn-refund" onClick={handleRefund}>
                      Cancel & Refund Order
                    </button>
                  </div>
                )}
              </>
            )}
          </details>
        </div>
      </div>

      {/* Printable Invoice (Hidden on Screen) */}
      <div className="printable-invoice">
        <div className="invoice-header">
          <div className="invoice-logo-section">
            <h2>MRG Silver & Diamonds</h2>
            <p>123 Diamond Avenue, Mumbai, Maharashtra 400001</p>
            <p>GSTIN: 27AAAAA0000A1Z5</p>
          </div>
          <div className="invoice-title">
            <h1>TAX INVOICE</h1>
            <p>Order #{order.id}</p>
            <p>Date: {formatDate(order.date)}</p>
          </div>
        </div>

        <div className="invoice-meta-row">
          <div className="invoice-bill-to">
            <h4>Billed To:</h4>
            <p><strong>{order.customer.name}</strong></p>
            <p>{order.customer.address}</p>
            <p>Phone: {order.customer.phone}</p>
            <p>Email: {order.customer.email}</p>
          </div>
          <div className="invoice-qr">
             <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=MRG-${order.id}`} alt="Order QR" />
          </div>
        </div>

        <table className="invoice-items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Details (Metal/Purity/Weight)</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(item => {
              const priceVal = parseFloat(item.price.replace(/[^\d.]/g, ''));
              return (
                <tr key={item.id}>
                  <td>
                    <strong>{item.name}</strong>
                    {item.sku && <div><small>SKU: {item.sku}</small></div>}
                  </td>
                  <td>
                    {item.metal && <span>{item.metal}</span>}
                    {item.purity && <span> | {item.purity}</span>}
                    {item.weight && <span> | {item.weight}</span>}
                  </td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                  <td>₹{(priceVal * item.quantity).toLocaleString('en-IN')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="invoice-totals">
          <div className="invoice-payment-method">
            <strong>Payment Method:</strong> {order.paymentMethod || order.paymentStatus}
          </div>
          <div className="invoice-summary">
            <div className="invoice-summary-row">
              <span>Subtotal:</span>
              <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.discount > 0 && (
              <div className="invoice-summary-row" style={{ color: '#e53e3e' }}>
                <span>Discount:</span>
                <span>-₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="invoice-summary-row invoice-grand-total">
              <span>Grand Total:</span>
              <span>₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="invoice-footer">
          <p>Thank you for shopping with MRG Silver & Diamonds!</p>
          <p>This is a computer-generated invoice and does not require a physical signature.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
