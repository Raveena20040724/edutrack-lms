import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const Navbar = ({ onSearch }) => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    setQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) onSearch(query);
  };

  const initials = user?.first_name && user?.last_name
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : (user?.username || 'U')[0].toUpperCase();

  const fullName = user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.username || '';

  return (
    <header style={{
      height: '56px',
      background: '#fff',
      borderBottom: '1px solid var(--edu-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 22px',
      flexShrink: 0,
    }}>
      {/* Search bar with icon */}
      <div style={{ position: 'relative', width: '260px' }}>
        <span style={{
          position: 'absolute', left: '12px', top: '50%',
          transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </span>
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          placeholder="Search courses, lessons..."
          style={{
            width: '100%',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '7px 14px 7px 36px',
            fontSize: '13px',
            outline: 'none',
            transition: '0.2s',
          }}
          onFocus={e => e.target.style.borderColor = '#4f46e5'}
          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
        />
      </div>

      {/* User info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '13px', fontWeight: '700', lineHeight: 1.3 }}>{fullName}</p>
          <p style={{ fontSize: '11px', color: 'var(--edu-sub)', textTransform: 'capitalize', lineHeight: 1.3 }}>{user?.role}</p>
        </div>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: '#4f46e5', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: '700', flexShrink: 0,
        }}>
          {initials}
        </div>
      </div>
    </header>
  );
};

export default Navbar;