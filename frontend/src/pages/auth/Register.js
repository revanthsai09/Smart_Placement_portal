import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerApi } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'STUDENT' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await registerApi(form);
      const { token, role, name, userId } = res.data;
      login(token, { role, name, userId });
      navigate(role === 'STUDENT' ? '/student/dashboard' : '/recruiter/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎓</div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, background: 'linear-gradient(135deg, #6c63ff, #00d4aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>PlacementHub</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Join the placement ecosystem</p>
        </div>

        <div className="card" style={{ padding: '36px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>Create Account 🚀</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '28px' }}>Fill in your details to get started</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input id="name" type="text" placeholder="John Doe" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input id="reg-email" type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Password <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(min 6 characters)</span></label>
              <input id="reg-password" type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>I am registering as</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {['STUDENT', 'RECRUITER'].map(r => (
                  <div key={r}
                    id={`role-${r.toLowerCase()}`}
                    onClick={() => setForm({ ...form, role: r })}
                    style={{ padding: '16px', borderRadius: '10px', border: `2px solid ${form.role === r ? 'var(--primary)' : 'var(--border)'}`, background: form.role === r ? 'var(--primary-light)' : 'var(--bg-card)', cursor: 'pointer', textAlign: 'center', transition: 'var(--transition)' }}>
                    <div style={{ fontSize: '24px', marginBottom: '6px' }}>{r === 'STUDENT' ? '🎓' : '💼'}</div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: form.role === r ? 'var(--primary)' : 'var(--text-secondary)' }}>{r}</p>
                  </div>
                ))}
              </div>
            </div>
            <button id="register-btn" type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }} disabled={loading}>
              {loading ? 'Creating account...' : '✨ Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
