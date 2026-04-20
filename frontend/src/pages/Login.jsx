import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

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

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{
            fontSize: '30px', fontWeight: '900',
            letterSpacing: '-1px', fontFamily: 'var(--syne)',
          }}>
            Edu<span style={{ color: '#06b6d4' }}>Track</span>
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Learner Management System
          </p>
        </div>

        {/* Username */}
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

        {/* Password */}
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
              style={{ paddingRight: '42px' }}
            />
            <span
              onClick={() => setShowPass(!showPass)}
              style={{
                position: 'absolute', right: '12px', top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer', fontSize: '16px', color: '#64748b',
              }}
            >
              {showPass ? '🙈' : '👁️'}
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '13px',
            color: '#dc2626',
            marginBottom: '14px',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Sign In Button */}
        <button
          className="btn btn-primary btn-full"
          style={{
            padding: '12px',
            fontSize: '15px',
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? '⏳ Signing in...' : 'Sign In'}
        </button>

        <p style={{
          fontSize: '12px', color: '#64748b',
          textAlign: 'center', marginTop: '16px',
        }}>
          Don't have an account?{' '}
          <span style={{ color: '#4f46e5', cursor: 'pointer', fontWeight: '600' }}>
            Register
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;