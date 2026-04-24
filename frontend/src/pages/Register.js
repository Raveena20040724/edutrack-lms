import React, { useState } from 'react';
import '../App.css';

const Register = ({ onGoLogin }) => {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', username: '', password: '', confirm: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (form.password !== form.confirm) {
      alert('Passwords do not match!');
      return;
    }
    alert('Account created! Please login.');
    onGoLogin && onGoLogin();
  };

  return (
    <div className="login-wrap">
      <div className="login-card" style={{ maxWidth: '450px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-1px', fontFamily: 'var(--syne)' }}>
            Join Edu<span style={{ color: '#06b6d4' }}>Track</span>
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Create your account to start learning</p>
        </div>

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
          <input className="input" type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
        </div>

        <div className="form-group">
          <label className="label">Confirm Password</label>
          <input className="input" type="password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="••••••••" />
        </div>

        <button className="btn btn-primary btn-full" style={{ marginTop: '6px' }} onClick={handleSubmit}>
          Create Account
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
