import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginApi } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await loginApi(form);
      const { token, role, name, userId } = res.data;
      login(token, { role, name, userId });
      const redirectMap = { STUDENT: '/student/dashboard', RECRUITER: '/recruiter/dashboard', ADMIN: '/admin/dashboard' };
      navigate(redirectMap[role]);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎓</div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, background: 'linear-gradient(135deg, #6c63ff, #00d4aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>PlacementHub</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Your gateway to campus careers</p>
        </div>

        <div className="card" style={{ padding: '36px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>Welcome back 👋</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '28px' }}>Sign in to your account</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input id="email" type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input id="password" type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button id="login-btn" type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }} disabled={loading}>
              {loading ? 'Signing in...' : '🔐 Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register here</Link>
          </p>

          <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(108,99,255,0.08)', borderRadius: '10px', border: '1px solid rgba(108,99,255,0.2)' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>Demo Credentials</p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Admin: admin@portal.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
