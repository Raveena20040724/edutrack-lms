import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../App.css';

// We pass in onGoRegister as a prop from App.jsx
const Login = ({ onGoRegister }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter username and password.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await login(username, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-1px', fontFamily: 'var(--syne)', lineHeight: 1.2 }}>
            Edu<span style={{ color: '#06b6d4' }}>Track</span>
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>Learner Management System</p>
        </div>

        <div className="form-group">
          <label className="label">Username</label>
          <input
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div className="form-group">
          <label className="label">Password</label>
          <div style={{ position: 'relative' }}>
            <input
              className="input"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              style={{ paddingRight: '40px' }}
            />
            <span
              onClick={() => setShowPass(!showPass)}
              style={{
                position: 'absolute', right: '12px', top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer', color: '#94a3b8', lineHeight: 1,
                userSelect: 'none',
              }}
            >
              {showPass ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </span>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#dc2626', marginBottom: '14px' }}>
            ⚠️ {error}
          </div>
        )}

        <button
          className="btn btn-primary btn-full"
          style={{ padding: '12px', fontSize: '15px', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', marginTop: '16px' }}>
          Don't have an account?{' '}
          <span
            style={{ color: '#4f46e5', cursor: 'pointer', fontWeight: '600' }}
            onClick={onGoRegister} // Fixed: Correctly triggers the setPage state in App.jsx
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;