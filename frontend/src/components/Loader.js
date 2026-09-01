import React from 'react';

const Loader = ({ text = 'Loading...' }) => (
  <div className="loader-container">
    <div style={{ textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{text}</p>
    </div>
  </div>
);

export default Loader;
