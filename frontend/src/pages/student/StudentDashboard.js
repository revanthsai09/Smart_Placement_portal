import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';
import { getAllJobs, getMyApplications } from '../../api/studentApi';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ jobs: 0, applied: 0, shortlisted: 0, hired: 0 });
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([getAllJobs(), getMyApplications()]);
        const apps = appsRes.data;
        setStats({
          jobs: jobsRes.data.length,
          applied: apps.length,
          shortlisted: apps.filter(a => a.status === 'SHORTLISTED').length,
          hired: apps.filter(a => a.status === 'HIRED').length,
        });
        setRecentApps(apps.slice(0, 5));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div className="layout"><Sidebar /><div className="main-content"><Loader /></div></div>;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content fade-in">
        <div className="page-header">
          <h1>Welcome back, {user?.name} 👋</h1>
          <p>Here's your placement journey at a glance</p>
        </div>

        <div className="stats-grid">
          {[{ icon: '💼', value: stats.jobs, label: 'Jobs Available' }, { icon: '📋', value: stats.applied, label: 'Jobs Applied' }, { icon: '⭐', value: stats.shortlisted, label: 'Shortlisted' }, { icon: '🎉', value: stats.hired, label: 'Hired' }].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Recent Applications</h3>
              <Link to="/student/applications" style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 500 }}>View all →</Link>
            </div>
            {recentApps.length === 0 ? (
              <div className="empty-state" style={{ padding: '32px 0' }}>
                <div className="empty-icon">📭</div>
                <p>No applications yet</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentApps.map(app => (
                  <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600 }}>{app.jobTitle}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{app.jobLocation}</p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[{ icon: '🔍', label: 'Browse Jobs', desc: 'Find your dream role', to: '/student/jobs' },
                { icon: '👤', label: 'Update Profile', desc: 'Keep your info current', to: '/student/profile' },
                { icon: '📋', label: 'Track Applications', desc: 'Monitor your progress', to: '/student/applications' }].map((a, i) => (
                <Link to={a.to} key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', transition: 'var(--transition)', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(108,99,255,0.4)'; e.currentTarget.style.background = 'var(--primary-light)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)'; }}>
                  <span style={{ fontSize: '20px' }}>{a.icon}</span>
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
    </div>
  );
};

export default StudentDashboard;
