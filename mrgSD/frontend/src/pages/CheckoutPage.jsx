import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import './CheckoutPage.css';

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", 
  "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", 
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", 
  "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const CheckoutPage = () => {
  const { cartItems, clearCart } = useShop(); // clearCart might not exist yet, we'll gracefully handle it
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    addressLine1: '', addressLine2: '', landmark: '', city: '', state: '', zip: '', country: 'India',
    billingSameAsShipping: true,
    billingAddressLine1: '', billingAddressLine2: '', billingLandmark: '', billingCity: '', billingState: '', billingZip: '',
    saveAddress: false
  });
  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState({});

  const showWarning = (field, message) => {
    setWarnings(prev => ({ ...prev, [field]: message }));
    setTimeout(() => {
      setWarnings(prev => ({ ...prev, [field]: '' }));
    }, 3000);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const priceVal = parseFloat(item.price.replace(/[^\d.]/g, ''));
      return total + (priceVal * item.quantity);
    }, 0);
  };

  const total = calculateSubtotal();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }

    if (name === 'firstName' || name === 'lastName' || name === 'city' || name === 'billingCity') {
      if (/\d/.test(value)) {
        showWarning(name, "This field cannot contain numbers");
        const sanitized = value.replace(/\d/g, '');
        setFormData({ ...formData, [name]: sanitized });
        return;
      }
    }

    if (name === 'phone') {
      if (/[a-zA-Z]/.test(value)) {
        showWarning(name, "Phone number cannot include letters");
      }
      const sanitized = value.replace(/\D/g, '');
      if (sanitized.length > 10) return;
      if (sanitized.startsWith('0')) {
        showWarning(name, "Phone number cannot start with 0");
        return;
      }
      setFormData({ ...formData, [name]: sanitized });
      return;
    } 
    
    if (name === 'zip' || name === 'billingZip') {
      if (/[a-zA-Z]/.test(value)) {
        showWarning(name, "Pincode cannot include letters");
      }
      const sanitized = value.replace(/\D/g, '');
      if (sanitized.length > 6) return;
      setFormData({ ...formData, [name]: sanitized });
      return;
    }

    if (name === 'billingSameAsShipping' || name === 'saveAddress') {
      setFormData({ ...formData, [name]: e.target.checked });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    if (name === 'firstName' && !value.trim()) setErrors(prev => ({ ...prev, firstName: "First name is required" }));
    if (name === 'lastName' && !value.trim()) setErrors(prev => ({ ...prev, lastName: "Last name is required" }));
    
    if (name === 'addressLine1' && !value.trim()) setErrors(prev => ({ ...prev, addressLine1: "Address Line 1 is required" }));
    if (name === 'city' && !value.trim()) setErrors(prev => ({ ...prev, city: "City is required" }));
    if (name === 'state' && !value.trim()) setErrors(prev => ({ ...prev, state: "State is required" }));
    
    if (!formData.billingSameAsShipping) {
      if (name === 'billingAddressLine1' && !value.trim()) setErrors(prev => ({ ...prev, billingAddressLine1: "Billing Address Line 1 is required" }));
      if (name === 'billingCity' && !value.trim()) setErrors(prev => ({ ...prev, billingCity: "Billing City is required" }));
      if (name === 'billingState' && !value.trim()) setErrors(prev => ({ ...prev, billingState: "Billing State is required" }));
    }

    if (name === 'email') {
      if (!value.trim()) {
        setErrors(prev => ({ ...prev, email: "Email is required" }));
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setErrors(prev => ({ ...prev, email: "Invalid email format" }));
      }
    }
    
    if (name === 'phone') {
      if (!value) {
        setErrors(prev => ({ ...prev, phone: "Phone number is required" }));
      } else if (value.length !== 10) {
        setErrors(prev => ({ ...prev, phone: "Phone number must be exactly 10 digits" }));
      }
    }
    
    if (name === 'zip') {
      if (!value) {
        setErrors(prev => ({ ...prev, zip: "Pincode is required" }));
      } else if (value.length !== 6) {
        setErrors(prev => ({ ...prev, zip: "Pincode must be exactly 6 digits" }));
      }
    }

    if (name === 'billingZip' && !formData.billingSameAsShipping) {
      if (!value) {
        setErrors(prev => ({ ...prev, billingZip: "Pincode is required" }));
      } else if (value.length !== 6) {
        setErrors(prev => ({ ...prev, billingZip: "Pincode must be exactly 6 digits" }));
      }
    }
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Address Line 1 is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    
    if (!formData.zip) {
      newErrors.zip = "Pincode is required";
    } else if (formData.zip.length !== 6) {
      newErrors.zip = "Pincode must be exactly 6 digits";
    }

    if (!formData.billingSameAsShipping) {
      if (!formData.billingAddressLine1.trim()) newErrors.billingAddressLine1 = "Billing Address Line 1 is required";
      if (!formData.billingCity.trim()) newErrors.billingCity = "Billing City is required";
      if (!formData.billingState) newErrors.billingState = "Billing State is required";
      
      if (!formData.billingZip) {
        newErrors.billingZip = "Pincode is required";
      } else if (formData.billingZip.length !== 6) {
        newErrors.billingZip = "Pincode must be exactly 6 digits";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert("Please fix the errors in the form before proceeding.");
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
      notes: {
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        landmark: formData.landmark,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        billingSameAsShipping: formData.billingSameAsShipping ? 'Yes' : 'No',
        saveAddress: formData.saveAddress ? 'Yes' : 'No'
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
          <form className="checkout-form" onSubmit={handlePayment} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} onBlur={handleBlur} className={errors.firstName ? 'error-input' : ''} />
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                {warnings.firstName && !errors.firstName && <span className="warning-text">{warnings.firstName}</span>}
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} onBlur={handleBlur} className={errors.lastName ? 'error-input' : ''} />
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                {warnings.lastName && !errors.lastName && <span className="warning-text">{warnings.lastName}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} onBlur={handleBlur} className={errors.email ? 'error-input' : ''} />
                {errors.email && <span className="error-text">{errors.email}</span>}
                {warnings.email && !errors.email && <span className="warning-text">{warnings.email}</span>}
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} onBlur={handleBlur} className={errors.phone ? 'error-input' : ''} />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
                {warnings.phone && !errors.phone && <span className="warning-text">{warnings.phone}</span>}
              </div>
            </div>

            <h3 className="section-subtitle mt-4">DELIVERY ADDRESS</h3>
            <div className="form-group">
              <label>Address Line 1 *</label>
              <input type="text" name="addressLine1" placeholder="House / Flat No., Building Name, Street" value={formData.addressLine1} onChange={handleInputChange} onBlur={handleBlur} className={errors.addressLine1 ? 'error-input' : ''} maxLength={150} />
              {errors.addressLine1 && <span className="error-text">{errors.addressLine1}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Address Line 2</label>
                <input type="text" name="addressLine2" placeholder="Apartment, Area, Locality" value={formData.addressLine2} onChange={handleInputChange} maxLength={150} />
              </div>
              <div className="form-group">
                <label>Landmark</label>
                <input type="text" name="landmark" placeholder="Near XYZ Temple / School / Junction" value={formData.landmark} onChange={handleInputChange} maxLength={100} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Town / City *</label>
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} onBlur={handleBlur} className={errors.city ? 'error-input' : ''} />
                {errors.city && <span className="error-text">{errors.city}</span>}
                {warnings.city && !errors.city && <span className="warning-text">{warnings.city}</span>}
              </div>
              <div className="form-group">
                <label>State / Union Territory *</label>
                <select name="state" value={formData.state} onChange={handleInputChange} onBlur={handleBlur} className={errors.state ? 'error-input custom-select' : 'custom-select'}>
                  <option value="" disabled>Select State</option>
                  {INDIAN_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.state && <span className="error-text">{errors.state}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Postcode / ZIP *</label>
                <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} onBlur={handleBlur} className={errors.zip ? 'error-input' : ''} />
                {errors.zip && <span className="error-text">{errors.zip}</span>}
                {warnings.zip && !errors.zip && <span className="warning-text">{warnings.zip}</span>}
              </div>
              <div className="form-group">
                <label>Country</label>
                <input type="text" name="country" value={formData.country} readOnly />
              </div>
            </div>

            <div className="checkbox-group mt-3">
              <label className="checkbox-label">
                <input type="checkbox" name="billingSameAsShipping" checked={formData.billingSameAsShipping} onChange={handleInputChange} />
                <span className="checkmark"></span>
                Billing address is same as delivery address
              </label>
            </div>

            {!formData.billingSameAsShipping && (
              <div className="billing-address-section mt-4">
                <h3 className="section-subtitle">BILLING ADDRESS</h3>
                <div className="form-group">
                  <label>Address Line 1 *</label>
                  <input type="text" name="billingAddressLine1" placeholder="House / Flat No., Building Name, Street" value={formData.billingAddressLine1} onChange={handleInputChange} onBlur={handleBlur} className={errors.billingAddressLine1 ? 'error-input' : ''} maxLength={150} />
                  {errors.billingAddressLine1 && <span className="error-text">{errors.billingAddressLine1}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Address Line 2</label>
                    <input type="text" name="billingAddressLine2" placeholder="Apartment, Area, Locality" value={formData.billingAddressLine2} onChange={handleInputChange} maxLength={150} />
                  </div>
                  <div className="form-group">
                    <label>Landmark</label>
                    <input type="text" name="billingLandmark" placeholder="Near XYZ Temple / School / Junction" value={formData.billingLandmark} onChange={handleInputChange} maxLength={100} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Town / City *</label>
                    <input type="text" name="billingCity" value={formData.billingCity} onChange={handleInputChange} onBlur={handleBlur} className={errors.billingCity ? 'error-input' : ''} />
                    {errors.billingCity && <span className="error-text">{errors.billingCity}</span>}
                    {warnings.billingCity && !errors.billingCity && <span className="warning-text">{warnings.billingCity}</span>}
                  </div>
                  <div className="form-group">
                    <label>State / Union Territory *</label>
                    <select name="billingState" value={formData.billingState} onChange={handleInputChange} onBlur={handleBlur} className={errors.billingState ? 'error-input custom-select' : 'custom-select'}>
                      <option value="" disabled>Select State</option>
                      {INDIAN_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {errors.billingState && <span className="error-text">{errors.billingState}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Postcode / ZIP *</label>
                    <input type="text" name="billingZip" value={formData.billingZip} onChange={handleInputChange} onBlur={handleBlur} className={errors.billingZip ? 'error-input' : ''} />
                    {errors.billingZip && <span className="error-text">{errors.billingZip}</span>}
                    {warnings.billingZip && !errors.billingZip && <span className="warning-text">{warnings.billingZip}</span>}
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input type="text" value="India" readOnly />
                  </div>
                </div>
              </div>
            )}

            {isAuthenticated && (
              <div className="checkbox-group mt-3 mb-3">
                <label className="checkbox-label">
                  <input type="checkbox" name="saveAddress" checked={formData.saveAddress} onChange={handleInputChange} />
                  <span className="checkmark"></span>
                  Save this address for future orders
                </label>
              </div>
            )}
            
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
