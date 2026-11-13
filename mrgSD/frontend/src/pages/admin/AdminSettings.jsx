import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchWithAuth, logoutAdmin } from '../../utils/api';
import { useAdminAccess } from '../../context/AdminAccessContext';
import './AdminSettings.css';

const emptyStaff = { username: '', full_name: '', phone_number: '', password: '', permissions: [] };

async function request(path, options) {
  const response = await fetchWithAuth(`/api/v1/admin/settings${path}`, options);
  const data = await response.json();
  if (!response.ok) throw new Error(typeof data.detail === 'string' ? data.detail : 'Please check the form fields and try again.');
  return data;
}

export default function AdminSettings({ section = 'password' }) {
  const { account } = useAdminAccess();
  const [password, setPassword] = useState({ current_password: '', new_password: '', confirm: '' });
  const [staff, setStaff] = useState(emptyStaff);
  const [modules, setModules] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState('');

  const load = async () => {
    try {
      const data = await request('/staff');
      setAccounts(data.accounts);
      setModules(data.modules);
      setLoadError('');
    } catch (error) { setLoadError(error.message); }
  };
  useEffect(() => { if (account.is_owner && section === 'permissions') load(); }, [account.is_owner, section]);

  const changePassword = async (event) => {
    event.preventDefault();
    if (password.new_password !== password.confirm) return toast.error('New passwords do not match.');
    setBusy(true);
    try {
      await request('/password', { method: 'POST', body: JSON.stringify(password) });
      logoutAdmin();
      window.location.replace('/admin/login');
    } catch (error) { toast.error(error.message); }
    finally { setBusy(false); }
  };

  const saveStaff = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const body = editing ? {
        permissions: staff.permissions, is_active: staff.is_active,
        ...(staff.password ? { new_password: staff.password } : {})
      } : staff;
      await request(editing ? `/staff/${editing}` : '/staff', { method: editing ? 'PATCH' : 'POST', body: JSON.stringify(body) });
      toast.success(editing ? 'Staff access updated. Existing sessions have been signed out.' : 'Staff account created.');
      setEditing(null);
      setStaff(emptyStaff);
      await load();
    } catch (error) { toast.error(error.message); }
    finally { setBusy(false); }
  };

  if (section === 'permissions' && !account.is_owner) return <Navigate to="/admin/settings/password" replace />;

  return <div className="admin-settings-page">
    <h1>{section === 'password' ? 'Change Password' : 'User Role and Permissions'}</h1>
    {section === 'password' && <section className="settings-panel">
      <h2>Change password</h2>
      <p>Use at least 10 characters. Changing your password signs out all your sessions.</p>
      <form onSubmit={changePassword}>
        <label>Current password<input type="password" autoComplete="current-password" required value={password.current_password} onChange={e => setPassword({ ...password, current_password: e.target.value })} /></label>
        <label>New password<input type="password" autoComplete="new-password" required minLength={10} maxLength={128} value={password.new_password} onChange={e => setPassword({ ...password, new_password: e.target.value })} /></label>
        <label>Confirm new password<input type="password" autoComplete="new-password" required value={password.confirm} onChange={e => setPassword({ ...password, confirm: e.target.value })} /></label>
        <button disabled={busy}>Change password</button>
      </form>
    </section>}
    {section === 'permissions' && account.is_owner && <>
      <section className="settings-panel">
        <h2>{editing ? 'Edit staff access' : 'Add admin user'}</h2>
        <p>Staff sign in with their own username, password and an OTP sent to their phone. Select the modules they may view and manage.</p>
        {loadError && <p role="alert">{loadError} <button onClick={load}>Retry</button></p>}
        <form onSubmit={saveStaff}>
          <label>Full name<input required disabled={!!editing} value={staff.full_name} maxLength={100} onChange={e => setStaff({ ...staff, full_name: e.target.value })} /></label>
          <label>Username<input required disabled={!!editing} pattern="[a-zA-Z0-9_.\-]+" minLength={3} maxLength={100} autoComplete="off" value={staff.username} onChange={e => setStaff({ ...staff, username: e.target.value })} /></label>
          <label>Phone number<input type="tel" required disabled={!!editing} placeholder="+919876543210" value={staff.phone_number} onChange={e => setStaff({ ...staff, phone_number: e.target.value })} /></label>
          <label>{editing ? 'Reset password (leave blank to keep current)' : 'Password'}<input type="password" required={!editing} autoComplete="new-password" minLength={10} maxLength={128} value={staff.password} onChange={e => setStaff({ ...staff, password: e.target.value })} /></label>
          <fieldset><legend>Module permissions</legend><div className="settings-permissions">
            {Object.entries(modules).map(([key, label]) => <label key={key}><input type="checkbox" checked={staff.permissions.includes(key)} onChange={e => setStaff({ ...staff, permissions: e.target.checked ? [...staff.permissions, key] : staff.permissions.filter(p => p !== key) })} />{label}</label>)}
          </div></fieldset>
          {editing && <label className="settings-checkbox"><input type="checkbox" checked={staff.is_active} onChange={e => setStaff({ ...staff, is_active: e.target.checked })} />Account active</label>}
          <div className="settings-actions"><button disabled={busy || !Object.keys(modules).length}>{busy ? 'Saving...' : editing ? 'Save access' : 'Add user'}</button>{editing && <button type="button" disabled={busy} onClick={() => { setEditing(null); setStaff(emptyStaff); }}>Cancel</button>}</div>
        </form>
      </section>
      <section className="settings-panel"><h2>Admin users</h2>
        <div className="settings-account-list">{accounts.map(a => <div className="settings-account" key={a.id}>
          <div><strong>{a.full_name}</strong><p>{a.username} · {a.phone_number} · {a.is_active ? 'Active' : 'Inactive'}</p><p>{a.is_owner ? 'Main administrator · All modules' : a.permissions.map(p => modules[p]).join(', ') || 'No modules assigned'}</p></div>
          {!a.is_owner && <button type="button" disabled={busy} onClick={() => { setEditing(a.id); setStaff({ ...a, password: '' }); }}>Edit permissions / Reset password</button>}
        </div>)}</div>
      </section>
    </>}
  </div>;
}
