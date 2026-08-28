import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useShop(); // clearCart might not exist yet, we'll gracefully handle it
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'India'
  });

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const priceVal = parseFloat(item.price.replace(/[^\d.]/g, ''));
      return total + (priceVal * item.quantity);
    }, 0);
  };

  const total = calculateSubtotal();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.email || !formData.phone) {
      alert("Please fill in all required fields.");
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    // Dummy Razorpay Options (Frontend Only for UI Demonstration)
    const options = {
      key: 'rzp_test_dummy_key_do_not_use_in_prod', // Standard test key string (even invalid ones will open the modal in test mode, or throw a gentle warning in modal)
      amount: total * 100, // Amount in paise
      currency: 'INR',
      name: 'MRG Silver & Diamonds',
      description: 'Test Purchase Payment',
      image: '/mrgicon.png',
      handler: function (response) {
        alert('Payment Successful! Payment ID: ' + response.razorpay_payment_id);
        if(clearCart) clearCart();
        navigate('/');
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        color: '#02275a'
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on('payment.failed', function (response){
        alert("Payment Failed. Reason: " + response.error.description);
    });
    paymentObject.open();
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container empty">
        <h2>Your cart is empty</h2>
        <button className="btn-primary mt-3" onClick={() => navigate('/products')}>Return to Shop</button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="checkout-form-section">
          <h2>Billing & Shipping Details</h2>
          <form className="checkout-form" onSubmit={handlePayment}>
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Street Address *</label>
              <input type="text" name="address" value={formData.address} onChange={handleInputChange} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Town / City *</label>
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>State *</label>
                <input type="text" name="state" value={formData.state} onChange={handleInputChange} required />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Postcode / ZIP *</label>
                <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Country *</label>
                <input type="text" name="country" value={formData.country} onChange={handleInputChange} readOnly />
              </div>
            </div>
            
            <button type="submit" className="btn-primary w-100 mt-4 d-none d-md-block">Pay Now (₹{total.toLocaleString('en-IN')})</button>
          </form>
        </div>

        <div className="checkout-summary-section">
          <h2>Your Order</h2>
          <div className="checkout-items">
            {cartItems.map((item, idx) => (
              <div key={item.id || idx} className="checkout-item">
                <img src={item.img} alt={item.name} />
                <div className="checkout-item-details">
                  <h4>{item.name}</h4>
                  <p>Qty: {item.quantity}</p>
                </div>
                <div className="checkout-item-price">
                  ₹{(parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
          
          <div className="checkout-totals">
            <div className="totals-row">
              <span>Subtotal</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div className="totals-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="totals-row grand-total">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
          
          <div className="payment-method-info">
            <p><strong>Secure Online Payment</strong></p>
            <p className="small-text">Pay securely via UPI, Credit/Debit Card, or Netbanking using Razorpay.</p>
          </div>
          
          <button type="button" onClick={handlePayment} className="btn-primary w-100 mt-4 d-md-none">Pay Now (₹{total.toLocaleString('en-IN')})</button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
