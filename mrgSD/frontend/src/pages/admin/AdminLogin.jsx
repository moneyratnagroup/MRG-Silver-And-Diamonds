import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, KeyRound, Eye, EyeOff, ArrowRight, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { ADMIN_IDLE_TIMEOUT_MS, fetchWithAuth, isTokenExpired, logoutAdmin } from '../../utils/api';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();

  // If already logged in with a valid active session, redirect to admin
  useEffect(() => {
    const adminToken = localStorage.getItem('mrg_admin_token');
    if (adminToken) {
      const lastActivityStr = localStorage.getItem('mrg_admin_last_activity');
      const lastActivity = lastActivityStr ? parseInt(lastActivityStr, 10) : Date.now();
      const isIdle = !Number.isNaN(lastActivity) && Date.now() - lastActivity >= ADMIN_IDLE_TIMEOUT_MS;

      if (isTokenExpired(adminToken) || isIdle) {
        logoutAdmin();
      } else {
        navigate('/admin', { replace: true });
      }
    }
  }, [navigate]);

  // Stage: 'CREDENTIALS' | 'OTP'
  const [stage, setStage] = useState('CREDENTIALS');
  
  // Credentials Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // OTP Form State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [phoneMasked, setPhoneMasked] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  
  // Loading & Error States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const otpInputRefs = useRef([]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Step 1: Submit Username & Password
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetchWithAuth('/api/v1/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Invalid username or password.');
      }

      // Transition to OTP step
      setPhoneMasked(data.phone_masked || 'your registered number');
      setStage('OTP');
      setResendCooldown(30);
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Handle OTP input changes with auto-advance
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take single character
    setOtp(newOtp);

    // Auto move to next input if filled
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Move to previous input on Backspace if empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      otpInputRefs.current[5]?.focus();
    }
  };

  // Step 3: Verify OTP & Issue Token
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetchWithAuth('/api/v1/auth/admin/verify-otp', {
        method: 'POST',
        body: JSON.stringify({
          username: username.trim(),
          otp: fullOtp
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Invalid verification code.');
      }

      // Success: Save token & navigate to Admin dashboard
      if (data.access_token) {
        localStorage.setItem('mrg_admin_token', data.access_token);
        localStorage.setItem('mrg_admin_last_activity', String(Date.now()));
        navigate('/admin', { replace: true });
      } else {
        throw new Error('No authorization token received.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetchWithAuth('/api/v1/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to resend code.');
      }

      setResendCooldown(30);
      setOtp(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } catch (err) {
      setErrorMessage(err.message || 'Could not resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-badge">
            <ShieldCheck size={14} color="#C5A880" />
            <span>Moneyratna Security</span>
          </div>
          <h1 className="admin-login-title">Admin Portal</h1>
          <p className="admin-login-subtitle">
            {stage === 'CREDENTIALS' 
              ? 'Enter your credentials to access the management portal' 
              : 'Two-Factor Authentication required'}
          </p>
        </div>

        {errorMessage && (
          <div className="admin-login-error">
            <span>{errorMessage}</span>
          </div>
        )}

        {stage === 'CREDENTIALS' ? (
          /* STEP 1: USERNAME & PASSWORD */
          <form className="admin-login-form" onSubmit={handleCredentialsSubmit}>
            <div className="form-group-custom">
              <label htmlFor="admin-username">Username</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  id="admin-username"
                  type="text"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  autoFocus
                  required
                />
              </div>
            </div>

            <div className="form-group-custom">
              <label htmlFor="admin-password">Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-admin-submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="spinner-icon" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: SMS OTP VERIFICATION */
          <form className="admin-login-form" onSubmit={handleVerifyOtp}>
            <div className="otp-info" style={{ textAlign: 'center', marginBottom: '8px' }}>
              <p style={{ fontSize: '0.86rem', color: '#475569', margin: '0 0 4px 0' }}>
                We sent a 6-digit verification code to:
              </p>
              <strong style={{ fontSize: '0.92rem', color: '#1F2A44', letterSpacing: '0.04em' }}>
                {phoneMasked}
              </strong>
            </div>

            <div className="otp-container" onPaste={handleOtpPaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpInputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="otp-digit-input"
                  required
                />
              ))}
            </div>

            <div className="otp-meta-row">
              <span>Didn't receive the code?</span>
              <button
                type="button"
                className="btn-resend-otp"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || isLoading}
              >
                {resendCooldown > 0 ? (
                  `Resend in ${resendCooldown}s`
                ) : (
                  <>
                    <RefreshCw size={13} />
                    <span>Resend OTP</span>
                  </>
                )}
              </button>
            </div>

            <button 
              type="submit" 
              className="btn-admin-submit" 
              disabled={isLoading || otp.join('').length !== 6}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="spinner-icon" />
                  <span>Verifying code...</span>
                </>
              ) : (
                <>
                  <KeyRound size={18} />
                  <span>Verify & Access Admin</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="btn-back-login"
              onClick={() => {
                setStage('CREDENTIALS');
                setErrorMessage('');
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
