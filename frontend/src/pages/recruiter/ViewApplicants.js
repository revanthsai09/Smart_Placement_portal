import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';
import { getJobApplicants, updateApplicationStatus } from '../../api/recruiterApi';
import { useParams, useNavigate } from 'react-router-dom';

const ViewApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    getJobApplicants(jobId).then(res => setApplicants(res.data)).catch(console.error).finally(() => setLoading(false));
  }, [jobId]);

  const handleStatus = async (appId, status) => {
    setUpdating(appId);
    try {
      const res = await updateApplicationStatus(appId, status);
      setApplicants(prev => prev.map(a => a.id === appId ? { ...a, status: res.data.status } : a));
      setMessage({ type: 'success', text: `Status updated to ${status}` });
    } catch (err) { setMessage({ type: 'error', text: 'Update failed.' }); }
    finally { setUpdating(null); setTimeout(() => setMessage({ type: '', text: '' }), 2500); }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content fade-in">
        <div className="page-header">
          <button onClick={() => navigate('/recruiter/jobs')} className="btn btn-secondary btn-sm" style={{ marginBottom: '12px' }}>← Back to My Jobs</button>
          <h1>Job Applicants 👥</h1>
          <p>{applicants.length} candidate{applicants.length !== 1 ? 's' : ''} applied for this position</p>
        </div>

        {message.text && <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>{message.text}</div>}

        {loading ? <Loader /> : applicants.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <h3>No applicants yet</h3>
            <p>Applications will appear here when students apply</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {applicants.map(app => (
              <div key={app.id} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>👤</div>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{app.studentName}</h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{app.studentEmail}</p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      {app.studentCollege && <span>🏫 {app.studentCollege}</span>}
                      {app.studentBranch && <span>📚 {app.studentBranch}</span>}
                      {app.studentYear && <span>📅 Year {app.studentYear}</span>}
                      {app.studentCgpa && <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>⭐ CGPA: {app.studentCgpa}</span>}
                    </div>
                    {app.studentSkills && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {app.studentSkills.split(',').map((s, i) => (
                          <span key={i} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid rgba(108,99,255,0.2)' }}>{s.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0, minWidth: '180px' }}>
                    {app.resumeUrl && (
                      <a href={`${process.env.REACT_APP_API_BASE_URL || ''}${app.resumeUrl}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ textAlign: 'center', justifyContent: 'center', display: 'flex' }}>📄 Download Resume</a>
                    )}
                    {['SHORTLISTED', 'REJECTED', 'HIRED'].map(s => (
                      app.status !== s && (
                        <button key={s} className={`btn btn-sm ${s === 'SHORTLISTED' ? 'btn-warning' : s === 'REJECTED' ? 'btn-danger' : 'btn-success'}`}
                          onClick={() => handleStatus(app.id, s)} disabled={updating === app.id} style={{ justifyContent: 'center' }}>
                          {updating === app.id ? '...' : s === 'SHORTLISTED' ? '⭐ Shortlist' : s === 'REJECTED' ? '❌ Reject' : '🎉 Mark Hired'}
                        </button>
                      )
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewApplicants;
