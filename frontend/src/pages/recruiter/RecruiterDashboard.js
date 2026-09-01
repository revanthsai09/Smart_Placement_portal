import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import { getMyJobs } from '../../api/recruiterApi';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyJobs().then(res => setJobs(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const totalApps = jobs.reduce((sum, j) => sum + (j.applicationCount || 0), 0);
  const activeJobs = jobs.filter(j => !j.expired).length;

  if (loading) return <div className="layout"><Sidebar /><div className="main-content"><Loader /></div></div>;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content fade-in">
        <div className="page-header">
          <h1>Recruiter Dashboard 💼</h1>
          <p>Welcome back, {user?.name}! Manage your hiring pipeline.</p>
        </div>

        <div className="stats-grid">
          {[{ icon: '📋', value: jobs.length, label: 'Jobs Posted' }, { icon: '✅', value: activeJobs, label: 'Active Jobs' }, { icon: '👥', value: totalApps, label: 'Total Applicants' }].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Recent Jobs</h3>
            <Link to="/recruiter/post-job" className="btn btn-primary btn-sm">➕ Post New Job</Link>
          </div>
          {jobs.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <div className="empty-icon">📝</div>
              <h3>No jobs posted yet</h3>
              <p>Post your first job to start receiving applications</p>
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none', background: 'transparent' }}>
              <table>
                <thead><tr><th>Job Title</th><th>Location</th><th>Salary</th><th>Applicants</th><th>Deadline</th><th>Actions</th></tr></thead>
                <tbody>
                  {jobs.slice(0, 8).map(job => (
                    <tr key={job.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{job.title}</td>
                      <td>{job.location || '-'}</td>
                      <td style={{ color: 'var(--secondary)' }}>{job.salary || '-'}</td>
                      <td><span style={{ fontWeight: 700, color: 'var(--primary)' }}>{job.applicationCount}</span></td>
                      <td style={{ fontSize: '12px' }}>{job.deadline ? new Date(job.deadline).toLocaleDateString('en-IN') : '-'}</td>
                      <td><Link to={`/recruiter/jobs/${job.id}/applicants`} className="btn btn-secondary btn-sm">👥 View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
