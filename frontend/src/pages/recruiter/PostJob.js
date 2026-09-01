import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { postJob } from '../../api/recruiterApi';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
  const [form, setForm] = useState({ title: '', description: '', requiredSkills: '', salary: '', location: '', deadline: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await postJob(form);
      navigate('/recruiter/jobs');
    } catch (err) { setError(err.response?.data?.error || 'Failed to post job.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content fade-in">
        <div className="page-header">
          <h1>Post a New Job ➕</h1>
          <p>Fill in the details below to create a job listing</p>
        </div>

        <div className="card" style={{ padding: '36px', maxWidth: '800px' }}>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Job Title *</label>
              <input id="job-title" placeholder="e.g. Software Engineer" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Job Description *</label>
              <textarea id="job-desc" placeholder="Describe the role, responsibilities, and requirements..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={6} style={{ resize: 'vertical', minHeight: '140px' }} />
            </div>
            <div className="form-group">
              <label>Required Skills <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(comma-separated)</span></label>
              <input id="job-skills" placeholder="e.g. Java, Spring Boot, React, MySQL" value={form.requiredSkills} onChange={e => setForm({ ...form, requiredSkills: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Salary / Package</label>
                <input id="job-salary" placeholder="e.g. 8-12 LPA" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input id="job-location" placeholder="e.g. Bangalore, Remote" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
              </div>
            </div>
            <div className="form-group" style={{ maxWidth: '240px' }}>
              <label>Application Deadline</label>
              <input id="job-deadline" type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} min={new Date().toISOString().split('T')[0]} />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button id="post-job-btn" type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Posting...' : '🚀 Post Job'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/recruiter/jobs')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
