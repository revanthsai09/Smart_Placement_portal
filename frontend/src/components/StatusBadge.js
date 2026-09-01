import React from 'react';

const icons = {
  APPLIED: '📋',
  SHORTLISTED: '⭐',
  REJECTED: '❌',
  HIRED: '🎉',
  STUDENT: '🎓',
  RECRUITER: '💼',
};

const StatusBadge = ({ status }) => (
  <span className={`badge badge-${status?.toLowerCase()}`}>
    {icons[status] && <span style={{ marginRight: 4 }}>{icons[status]}</span>}
    {status}
  </span>
);

export default StatusBadge;
