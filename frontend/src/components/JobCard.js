import React from 'react';

const JobCard = ({ job, onApply, isApplied, showApply = true }) => {
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';
  const isExpired = job.deadline && new Date(job.deadline) < new Date();

  return (
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {job.title}
          </h3>
          <p style={{ color: 'var(--primary)', fontSize: '13px', fontWeight: 500 }}>by {job.recruiterName}</p>
        </div>
        {isExpired && (
          <span className="badge badge-rejected" style={{ marginLeft: 8, whiteSpace: 'nowrap' }}>Expired</span>
        )}
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {job.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        {job.location && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--bg-card)', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border)' }}>
            📍 {job.location}
          </span>
        )}
        {job.salary && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '12px', color: 'var(--secondary)', background: 'rgba(0,212,170,0.1)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(0,212,170,0.2)' }}>
            💰 {job.salary}
          </span>
        )}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '12px', color: 'var(--text-muted)', background: 'var(--bg-card)', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border)' }}>
          📅 Deadline: {formatDate(job.deadline)}
        </span>
      </div>

      {job.requiredSkills && (
        <div style={{ marginBottom: '18px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {job.requiredSkills.split(',').slice(0, 5).map((s, i) => (
            <span key={i} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid rgba(108,99,255,0.2)' }}>
              {s.trim()}
            </span>
          ))}
        </div>
      )}

      {showApply && (
        <button
          className={`btn ${isApplied ? 'btn-secondary' : 'btn-primary'} btn-sm`}
          onClick={() => !isApplied && !isExpired && onApply(job.id)}
          disabled={isApplied || isExpired}
          style={{ width: '100%' }}
        >
          {isApplied ? '✅ Applied' : isExpired ? 'Deadline Passed' : '🚀 Apply Now'}
        </button>
      )}
    </div>
  );
};

export default JobCard;
