import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '../../components/Sidebar';
import JobCard from '../../components/JobCard';
import Loader from '../../components/Loader';
import { getAllJobs, applyToJob, getMyApplications } from '../../api/studentApi';

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (keyword) params.keyword = keyword;
      if (location) params.location = location;
      const [jobsRes, appsRes] = await Promise.all([getAllJobs(params), getMyApplications()]);
      setJobs(jobsRes.data);
      setAppliedJobIds(new Set(appsRes.data.map(a => a.jobId)));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [keyword, location]);

  useEffect(() => { fetchJobs(); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetchJobs(); };

  const handleApply = async (jobId) => {
    setApplying(jobId);
    try {
      await applyToJob(jobId);
      setAppliedJobIds(prev => new Set([...prev, jobId]));
      setMessage({ type: 'success', text: 'Application submitted successfully! 🎉' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to apply.' });
    } finally {
      setApplying(null);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content fade-in">
        <div className="page-header">
          <h1>Browse Jobs 🔍</h1>
          <p>Find opportunities that match your skills and interests</p>
        </div>

        <form onSubmit={handleSearch}>
          <div className="search-bar">
            <input id="search-keyword" type="text" placeholder="🔍 Search by title, skills, or keywords..."
              value={keyword} onChange={e => setKeyword(e.target.value)} />
            <input id="search-location" type="text" placeholder="📍 Filter by location..."
              value={location} onChange={e => setLocation(e.target.value)} style={{ maxWidth: 240 }} />
            <button type="submit" className="btn btn-primary" id="search-btn">Search</button>
            <button type="button" className="btn btn-secondary" onClick={() => { setKeyword(''); setLocation(''); setTimeout(fetchJobs, 100); }}>Clear</button>
          </div>
        </form>

        {message.text && <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>{message.text}</div>}

        {loading ? <Loader text="Fetching jobs..." /> : (
          jobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔎</div>
              <h3>No jobs found</h3>
              <p>Try different keywords or clear filters</p>
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>{jobs.length} job{jobs.length !== 1 ? 's' : ''} found</p>
              <div className="jobs-grid">
                {jobs.map(job => (
                  <JobCard key={job.id} job={job}
                    isApplied={appliedJobIds.has(job.id)}
                    onApply={handleApply}
                    showApply={true} />
                ))}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default BrowseJobs;
