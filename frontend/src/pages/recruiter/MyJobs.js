import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import { getMyJobs, updateJob, deleteJob } from '../../api/recruiterApi';
import { Link } from 'react-router-dom';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    getMyJobs().then(res => setJobs(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const showMsg = (type, text) => { setMessage({ type, text }); setTimeout(() => setMessage({ type: '', text: '' }), 3000); };

  const handleEdit = (job) => { setEditingJob(job.id); setEditForm({ title: job.title, description: job.description, requiredSkills: job.requiredSkills, salary: job.salary, location: job.location, deadline: job.deadline }); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateJob(editingJob, editForm);
      setJobs(jobs.map(j => j.id === editingJob ? res.data : j));
      setEditingJob(null);
      showMsg('success', 'Job updated! ✅');
    } catch (err) { showMsg('error', err.response?.data?.error || 'Update failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this job listing?')) return;
    try {
      await deleteJob(id);
      setJobs(jobs.filter(j => j.id !== id));
      showMsg('success', 'Job removed.');
    } catch (err) { showMsg('error', 'Delete failed.'); }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content fade-in">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div><h1>My Jobs 💼</h1><p>Manage all your job postings</p></div>
          <Link to="/recruiter/post-job" className="btn btn-primary">➕ Post New Job</Link>
        </div>

        {message.text && <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>{message.text}</div>}

        {loading ? <Loader /> : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No jobs posted yet</h3>
            <p>Create your first job listing to start receiving applications</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {jobs.map(job => (
              <div key={job.id} className="card" style={{ padding: '24px' }}>
                {editingJob === job.id ? (
                  <div>
                    <h4 style={{ marginBottom: '16px', color: 'var(--primary)' }}>✏️ Editing Job</h4>
                    <div className="form-row">
                      <div className="form-group"><label>Title</label><input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} /></div>
                      <div className="form-group"><label>Location</label><input value={editForm.location || ''} onChange={e => setEditForm({ ...editForm, location: e.target.value })} /></div>
                    </div>
                    <div className="form-row">
                      <div className="form-group"><label>Salary</label><input value={editForm.salary || ''} onChange={e => setEditForm({ ...editForm, salary: e.target.value })} /></div>
                      <div className="form-group"><label>Deadline</label><input type="date" value={editForm.deadline || ''} onChange={e => setEditForm({ ...editForm, deadline: e.target.value })} /></div>
                    </div>
                    <div className="form-group"><label>Description</label><textarea rows={4} value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })} /></div>
                    <div className="form-group"><label>Required Skills</label><input value={editForm.requiredSkills || ''} onChange={e => setEditForm({ ...editForm, requiredSkills: e.target.value })} /></div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button className="btn btn-success btn-sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : '💾 Save'}</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditingJob(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '4px' }}>{job.title}</h3>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
                        {job.location && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>📍 {job.location}</span>}
                        {job.salary && <span style={{ fontSize: '12px', color: 'var(--secondary)' }}>💰 {job.salary}</span>}
                        <span style={{ fontSize: '12px', color: 'var(--primary)' }}>👥 {job.applicationCount} applicants</span>
                        {job.deadline && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>📅 {new Date(job.deadline).toLocaleDateString('en-IN')}</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <Link to={`/recruiter/jobs/${job.id}/applicants`} className="btn btn-secondary btn-sm">👥 Applicants</Link>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(job)}>✏️ Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(job.id)}>🗑️</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
