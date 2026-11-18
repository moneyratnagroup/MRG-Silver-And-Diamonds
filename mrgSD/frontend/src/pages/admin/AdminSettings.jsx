import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  UserPlus, X, Shield, Users, Check, RefreshCw, KeyRound, 
  ShieldAlert, Eye, EyeOff, Edit2, Trash2, AlertTriangle 
} from 'lucide-react';
import { fetchWithAuth, logoutAdmin } from '../../utils/api';
import { useAdminAccess } from '../../context/AdminAccessContext';
import './AdminSettings.css';

const emptyStaff = { username: '', full_name: '', phone_number: '', password: '', permissions: [] };

async function request(path, options) {
  const response = await fetchWithAuth(`/api/v1/admin/settings${path}`, options);
  const data = await response.json();
  if (!response.ok) {
    let message = 'Please check the form fields and try again.';
    if (typeof data.detail === 'string') {
      message = data.detail;
    } else if (Array.isArray(data.detail)) {
      // Parse FastAPI 422 validation errors into exact user-friendly field messages
      const messages = data.detail.map(item => {
        const field = item.loc ? item.loc[item.loc.length - 1] : '';
        const fieldLabel = field ? field.replace(/_/g, ' ') : '';
        const capitalizedField = fieldLabel ? fieldLabel.charAt(0).toUpperCase() + fieldLabel.slice(1) : '';
        const cleanMsg = item.msg ? item.msg.replace(/^Value error,\s*/i, '') : '';
        return capitalizedField ? `${capitalizedField}: ${cleanMsg}` : cleanMsg;
      });
      message = messages.join(' | ');
    }
    throw new Error(message);
  }
  return data;
}

// Password criteria validator
const checkPasswordCriteria = (pwd) => {
  if (!pwd) {
    return {
      hasMinLen: false,
      hasUpper: false,
      hasDigit: false,
      hasSpecial: false,
      isValid: false
    };
  }
  const hasMinLen = pwd.length >= 8;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasDigit = /\d/.test(pwd);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>\-_=+/~`[\]\\;]/.test(pwd);
  return {
    hasMinLen,
    hasUpper,
    hasDigit,
    hasSpecial,
    isValid: hasMinLen && hasUpper && hasDigit && hasSpecial
  };
};

// Extracts up to 10 digits
const extract10DigitPhone = (val) => {
  if (!val) return '';
  const digits = val.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) {
    return digits.slice(2);
  }
  return digits.slice(0, 10);
};

// Validates 10-digit Indian mobile number rules (starts with 6-9, no all-zero or repetitive dummy digits)
const checkPhoneStatus = (phone) => {
  const digits = (phone || '').replace(/\D/g, '');
  if (!digits) {
    return { status: 'empty', message: 'Enter 10-digit mobile number' };
  }
  if (digits.length < 10) {
    if (digits.length > 0 && !/^[6-9]/.test(digits)) {
      return { status: 'invalid', message: 'Must start with 6, 7, 8, or 9' };
    }
    return { status: 'incomplete', message: `Enter 10-digit mobile number (${digits.length}/10)` };
  }
  if (!/^[6-9]/.test(digits)) {
    return { status: 'invalid', message: 'Mobile number must start with 6, 7, 8, or 9' };
  }
  if (new Set(digits).size <= 1) {
    return { status: 'invalid', message: 'Cannot consist of all zeroes or repetitive digits' };
  }
  if (/00000/.test(digits)) {
    return { status: 'invalid', message: 'Cannot contain excessive consecutive zeroes' };
  }
  return { status: 'valid', message: '✓ Valid 10-digit mobile number' };
};

// Live password checklist component
function PasswordChecklist({ criteria, showOnlyWhenTyping = false, value = '' }) {
  if (showOnlyWhenTyping && !value) return null;
  return (
    <div className="password-checklist">
      <span className="checklist-title">Password requirements:</span>
      <div className="checklist-grid">
        <span className={`checklist-item ${criteria.hasMinLen ? 'met' : ''}`}>
          <Check size={12} className="check-icon" /> At least 8 characters
        </span>
        <span className={`checklist-item ${criteria.hasUpper ? 'met' : ''}`}>
          <Check size={12} className="check-icon" /> One uppercase letter (A-Z)
        </span>
        <span className={`checklist-item ${criteria.hasDigit ? 'met' : ''}`}>
          <Check size={12} className="check-icon" /> One number (0-9)
        </span>
        <span className={`checklist-item ${criteria.hasSpecial ? 'met' : ''}`}>
          <Check size={12} className="check-icon" /> One special character (!@#$...)
        </span>
      </div>
    </div>
  );
}

export default function AdminSettings({ section = 'password' }) {
  const { account } = useAdminAccess();
  const [password, setPassword] = useState({ current_password: '', new_password: '', confirm: '' });

  // Password Visibility States
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Add User State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newStaff, setNewStaff] = useState(emptyStaff);

  // Existing Users & Module Permissions State
  const [modules, setModules] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [editStaff, setEditStaff] = useState(null);

  // Dedicated Modal States for Each User
  const [passwordModalUser, setPasswordModalUser] = useState(null);
  const [newPasswordForUser, setNewPasswordForUser] = useState('');
  const [showModalPassword, setShowModalPassword] = useState(false);

  const [deleteModalUser, setDeleteModalUser] = useState(null);

  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState('');

  const load = async () => {
    try {
      const data = await request('/staff');
      setAccounts(data.accounts);
      setModules(data.modules);
      setLoadError('');
    } catch (error) { 
      setLoadError(error.message); 
    }
  };

  useEffect(() => { 
    if (account.is_owner && section === 'permissions') {
      load(); 
    }
  }, [account.is_owner, section]);

  // Keep editStaff in sync if accounts update
  useEffect(() => {
    if (selectedUserId && accounts.length) {
      const current = accounts.find(a => a.id === selectedUserId);
      if (current) {
        setEditStaff(prev => ({
          ...current,
          password: prev?.password || ''
        }));
      }
    }
  }, [accounts, selectedUserId]);

  const changePassword = async (event) => {
    event.preventDefault();
    if (password.new_password !== password.confirm) return toast.error('New passwords do not match.');

    const pwdCheck = checkPasswordCriteria(password.new_password);
    if (!pwdCheck.isValid) {
      if (!pwdCheck.hasMinLen) return toast.error('Password must be at least 8 characters long.');
      if (!pwdCheck.hasUpper) return toast.error('Password must contain at least one uppercase letter (A-Z).');
      if (!pwdCheck.hasDigit) return toast.error('Password must contain at least one number (0-9).');
      if (!pwdCheck.hasSpecial) return toast.error('Password must contain at least one special character (!@#$%^&*...).');
    }

    setBusy(true);
    try {
      await request('/password', { method: 'POST', body: JSON.stringify(password) });
      logoutAdmin();
      window.location.replace('/admin/login');
    } catch (error) { 
      toast.error(error.message); 
    } finally { 
      setBusy(false); 
    }
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();

    // Client-side phone validation: strict 10-digit mobile number rules
    const phoneStatus = checkPhoneStatus(newStaff.phone_number);
    if (phoneStatus.status !== 'valid') {
      return toast.error(phoneStatus.message);
    }
    const phoneDigits = newStaff.phone_number.replace(/\D/g, '');

    // Client-side strong password validation: 8+ chars, upper, digit, special
    const pwdCheck = checkPasswordCriteria(newStaff.password);
    if (!pwdCheck.isValid) {
      if (!pwdCheck.hasMinLen) return toast.error('Password must be at least 8 characters long.');
      if (!pwdCheck.hasUpper) return toast.error('Password must contain at least one uppercase letter (A-Z).');
      if (!pwdCheck.hasDigit) return toast.error('Password must contain at least one number (0-9).');
      if (!pwdCheck.hasSpecial) return toast.error('Password must contain at least one special character (!@#$%^&*...).');
    }

    setBusy(true);
    try {
      const payload = {
        ...newStaff,
        phone_number: `+91${phoneDigits}`
      };
      await request('/staff', { method: 'POST', body: JSON.stringify(payload) });
      toast.success('Staff account created successfully.');
      setNewStaff(emptyStaff);
      setIsAddUserOpen(false);
      await load();
    } catch (error) { 
      toast.error(error.message); 
    } finally { 
      setBusy(false); 
    }
  };

  const handleSelectUser = (user) => {
    if (selectedUserId === user.id) {
      // Toggle off if already selected
      setSelectedUserId(null);
      setEditStaff(null);
    } else {
      setSelectedUserId(user.id);
      setEditStaff({ ...user, password: '' });
      // Smooth scroll to permissions section
      setTimeout(() => {
        const el = document.getElementById('module-permissions-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  const handleUpdatePermissions = async (event) => {
    event.preventDefault();
    if (!selectedUserId || !editStaff) return;

    // If password reset provided, validate strong password
    if (editStaff.password && editStaff.password.trim() !== '') {
      const pwdCheck = checkPasswordCriteria(editStaff.password);
      if (!pwdCheck.isValid) {
        if (!pwdCheck.hasMinLen) return toast.error('Reset password must be at least 8 characters long.');
        if (!pwdCheck.hasUpper) return toast.error('Reset password must include at least one uppercase letter (A-Z).');
        if (!pwdCheck.hasDigit) return toast.error('Reset password must include at least one number (0-9).');
        if (!pwdCheck.hasSpecial) return toast.error('Reset password must include at least one special character (!@#$%^&*...).');
      }
    }

    setBusy(true);
    try {
      const body = {
        permissions: editStaff.permissions,
        is_active: editStaff.is_active,
        ...(editStaff.password && editStaff.password.trim() ? { new_password: editStaff.password } : {})
      };
      await request(`/staff/${selectedUserId}`, { method: 'PATCH', body: JSON.stringify(body) });
      toast.success('Staff access permissions updated.');
      await load();
    } catch (error) { 
      toast.error(error.message); 
    } finally { 
      setBusy(false); 
    }
  };

  // Dedicated Password Change for Selected User
  const handleOpenChangePasswordModal = (user) => {
    setPasswordModalUser(user);
    setNewPasswordForUser('');
    setShowModalPassword(false);
  };

  const handleSubmitChangePasswordModal = async (e) => {
    e.preventDefault();
    if (!passwordModalUser) return;

    const pwdCheck = checkPasswordCriteria(newPasswordForUser);
    if (!pwdCheck.isValid) {
      if (!pwdCheck.hasMinLen) return toast.error('New password must be at least 8 characters long.');
      if (!pwdCheck.hasUpper) return toast.error('New password must include at least one uppercase letter (A-Z).');
      if (!pwdCheck.hasDigit) return toast.error('New password must include at least one number (0-9).');
      if (!pwdCheck.hasSpecial) return toast.error('New password must include at least one special character (!@#$%^&*...).');
    }

    setBusy(true);
    try {
      await request(`/staff/${passwordModalUser.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ new_password: newPasswordForUser })
      });
      toast.success(`Password updated for ${passwordModalUser.full_name}. Existing sessions have been signed out.`);
      setPasswordModalUser(null);
      setNewPasswordForUser('');
      await load();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  // Dedicated Delete User Modal Handlers
  const handleOpenDeleteModal = (user) => {
    setDeleteModalUser(user);
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalUser) return;
    setBusy(true);
    try {
      await request(`/staff/${deleteModalUser.id}`, { method: 'DELETE' });
      toast.success(`Staff account for ${deleteModalUser.full_name} deleted successfully.`);
      if (selectedUserId === deleteModalUser.id) {
        setSelectedUserId(null);
        setEditStaff(null);
      }
      setDeleteModalUser(null);
      await load();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  const handleSelectAllPermissions = (isAdd = false) => {
    const allKeys = Object.keys(modules);
    if (isAdd) {
      setNewStaff({ ...newStaff, permissions: allKeys });
    } else if (editStaff) {
      setEditStaff({ ...editStaff, permissions: allKeys });
    }
  };

  const handleClearAllPermissions = (isAdd = false) => {
    if (isAdd) {
      setNewStaff({ ...newStaff, permissions: [] });
    } else if (editStaff) {
      setEditStaff({ ...editStaff, permissions: [] });
    }
  };

  if (section === 'permissions' && !account.is_owner) {
    return <Navigate to="/admin/settings/password" replace />;
  }

  const newUserPasswordCriteria = checkPasswordCriteria(newStaff.password);
  const resetPasswordCriteria = checkPasswordCriteria(editStaff?.password || '');
  const changePasswordCriteria = checkPasswordCriteria(password.new_password);
  const modalPasswordCriteria = checkPasswordCriteria(newPasswordForUser);
  const newPhoneStatus = checkPhoneStatus(newStaff.phone_number);

  return (
    <div className="admin-settings-page">
      {/* 1. Page Header with Title & Add User Action */}
      <div className={`settings-header-row ${section === 'password' ? 'settings-header-centered' : ''}`}>
        <div>
          <h1 className="settings-page-title">
            {section === 'password' ? 'Change Password' : 'User Role and Permissions'}
          </h1>
          <p className="settings-page-subtitle">
            {section === 'password'
              ? 'Update your administrator account password.'
              : 'Manage admin staff accounts and assign module-level view and edit permissions.'}
          </p>
        </div>

        {section === 'permissions' && account.is_owner && (
          <button
            type="button"
            className={`btn-add-user-trigger ${isAddUserOpen ? 'active' : ''}`}
            onClick={() => {
              setIsAddUserOpen(!isAddUserOpen);
              if (!isAddUserOpen) setNewStaff(emptyStaff);
            }}
          >
            {isAddUserOpen ? (
              <>
                <X size={16} />
                <span>Close Form</span>
              </>
            ) : (
              <>
                <UserPlus size={16} />
                <span>Add User</span>
              </>
            )}
          </button>
        )}
      </div>

      {loadError && (
        <div className="settings-error-banner">
          <span>{loadError}</span>
          <button type="button" onClick={load}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* SECTION: Password Change */}
      {section === 'password' && (
        <section className="settings-panel password-change-panel">
          <h2>Change password</h2>
          <p>Must be at least 8 characters with uppercase letters, numbers, and special characters. Changing your password signs out all active sessions.</p>
          <form onSubmit={changePassword} className="password-change-form">
            <label>
              <span>Current password</span>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password.current_password}
                onChange={e => setPassword({ ...password, current_password: e.target.value })}
              />
            </label>
            <label>
              <span>New password (min 8 chars, uppercase, number & symbol)</span>
              <div className="password-input-wrapper">
                <input
                  type={showChangePassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={128}
                  value={password.new_password}
                  onChange={e => setPassword({ ...password, new_password: e.target.value })}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  tabIndex={-1}
                  title={showChangePassword ? 'Hide password' : 'Show password'}
                  aria-label="Toggle password visibility"
                >
                  {showChangePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            <PasswordChecklist criteria={changePasswordCriteria} showOnlyWhenTyping={true} value={password.new_password} />
            <label>
              <span>Confirm new password</span>
              <input
                type="password"
                autoComplete="new-password"
                required
                value={password.confirm}
                onChange={e => setPassword({ ...password, confirm: e.target.value })}
              />
            </label>
            <button className="btn-primary" disabled={busy}>
              {busy ? 'Changing...' : 'Change password'}
            </button>
          </form>
        </section>
      )}

      {/* SECTION: User Roles & Permissions */}
      {section === 'permissions' && account.is_owner && (
        <>
          {/* Conditional Add User Form Panel */}
          {isAddUserOpen && (
            <section className="settings-panel add-user-panel animate-fade-down">
              <div className="panel-header-with-action">
                <div>
                  <h2 className="panel-title">Add New Admin User</h2>
                  <p className="panel-description">
                    Staff sign in with their own username, password and an OTP sent to their phone. Select the modules they may view and manage.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-close-panel"
                  onClick={() => setIsAddUserOpen(false)}
                  title="Close form"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="add-user-form">
                <div className="form-grid-two-col">
                  <label>
                    <span>Full name <strong className="required-star">*</strong></span>
                    <input
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={newStaff.full_name}
                      maxLength={100}
                      onChange={e => setNewStaff({ ...newStaff, full_name: e.target.value })}
                    />
                  </label>
                  <label>
                    <span>Username <strong className="required-star">*</strong></span>
                    <input
                      required
                      pattern="[a-zA-Z0-9_.\-]+"
                      minLength={3}
                      maxLength={100}
                      autoComplete="off"
                      placeholder="e.g. rahul_mrg"
                      value={newStaff.username}
                      onChange={e => setNewStaff({ ...newStaff, username: e.target.value })}
                    />
                  </label>
                </div>

                <div className="form-grid-two-col">
                  <label>
                    <span>Phone number (10 digits) <strong className="required-star">*</strong></span>
                    <div className={`phone-input-group ${newPhoneStatus.status === 'invalid' ? 'input-error' : ''}`}>
                      <span className="phone-prefix">+91</span>
                      <input
                        type="tel"
                        required
                        placeholder="9876543210"
                        maxLength={10}
                        pattern="[6-9][0-9]{9}"
                        value={newStaff.phone_number}
                        onChange={e => {
                          const clean = extract10DigitPhone(e.target.value);
                          setNewStaff({ ...newStaff, phone_number: clean });
                        }}
                      />
                    </div>
                    <small className="field-hint">
                      <span className={
                        newPhoneStatus.status === 'valid'
                          ? 'hint-valid'
                          : newPhoneStatus.status === 'invalid'
                          ? 'hint-invalid'
                          : ''
                      }>
                        {newPhoneStatus.message}
                      </span>
                    </small>
                  </label>

                  <label>
                    <span>Password <strong className="required-star">*</strong></span>
                    <div className="password-input-wrapper">
                      <input
                        type={showNewUserPassword ? 'text' : 'password'}
                        name="staff_account_secret"
                        required
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        data-lpignore="true"
                        data-1p-ignore="true"
                        data-form-type="other"
                        minLength={8}
                        maxLength={128}
                        placeholder="At least 8 chars with uppercase, digit & symbol"
                        value={newStaff.password}
                        onChange={e => setNewStaff({ ...newStaff, password: e.target.value })}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowNewUserPassword(!showNewUserPassword)}
                        tabIndex={-1}
                        title={showNewUserPassword ? 'Hide password' : 'Show password'}
                        aria-label="Toggle password visibility"
                      >
                        {showNewUserPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <PasswordChecklist criteria={newUserPasswordCriteria} />
                  </label>
                </div>

                <fieldset className="permissions-fieldset">
                  <div className="fieldset-header">
                    <legend>Module Permissions</legend>
                    <div className="permission-quick-actions">
                      <button
                        type="button"
                        className="btn-text-link"
                        onClick={() => handleSelectAllPermissions(true)}
                      >
                        Select All
                      </button>
                      <span className="dot-sep">·</span>
                      <button
                        type="button"
                        className="btn-text-link"
                        onClick={() => handleClearAllPermissions(true)}
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  <div className="settings-permissions-grid">
                    {Object.entries(modules).map(([key, label]) => {
                      const isChecked = newStaff.permissions.includes(key);
                      return (
                        <label
                          key={key}
                          className={`permission-checkbox-card ${isChecked ? 'checked' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={e =>
                              setNewStaff({
                                ...newStaff,
                                permissions: e.target.checked
                                  ? [...newStaff.permissions, key]
                                  : newStaff.permissions.filter(p => p !== key)
                              })
                            }
                          />
                          <span className="permission-label-text">{label}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="settings-actions">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={busy || !Object.keys(modules).length}
                  >
                    {busy ? 'Saving...' : 'Create Admin User'}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    disabled={busy}
                    onClick={() => {
                      setIsAddUserOpen(false);
                      setNewStaff(emptyStaff);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* SECTION: Existing Users List (Always displayed below header action area) */}
          <section className="settings-panel existing-users-panel">
            <div className="panel-header-with-action">
              <div>
                <h2 className="panel-title">
                  Existing Admin Users <span className="count-pill">{accounts.length}</span>
                </h2>
                <p className="panel-description">
                  Manage administrator accounts. Use the options next to each user to edit module permissions, change their password, or remove their access.
                </p>
              </div>
            </div>

            <div className="settings-account-grid">
              {accounts.map(a => {
                const isSelected = selectedUserId === a.id;
                const userInitial = (a.full_name || a.username || 'U').charAt(0).toUpperCase();

                return (
                  <div
                    key={a.id}
                    className={`settings-account-card ${isSelected ? 'selected' : ''} ${a.is_owner ? 'owner-card' : ''}`}
                    onClick={() => handleSelectUser(a)}
                  >
                    <div className="account-card-left">
                      <div className="account-avatar">
                        {userInitial}
                      </div>
                      <div className="account-info">
                        <div className="account-name-row">
                          <strong className="account-name">{a.full_name}</strong>
                          {a.is_owner ? (
                            <span className="badge badge-owner">Owner</span>
                          ) : a.is_active ? (
                            <span className="badge badge-active">Active</span>
                          ) : (
                            <span className="badge badge-inactive">Inactive</span>
                          )}
                        </div>
                        <p className="account-meta">
                          @{a.username} · {a.phone_number}
                        </p>
                        <div className="account-permissions-summary">
                          {a.is_owner ? (
                            <span className="permissions-summary-text owner-text">
                              <Shield size={13} /> Full Access (All Modules)
                            </span>
                          ) : (
                            <span className="permissions-summary-text">
                              <Users size={13} />{' '}
                              {a.permissions?.length > 0
                                ? `${a.permissions.length} module(s) assigned`
                                : 'No modules assigned'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="account-card-right">
                      {a.is_owner ? (
                        <span className="badge-all-access">Owner · Master Access</span>
                      ) : (
                        <div className="account-actions-group" onClick={e => e.stopPropagation()}>
                          <button
                            type="button"
                            className={`btn-user-action btn-action-edit ${isSelected ? 'active' : ''}`}
                            onClick={() => handleSelectUser(a)}
                            title="Edit permissions & access"
                          >
                            <Edit2 size={13} />
                            <span>{isSelected ? 'Editing' : 'Edit'}</span>
                          </button>

                          <button
                            type="button"
                            className="btn-user-action btn-action-password"
                            onClick={() => handleOpenChangePasswordModal(a)}
                            title="Change password for this user"
                          >
                            <KeyRound size={13} />
                            <span>Change Password</span>
                          </button>

                          <button
                            type="button"
                            className="btn-user-action btn-action-delete"
                            onClick={() => handleOpenDeleteModal(a)}
                            title="Delete this staff account"
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION: Module Permissions for Selected User (Displayed ONLY when a user is selected) */}
          {selectedUserId && editStaff && (
            <section className="settings-panel permissions-edit-panel animate-fade-down" id="module-permissions-section">
              <div className="panel-header-with-action">
                <div>
                  <div className="selected-user-heading-tag">
                    <Shield size={16} /> Selected User Access Control
                  </div>
                  <h2 className="panel-title">
                    Module Permissions: {editStaff.full_name} <span className="username-sub">(@{editStaff.username})</span>
                  </h2>
                  <p className="panel-description">
                    {editStaff.is_owner
                      ? 'The main administrator account holds master privileges and automatically retains full access to all system modules.'
                      : 'Select or deselect the modules this staff member is authorized to access and manage.'}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-close-panel"
                  onClick={() => {
                    setSelectedUserId(null);
                    setEditStaff(null);
                  }}
                  title="Close module permissions"
                >
                  <X size={18} />
                </button>
              </div>

              {editStaff.is_owner ? (
                <div className="owner-all-access-alert">
                  <ShieldAlert size={20} />
                  <div>
                    <strong>Master Privileges Active</strong>
                    <p>
                      Main administrator access cannot be restricted. This account has unrestricted permission across all modules, rate management, and admin user administration.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUpdatePermissions} className="edit-permissions-form">
                  <fieldset className="permissions-fieldset">
                    <div className="fieldset-header">
                      <legend>Assigned Module Permissions</legend>
                      <div className="permission-quick-actions">
                        <button
                          type="button"
                          className="btn-text-link"
                          onClick={() => handleSelectAllPermissions(false)}
                        >
                          Select All
                        </button>
                        <span className="dot-sep">·</span>
                        <button
                          type="button"
                          className="btn-text-link"
                          onClick={() => handleClearAllPermissions(false)}
                        >
                          Clear All
                        </button>
                      </div>
                    </div>

                    <div className="settings-permissions-grid">
                      {Object.entries(modules).map(([key, label]) => {
                        const isChecked = editStaff.permissions?.includes(key);
                        return (
                          <label
                            key={key}
                            className={`permission-checkbox-card ${isChecked ? 'checked' : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={e =>
                                setEditStaff({
                                  ...editStaff,
                                  permissions: e.target.checked
                                    ? [...(editStaff.permissions || []), key]
                                    : (editStaff.permissions || []).filter(p => p !== key)
                                })
                              }
                            />
                            <span className="permission-label-text">{label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div className="form-grid-two-col status-password-row">
                    <div className="account-status-toggle-card">
                      <label className="settings-checkbox-inline">
                        <input
                          type="checkbox"
                          checked={editStaff.is_active}
                          onChange={e => setEditStaff({ ...editStaff, is_active: e.target.checked })}
                        />
                        <div>
                          <strong>Account Active</strong>
                          <p>Allow this staff member to sign in and access the admin dashboard.</p>
                        </div>
                      </label>
                    </div>

                    <div className="password-reset-wrapper">
                      <label>
                        <span className="input-label-with-icon">
                          <KeyRound size={14} /> Quick Reset Password (optional)
                        </span>
                        <div className="password-input-wrapper">
                          <input
                            type={showResetPassword ? 'text' : 'password'}
                            name="staff_reset_secret"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            data-lpignore="true"
                            data-1p-ignore="true"
                            data-form-type="other"
                            minLength={8}
                            maxLength={128}
                            placeholder="Leave blank to keep current password"
                            value={editStaff.password || ''}
                            onChange={e => setEditStaff({ ...editStaff, password: e.target.value })}
                          />
                          <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowResetPassword(!showResetPassword)}
                            tabIndex={-1}
                            title={showResetPassword ? 'Hide password' : 'Show password'}
                            aria-label="Toggle password visibility"
                          >
                            {showResetPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </label>
                      <PasswordChecklist criteria={resetPasswordCriteria} showOnlyWhenTyping={true} value={editStaff.password} />
                    </div>
                  </div>

                  <div className="settings-actions">
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={busy}
                    >
                      {busy ? 'Saving...' : 'Save Module Permissions'}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      disabled={busy}
                      onClick={() => {
                        setSelectedUserId(null);
                        setEditStaff(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </section>
          )}

          {/* MODAL 1: Dedicated Change Password Modal */}
          {passwordModalUser && (
            <div className="settings-modal-backdrop animate-fade-in" onClick={() => setPasswordModalUser(null)}>
              <div className="settings-modal-card animate-scale-up" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <div>
                    <h3 className="modal-title">Change Password</h3>
                    <p className="modal-subtitle">
                      Set a new password for <strong>{passwordModalUser.full_name}</strong> (@{passwordModalUser.username})
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-close-modal"
                    onClick={() => setPasswordModalUser(null)}
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSubmitChangePasswordModal}>
                  <label>
                    <span>New Password <strong className="required-star">*</strong></span>
                    <div className="password-input-wrapper">
                      <input
                        type={showModalPassword ? 'text' : 'password'}
                        name="modal_new_password"
                        required
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        data-lpignore="true"
                        data-1p-ignore="true"
                        data-form-type="other"
                        minLength={8}
                        maxLength={128}
                        placeholder="At least 8 chars with uppercase, digit & symbol"
                        value={newPasswordForUser}
                        onChange={e => setNewPasswordForUser(e.target.value)}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowModalPassword(!showModalPassword)}
                        tabIndex={-1}
                        title={showModalPassword ? 'Hide password' : 'Show password'}
                        aria-label="Toggle password visibility"
                      >
                        {showModalPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <PasswordChecklist criteria={modalPasswordCriteria} />
                  </label>

                  <div className="modal-actions">
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={busy || !modalPasswordCriteria.isValid}
                    >
                      {busy ? 'Updating...' : 'Update Password'}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      disabled={busy}
                      onClick={() => setPasswordModalUser(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL 2: Delete Staff User Confirmation Modal */}
          {deleteModalUser && (
            <div className="settings-modal-backdrop animate-fade-in" onClick={() => setDeleteModalUser(null)}>
              <div className="settings-modal-card delete-modal-card animate-scale-up" onClick={e => e.stopPropagation()}>
                <div className="modal-icon-danger">
                  <AlertTriangle size={30} />
                </div>
                <h3 className="modal-title text-center">Delete Staff Account?</h3>
                <p className="modal-subtitle text-center">
                  Are you sure you want to delete the account for <strong>{deleteModalUser.full_name}</strong> (@{deleteModalUser.username})?
                </p>
                <div className="delete-modal-warning">
                  This user will immediately be logged out and permanently lose access to all assigned modules. This action cannot be undone.
                </div>

                <div className="modal-actions justify-center">
                  <button
                    type="button"
                    className="btn-danger"
                    disabled={busy}
                    onClick={handleConfirmDelete}
                  >
                    {busy ? 'Deleting...' : 'Yes, Delete Account'}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    disabled={busy}
                    onClick={() => setDeleteModalUser(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
