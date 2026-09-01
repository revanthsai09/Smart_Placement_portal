import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';
import { getAllUsers, toggleUserActive } from '../../api/adminApi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    getAllUsers().then(res => setUsers(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleToggle = async (id) => {
    setToggling(id);
    try {
      const res = await toggleUserActive(id);
      setUsers(prev => prev.map(u => u.id === id ? res.data : u));
      setMessage({ type: 'success', text: `User ${res.data.active ? 'unblocked' : 'blocked'} successfully.` });
    } catch (err) { setMessage({ type: 'error', text: 'Action failed.' }); }
    finally { setToggling(null); setTimeout(() => setMessage({ type: '', text: '' }), 2500); }
  };

  const filtered = filter === 'ALL' ? users : users.filter(u => u.role === filter);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content fade-in">
        <div className="page-header">
          <h1>Manage Users 👥</h1>
          <p>View, block, or unblock all platform users</p>
        </div>

        {message.text && <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>{message.text}</div>}

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {['ALL', 'STUDENT', 'RECRUITER'].map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter(f)}>{f}</button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--text-muted)', alignSelf: 'center' }}>{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? <Loader /> : filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">👤</div><h3>No users found</h3></div>
        ) : (
          <div className="table-container">
            <table>
              <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {filtered.map((u, idx) => (
                  <tr key={u.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</td>
                    <td style={{ fontSize: '13px' }}>{u.email}</td>
                    <td><StatusBadge status={u.role} /></td>
                    <td style={{ fontSize: '12px' }}>{formatDate(u.createdAt)}</td>
                    <td><span className={`badge badge-${u.active ? 'active' : 'inactive'}`}>{u.active ? '✅ Active' : '🚫 Blocked'}</span></td>
                    <td>
                      <button
                        className={`btn btn-sm ${u.active ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => handleToggle(u.id)}
                        disabled={toggling === u.id}>
                        {toggling === u.id ? '...' : u.active ? '🚫 Block' : '✅ Unblock'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
