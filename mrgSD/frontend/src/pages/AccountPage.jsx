import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../utils/api';
import './AccountPage.css';

const AccountPage = () => {
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  
  // KYC Form State
  const [kycData, setKycData] = useState({ panNumber: '', aadharNumber: '' });
  const [kycErrors, setKycErrors] = useState({});
  const [isUpdatingKyc, setIsUpdatingKyc] = useState(false);
  const [kycSuccess, setKycSuccess] = useState(false);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ full_name: '', email: '', dob: '', gender: '', marital_status: '', anniversary_date: '' });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Addresses State
  const [addresses, setAddresses] = useState([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressData, setAddressData] = useState({
    title: 'Home', address_line_1: '', address_line_2: '', landmark: '', city: '', state: '', zip_code: ''
  });
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated and loading is complete
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      setKycData({
        panNumber: user.pan_number || '',
        aadharNumber: user.aadhar_number || ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name || '',
        email: user.email || '',
        dob: user.dob || '',
        gender: user.gender || '',
        marital_status: user.marital_status || '',
        anniversary_date: user.anniversary_date || ''
      });
    }
  }, [user]);

  const fetchAddresses = async () => {
    setIsLoadingAddresses(true);
    try {
      const res = await fetchWithAuth('/api/v1/auth/me/addresses');
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === 'addresses') {
      fetchAddresses();
    }
  }, [isAuthenticated, activeTab]);

if (isLoading || !user) {
    return (
      <div className="account-page-container d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
    setProfileSuccess(false);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const res = await fetchWithAuth('/api/v1/auth/me/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: profileData.full_name,
          email: profileData.email || null,
          dob: profileData.dob || null,
          gender: profileData.gender || null,
          marital_status: profileData.marital_status || null,
          anniversary_date: profileData.anniversary_date || null
        })
      });
      if (res.ok) {
        setProfileSuccess(true);
        if (refreshUser) refreshUser();
        setTimeout(() => setIsEditingProfile(false), 1500);
      } else {
        const errorData = await res.json();
        alert(errorData.detail || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Network error.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleAddressChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchWithAuth('/api/v1/auth/me/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData)
      });
      if (res.ok) {
        setIsAddingAddress(false);
        setAddressData({ title: 'Home', address_line_1: '', address_line_2: '', landmark: '', city: '', state: '', zip_code: '' });
        fetchAddresses();
      } else {
        alert("Failed to add address");
      }
    } catch (error) {
      console.error(error);
      alert("Network error.");
    }
  };

  const deleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetchWithAuth(`/api/v1/auth/me/addresses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAddresses();
      } else {
        alert("Failed to delete address");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleKycChange = (e) => {
    const { name, value } = e.target;
    if (kycErrors[name]) setKycErrors(prev => ({ ...prev, [name]: '' }));
    setKycSuccess(false);

    if (name === 'panNumber') {
      setKycData({ ...kycData, panNumber: value.toUpperCase() });
    } else if (name === 'aadharNumber') {
      setKycData({ ...kycData, aadharNumber: value.replace(/\D/g, '') });
    }
  };

  const validateKyc = () => {
    const errors = {};
    if (kycData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(kycData.panNumber)) {
      errors.panNumber = "Invalid PAN format (e.g. ABCDE1234F)";
    }
    if (kycData.aadharNumber && !/^\d{12}$/.test(kycData.aadharNumber)) {
      errors.aadharNumber = "Aadhar must be exactly 12 digits";
    }
    setKycErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleKycSubmit = async (e) => {
    e.preventDefault();
    if (!validateKyc()) return;
    
    setIsUpdatingKyc(true);
    try {
      const res = await fetchWithAuth('/api/v1/auth/me/kyc', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pan_number: kycData.panNumber || null,
          aadhar_number: kycData.aadharNumber || null
        })
      });
      if (res.ok) {
        setKycSuccess(true);
        if (refreshUser) refreshUser();
      } else {
        const errorData = await res.json();
        alert(errorData.detail || "Failed to update KYC");
      }
    } catch (error) {
      console.error("KYC update error:", error);
      alert("Network error. Please try again later.");
    } finally {
      setIsUpdatingKyc(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="account-content">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="m-0 border-0 p-0">Profile Details</h3>
              {!isEditingProfile ? (
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setIsEditingProfile(true)}>
                  <i className="bi bi-pencil me-1"></i> Edit
                </button>
              ) : (
                <button className="btn btn-outline-danger btn-sm" onClick={() => { setIsEditingProfile(false); setProfileData({ full_name: user.full_name || '', email: user.email || '', dob: user.dob || '', gender: user.gender || '', marital_status: user.marital_status || '', anniversary_date: user.anniversary_date || '' }); }}>
                  Cancel
                </button>
              )}
            </div>
            
            {isEditingProfile ? (
              <form onSubmit={handleProfileSubmit} className="mb-4 bg-light p-3 rounded border">
                <div className="form-group mb-3">
                  <label>Full Name</label>
                  <input type="text" name="full_name" value={profileData.full_name} onChange={handleProfileChange} className="form-control" required />
                </div>
                <div className="form-group mb-3">
                  <label>Email Address</label>
                  <input type="email" name="email" value={profileData.email} onChange={handleProfileChange} className="form-control" />
                </div>
                <div className="form-row mb-3 d-flex gap-3">
                  <div className="form-group flex-fill mb-0">
                    <label>Date of Birth</label>
                    <input type="date" name="dob" value={profileData.dob} onChange={handleProfileChange} className="form-control" />
                  </div>
                  <div className="form-group flex-fill mb-0">
                    <label>Gender</label>
                    <select name="gender" value={profileData.gender} onChange={handleProfileChange} className="form-control">
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
                <div className="form-row mb-3 d-flex gap-3">
                  <div className="form-group flex-fill mb-0">
                    <label>Marital Status</label>
                    <select name="marital_status" value={profileData.marital_status} onChange={handleProfileChange} className="form-control">
                      <option value="">Select...</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {profileData.marital_status === 'Married' && (
                    <div className="form-group flex-fill mb-0">
                      <label>Anniversary Date</label>
                      <input type="date" name="anniversary_date" value={profileData.anniversary_date} onChange={handleProfileChange} className="form-control" />
                    </div>
                  )}
                </div>
                <button type="submit" className="btn-primary btn-sm" disabled={isUpdatingProfile}>
                  {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                </button>
                {profileSuccess && <span className="ms-3 text-success">Saved successfully!</span>}
              </form>
            ) : (
              <div className="profile-details">
                <div className="profile-field">
                  <label>Full Name</label>
                  <p>{user.full_name || 'Not provided'}</p>
                </div>
                <div className="profile-field">
                  <label>Email Address</label>
                  <p>{user.email || 'Not provided'}</p>
                </div>
                <div className="profile-field">
                  <label>Date of Birth</label>
                  <p>{user.dob ? new Date(user.dob).toLocaleDateString() : 'Not provided'}</p>
                </div>
                <div className="profile-field">
                  <label>Gender</label>
                  <p>{user.gender || 'Not provided'}</p>
                </div>
                <div className="profile-field">
                  <label>Marital Status</label>
                  <p>{user.marital_status || 'Not provided'}</p>
                </div>
                {user.marital_status === 'Married' && (
                  <div className="profile-field">
                    <label>Anniversary Date</label>
                    <p>{user.anniversary_date ? new Date(user.anniversary_date).toLocaleDateString() : 'Not provided'}</p>
                  </div>
                )}
                <div className="profile-field">
                  <label>Phone Number</label>
                  <p>{user.phone_number}</p>
                </div>
                <div className="profile-field">
                  <label>Account Created</label>
                  <p>{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            )}

            <hr style={{margin: '30px 0', borderTop: '1px solid #eee'}}/>

            <h3>KYC Information</h3>
            <p style={{color: '#666', marginBottom: '20px', fontSize: '0.9rem'}}>
              Providing your PAN and Aadhar details speeds up your checkout process, especially for purchases over ₹2 Lakhs.
            </p>
            
            <form className="kyc-form" onSubmit={handleKycSubmit}>
              <div className="form-group">
                <label>PAN Card Number</label>
                <input 
                  type="text" 
                  name="panNumber"
                  value={kycData.panNumber}
                  onChange={handleKycChange}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  className={kycErrors.panNumber ? 'error-input' : ''}
                />
                {kycErrors.panNumber && <span className="error-text">{kycErrors.panNumber}</span>}
              </div>
              
              <div className="form-group">
                <label>Aadhar Card Number</label>
                <input 
                  type="text" 
                  name="aadharNumber"
                  value={kycData.aadharNumber}
                  onChange={handleKycChange}
                  placeholder="123456789012"
                  maxLength={12}
                  className={kycErrors.aadharNumber ? 'error-input' : ''}
                />
                {kycErrors.aadharNumber && <span className="error-text">{kycErrors.aadharNumber}</span>}
              </div>
              
              <button 
                type="submit" 
                className="btn-primary mt-2" 
                disabled={isUpdatingKyc}
              >
                {isUpdatingKyc ? 'Updating...' : 'Save KYC Details'}
              </button>
              
              {kycSuccess && <span style={{color: 'green', marginLeft: '15px', fontWeight: '500'}}>Saved successfully!</span>}
            </form>
          </div>
        );
      case 'orders':
        return (
          <div className="account-content">
            <h3>Order History</h3>
            <div className="coming-soon-placeholder">
              <i className="bi bi-box-seam"></i>
              <p>You haven't placed any orders yet.</p>
              <button className="btn-secondary mt-3" onClick={() => navigate('/products')}>Browse Products</button>
            </div>
          </div>
        );
      case 'addresses':
        return (
          <div className="account-content">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
              <h3 className="m-0 border-0 pb-0">Saved Addresses</h3>
              {!isAddingAddress && (
                <button className="btn-primary btn-sm px-3 py-2" onClick={() => setIsAddingAddress(true)}>
                  + Add New
                </button>
              )}
            </div>

            {isAddingAddress && (
              <form onSubmit={handleAddressSubmit} className="mb-4 bg-light p-4 rounded border">
                <h5 className="mb-3">Add New Address</h5>
                <div className="form-group mb-3">
                  <label>Title (e.g., Home, Office)</label>
                  <input type="text" name="title" value={addressData.title} onChange={handleAddressChange} className="form-control" required />
                </div>
                <div className="form-group mb-3">
                  <label>Address Line 1</label>
                  <input type="text" name="address_line_1" value={addressData.address_line_1} onChange={handleAddressChange} className="form-control" required />
                </div>
                <div className="form-row mb-3 d-flex gap-3">
                  <div className="form-group flex-fill mb-0">
                    <label>Address Line 2 (Optional)</label>
                    <input type="text" name="address_line_2" value={addressData.address_line_2} onChange={handleAddressChange} className="form-control" />
                  </div>
                  <div className="form-group flex-fill mb-0">
                    <label>Landmark (Optional)</label>
                    <input type="text" name="landmark" value={addressData.landmark} onChange={handleAddressChange} className="form-control" />
                  </div>
                </div>
                <div className="form-row mb-3 d-flex gap-3">
                  <div className="form-group flex-fill mb-0">
                    <label>City</label>
                    <input type="text" name="city" value={addressData.city} onChange={handleAddressChange} className="form-control" required />
                  </div>
                  <div className="form-group flex-fill mb-0">
                    <label>State</label>
                    <input type="text" name="state" value={addressData.state} onChange={handleAddressChange} className="form-control" required />
                  </div>
                  <div className="form-group flex-fill mb-0">
                    <label>Pincode</label>
                    <input type="text" name="zip_code" value={addressData.zip_code} onChange={handleAddressChange} className="form-control" required />
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn-primary btn-sm px-4">Save Address</button>
                  <button type="button" className="btn btn-outline-secondary btn-sm px-4" onClick={() => setIsAddingAddress(false)}>Cancel</button>
                </div>
              </form>
            )}

            {isLoadingAddresses ? (
              <p>Loading addresses...</p>
            ) : addresses.length > 0 ? (
              <div className="addresses-grid">
                {addresses.map(addr => (
                  <div key={addr.id} className="address-card">
                    <div className="address-header">
                      <span className="address-title">{addr.title}</span>
                      <button className="btn btn-sm text-danger border-0 p-0" onClick={() => deleteAddress(addr.id)}>
                        <i className="bi bi-trash"></i> Remove
                      </button>
                    </div>
                    <div className="address-body">
                      <p>{addr.address_line_1}</p>
                      {addr.address_line_2 && <p>{addr.address_line_2}</p>}
                      {addr.landmark && <p>Landmark: {addr.landmark}</p>}
                      <p>{addr.city}, {addr.state} {addr.zip_code}</p>
                      <p>{addr.country}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !isAddingAddress && (
                <div className="coming-soon-placeholder">
                  <i className="bi bi-geo-alt"></i>
                  <p>You haven't saved any addresses yet.</p>
                  <button className="btn-secondary mt-3" onClick={() => setIsAddingAddress(true)}>Add New Address</button>
                </div>
              )
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="account-page-container fade-in">
      <h1 className="account-page-title">My Account</h1>
      
      <div className="account-grid">
        <div className="account-sidebar">
          <div 
            className={`account-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="bi bi-person me-2"></i> Profile & KYC
          </div>
          <div 
            className={`account-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="bi bi-bag me-2"></i> Order History
          </div>
          <div 
            className={`account-tab ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            <i className="bi bi-geo-alt me-2"></i> Saved Addresses
          </div>
          <div 
            className="account-tab text-danger mt-4 border-top pt-3"
            onClick={() => {
              // We could dispatch logout here, but generally let them use navbar logout
              navigate('/');
            }}
          >
            <i className="bi bi-arrow-left-circle me-2"></i> Return to Shop
          </div>
        </div>
        
        <div className="account-content-wrapper">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
