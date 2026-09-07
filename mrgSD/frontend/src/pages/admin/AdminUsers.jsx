import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../utils/api';
import { Users, Search, AlertCircle, RefreshCw } from 'lucide-react';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetchWithAuth('/api/v1/auth/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError('An error occurred while fetching users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user => {
    const searchString = `${user.full_name || ''} ${user.phone_number || ''} ${user.email || ''}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="admin-users-container">
      <div className="admin-users-header">
        <div>
          <h2>User Management</h2>
          <p>View and manage registered customers</p>
        </div>
        <button className="admin-refresh-btn" onClick={fetchUsers} disabled={isLoading}>
          <RefreshCw size={16} className={isLoading ? 'spinning' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="admin-error-message">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="admin-users-controls">
        <div className="admin-search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchTerm}
            onChange={handleSearch}
            className="admin-search-input"
          />
        </div>
        <div className="admin-stats-badge">
          Total Users: {users.length}
        </div>
      </div>

      <div className="admin-table-container">
        {isLoading ? (
          <div className="admin-loading-state">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="admin-empty-state">
            <Users size={48} className="empty-icon" />
            <h3>No Users Found</h3>
            <p>Try adjusting your search terms or wait for users to register.</p>
          </div>
        ) : (
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Anniversary</th>
                <th>PAN</th>
                <th>Aadhar</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="admin-td-id">#{user.id}</td>
                  <td className="admin-td-name">
                    <div className="user-name">{user.full_name || 'N/A'}</div>
                  </td>
                  <td className="admin-td-contact">
                    <div className="user-phone">{user.phone_number}</div>
                    {user.email && <div className="user-email">{user.email}</div>}
                  </td>
                  <td>{formatDate(user.anniversary_date)}</td>
                  <td>
                    {user.pan_number ? (
                      <span className="doc-badge pan-badge">{user.pan_number}</span>
                    ) : '-'}
                  </td>
                  <td>
                    {user.aadhar_number ? (
                      <span className="doc-badge aadhar-badge">{user.aadhar_number}</span>
                    ) : '-'}
                  </td>
                  <td>{formatDateTime(user.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
