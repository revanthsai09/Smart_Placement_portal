import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const studentLinks = [
  { path: '/student/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/student/jobs', label: 'Browse Jobs', icon: '🔍' },
  { path: '/student/applications', label: 'My Applications', icon: '📋' },
  { path: '/student/profile', label: 'My Profile', icon: '👤' },
];

const recruiterLinks = [
  { path: '/recruiter/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/recruiter/post-job', label: 'Post a Job', icon: '➕' },
  { path: '/recruiter/jobs', label: 'My Jobs', icon: '💼' },
];

const adminLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/admin/users', label: 'Manage Users', icon: '👥' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const links = user?.role === 'STUDENT' ? studentLinks
    : user?.role === 'RECRUITER' ? recruiterLinks
    : adminLinks;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🎓</div>
        <h2>PlacementHub</h2>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-section-title">{user?.role === 'STUDENT' ? 'Student' : user?.role === 'RECRUITER' ? 'Recruiter' : 'Admin'} Menu</p>
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
          >
            <span className="icon">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ padding: '12px 8px', marginBottom: '8px' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{user?.name}</p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user?.role}</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={logout} style={{ width: '100%' }}>
          🚪 Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
