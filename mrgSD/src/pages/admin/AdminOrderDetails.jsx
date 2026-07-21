import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { ArrowLeft, Printer } from 'lucide-react';
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

  useEffect(() => {
    const foundOrder = orders.find(o => o.id === id);
    if (foundOrder) {
      setOrder(foundOrder);
      setStatus(foundOrder.fulfillmentStatus);
      if (foundOrder.tracking) {
        setCourier(foundOrder.tracking.courier || '');
        setTrackingId(foundOrder.tracking.trackingId || '');
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
    updateOrderTracking(order.id, { courier, trackingId });
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
        <button className="btn-add-product" onClick={() => window.print()}>
          <Printer size={18} />
          Print Invoice
        </button>
      </div>

      <div className="order-grid">
        <div className="order-main-col">
          <div className="order-section">
            <h3>Items Ordered</h3>
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
          </div>

          <div className="order-section">
            <h3>Customer & Shipping Details</h3>
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
            </div>
          </div>
        </div>

        <div className="order-side-col">
          <div className="order-section">
            <h3>Order Summary</h3>
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
          </div>

          <div className="order-section">
            <h3>Update Fulfillment</h3>
            {order.refundStatus === 'Refunded' ? (
              <div className="refunded-badge">This order has been cancelled and refunded.</div>
            ) : (
              <>
                <form onSubmit={handleStatusUpdate} className="update-status-form">
                  <label style={{ fontSize: '0.85rem', color: '#666' }}>Current Status: {order.fulfillmentStatus}</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="New">New</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <button type="submit" className="btn-update">Update Status</button>
                </form>

                {(status === 'Processing' || status === 'Shipped' || status === 'Delivered') && (
                  <div className="tracking-form">
                    <h4>Tracking Information</h4>
                    <div className="tracking-inputs">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
