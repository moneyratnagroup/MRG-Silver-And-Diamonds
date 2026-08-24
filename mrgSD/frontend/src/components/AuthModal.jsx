import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AuthModal = ({ isOpen, onClose }) => {
  const { login, authModalMessage } = useAuth();
  
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [verificationToken, setVerificationToken] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef(null);

  // Reset state when modal closes completely (so next open starts fresh)
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setStep(1);
        setPhoneNumber('');
        setOtp('');
        setFullName('');
        setEmail('');
        setVerificationToken(null);
        setError(null);
        setSuccessMsg(null);
        setLoading(false);
        setCountdown(0);
        if (timerRef.current) clearInterval(timerRef.current);
      }, 300); // Wait for exit animation
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle resend countdown
  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [countdown]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 429) {
          throw new Error(`Please wait ${data.retry_after || 24} seconds before requesting another OTP.`);
        }
        throw new Error(data.detail || 'Failed to send OTP. Please try again.');
      }
      
      setStep(2);
      setCountdown(30);
      
      // If triggered from resend button
      if (e && e.type === 'click') {
        setOtp('');
        setSuccessMsg('A new OTP has been sent.');
      }
    } catch (err) {
      setError(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber, code: otp })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'The OTP is incorrect. Please try again.');
      }
      
      if (data.is_new_user) {
        setVerificationToken(data.verification_token);
        setStep(3);
      } else {
        login(data.access_token, data.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const payload = {
        verification_token: verificationToken,
        full_name: fullName.trim()
      };
      if (email.trim()) {
        payload.email = email.trim().toLowerCase();
      }

      const res = await fetch(`${API_URL}/api/v1/auth/complete-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to complete profile. Please try again.');
      }
      
      login(data.access_token, data.user);
      onClose();
    } catch (err) {
      setError(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  const goBackToStep1 = () => {
    setStep(1);
    setOtp('');
    setError(null);
    setSuccessMsg(null);
    setVerificationToken(null);
    setCountdown(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };
  
  const goBackToStep2 = () => {
    setStep(2);
    setError(null);
    setSuccessMsg(null);
  };

  const renderStep1 = () => (
    <form onSubmit={handleSendOtp}>
      <h2 className="auth-title">{authModalMessage || "Welcome Back"}</h2>
      <p className="auth-subtitle">Sign in or create your account</p>
      
      {error && <div className="auth-error-msg">{error}</div>}

      <div className="auth-input-group">
        <label className="auth-input-label">Mobile Number</label>
        <div className="auth-input-wrapper">
          <div className="auth-country-code">
            <span className="auth-country-flag" role="img" aria-label="India Flag">🇮🇳</span>
            <span>+91</span>
          </div>
          <input 
            type="tel" 
            className="auth-input" 
            placeholder="Enter mobile number" 
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
            maxLength="10"
            required
            autoFocus
            disabled={loading}
          />
        </div>
      </div>

      <button 
        type="submit" 
        className="auth-submit-btn"
        disabled={phoneNumber.length !== 10 || loading}
      >
        {loading ? 'Sending OTP...' : 'Continue with OTP'}
      </button>

      <div className="auth-legal-text">
        By continuing, you agree to our <br />
        <a href="/terms" onClick={onClose}>Terms of Service</a> & <a href="/privacy" onClick={onClose}>Privacy Policy</a>
      </div>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={handleVerifyOtp}>
      <button type="button" className="auth-back-btn" onClick={goBackToStep1}>
        <ArrowLeft size={16} /> Change mobile number
      </button>
      
      <h2 className="auth-title">Verify Mobile</h2>
      <p className="auth-subtitle">We sent a 6-digit OTP to<br/><b>+91 {phoneNumber}</b></p>
      
      {error && <div className="auth-error-msg">{error}</div>}
      {successMsg && <div className="auth-error-msg" style={{backgroundColor: '#ecfdf5', color: '#059669', borderColor: '#34d399'}}>{successMsg}</div>}

      <div className="auth-input-group">
        <label className="auth-input-label">Enter OTP</label>
        <div className="auth-input-wrapper">
          <input 
            type="text" 
            className="auth-input auth-otp-input" 
            placeholder="• • • • • •" 
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            maxLength="6"
            required
            autoFocus
            disabled={loading}
          />
        </div>
      </div>

      <button 
        type="submit" 
        className="auth-submit-btn"
        disabled={otp.length !== 6 || loading}
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>
      
      <div className="auth-resend-container">
        {countdown > 0 ? (
          <span className="auth-resend-wait">Resend OTP in {countdown}s</span>
        ) : (
          <button type="button" className="auth-resend-btn" onClick={handleSendOtp} disabled={loading}>
            Didn't receive the OTP? Resend OTP
          </button>
        )}
      </div>
    </form>
  );

  const renderStep3 = () => (
    <form onSubmit={handleCompleteProfile}>
      <button type="button" className="auth-back-btn" onClick={goBackToStep2}>
        <ArrowLeft size={16} /> Back to verification
      </button>

      <h2 className="auth-title">Complete your profile</h2>
      <p className="auth-subtitle">You're almost done!</p>
      
      {error && <div className="auth-error-msg">{error}</div>}

      <div className="auth-input-group">
        <label className="auth-input-label">Full Name</label>
        <div className="auth-input-wrapper">
          <input 
            type="text" 
            className="auth-input" 
            placeholder="Enter your full name" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            maxLength="100"
            required
            autoFocus
            disabled={loading}
          />
        </div>
      </div>

      <div className="auth-input-group">
        <label className="auth-input-label">Email (Optional)</label>
        <div className="auth-input-wrapper">
          <input 
            type="email" 
            className="auth-input" 
            placeholder="Enter your email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength="255"
            disabled={loading}
          />
        </div>
      </div>

      <button 
        type="submit" 
        className="auth-submit-btn"
        disabled={fullName.trim().length === 0 || loading}
      >
        {loading ? 'Creating account...' : 'Complete Profile'}
      </button>
    </form>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="auth-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div 
            className="auth-modal-container"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <button className="auth-close-btn" onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>

            <img src="/mrgicon.png" alt="Moneyratna Logo" className="auth-brand-logo" />
            <div className="auth-brand-name">MONEYRATNA</div>
            <div className="auth-brand-tagline">SILVER AND DIAMONDS</div>

            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
