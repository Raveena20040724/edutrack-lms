import React, { useState } from 'react';
import { authAPI } from '../services/api';
import '../App.css';

const Register = ({ onGoLogin }) => {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', username: '', password: '', confirm: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError('');
    if (!form.firstName || !form.lastName || !form.email || !form.username || !form.password) {
      setError('Please fill in all fields.'); return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.'); return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }

    setLoading(true);
    try {
      await authAPI.register({
        first_name: form.firstName,
        last_name:  form.lastName,
        email:      form.email,
        username:   form.username,
        password:   form.password,
        password2:  form.confirm,
        role:       'student',
      });
      setSuccess('Account created successfully! You can now login.');
      setTimeout(() => onGoLogin && onGoLogin(), 2000);
    } catch (err) {
      const msg = err.username?.[0] || err.email?.[0] || err.password?.[0] || err.detail || 'Registration failed. Try a different username.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card" style={{ maxWidth: '440px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-1px', fontFamily: 'var(--syne)', lineHeight: 1.2 }}>
            Join Edu<span style={{ color: '#06b6d4' }}>Track</span>
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>Create your account to start learning</p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#dc2626', marginBottom: '14px' }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#065f46', marginBottom: '14px' }}>
            ✅ {success}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="form-group">
            <label className="label">First Name</label>
            <input className="input" name="firstName" value={form.firstName} onChange={handleChange} placeholder="John" />
          </div>
          <div className="form-group">
            <label className="label">Last Name</label>
            <input className="input" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" />
          </div>
        </div>

        <div className="form-group">
          <label className="label">Email Address</label>
          <input className="input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
        </div>
        <div className="form-group">
          <label className="label">Username</label>
          <input className="input" name="username" value={form.username} onChange={handleChange} placeholder="johndoe" />
        </div>
        <div className="form-group">
          <label className="label">Password</label>
          <input className="input" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" />
        </div>
        <div className="form-group">
          <label className="label">Confirm Password</label>
          <input className="input" type="password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="••••••••" />
        </div>

        <button
          className="btn btn-primary btn-full"
          style={{ marginTop: '6px', padding: '12px', opacity: loading ? 0.7 : 1 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', marginTop: '14px' }}>
          Already have an account?{' '}
          <span style={{ color: '#4f46e5', cursor: 'pointer', fontWeight: '600' }} onClick={onGoLogin}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Register;