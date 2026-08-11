import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement OTP logic here
    console.log('Sending OTP to', phoneNumber);
  };

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

            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Sign in or create your account</p>

            <form onSubmit={handleSubmit}>
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
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="auth-submit-btn"
                disabled={phoneNumber.length !== 10}
              >
                Continue with OTP
              </button>
            </form>

            <div className="auth-legal-text">
              By continuing, you agree to our <br />
              <a href="/terms" onClick={onClose}>Terms of Service</a> & <a href="/privacy" onClick={onClose}>Privacy Policy</a>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
