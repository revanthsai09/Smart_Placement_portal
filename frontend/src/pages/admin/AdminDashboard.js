import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import { getDashboard } from '../../api/adminApi';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalStudents: 0, totalRecruiters: 0, totalJobs: 0, totalApplications: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard().then(res => setStats(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="layout"><Sidebar /><div className="main-content"><Loader /></div></div>;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content fade-in">
        <div className="page-header">
          <h1>Admin Dashboard 📊</h1>
          <p>Platform overview and system statistics</p>
        </div>

        <div className="stats-grid">
          {[
            { icon: '🎓', value: stats.totalStudents, label: 'Total Students', color: 'var(--info)' },
            { icon: '💼', value: stats.totalRecruiters, label: 'Total Recruiters', color: 'var(--primary)' },
            { icon: '📋', value: stats.totalJobs, label: 'Active Jobs', color: 'var(--secondary)' },
            { icon: '📊', value: stats.totalApplications, label: 'Total Applications', color: 'var(--warning)' },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Admin Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {[{ icon: '👥', label: 'Manage Users', desc: 'Approve, block, or remove users', to: '/admin/users' }].map((a, i) => (
              <Link to={a.to} key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', transition: 'var(--transition)', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(108,99,255,0.4)'; e.currentTarget.style.background = 'var(--primary-light)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)'; }}>
                <span style={{ fontSize: '28px' }}>{a.icon}</span>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{a.label}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{a.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
