import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';
import { getMyApplications } from '../../api/studentApi';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications().then(res => setApplications(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content fade-in">
        <div className="page-header">
          <h1>My Applications 📋</h1>
          <p>Track the status of all your job applications</p>
        </div>

        {loading ? <Loader /> : applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No applications yet</h3>
            <p>Start applying to jobs to see your applications here</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Job Title</th>
                  <th>Location</th>
                  <th>Salary</th>
                  <th>Applied On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, idx) => (
                  <tr key={app.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{app.jobTitle}</td>
                    <td>{app.jobLocation || '-'}</td>
                    <td style={{ color: 'var(--secondary)' }}>{app.jobSalary || '-'}</td>
                    <td>{formatDate(app.appliedAt)}</td>
                    <td><StatusBadge status={app.status} /></td>
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

export default MyApplications;
