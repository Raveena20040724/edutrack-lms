import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const Navbar = () => {
  const { user } = useAuth();

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
      <input
        className="topbar-search"
        type="text"
        placeholder="Search courses, lessons..."
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '20px',
          padding: '7px 14px',
          fontSize: '13px',
          width: '220px',
          outline: 'none',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '13px', fontWeight: '700' }}>{user?.name}</p>
          <p style={{ fontSize: '11px', color: 'var(--edu-sub)', textTransform: 'capitalize' }}>{user?.role}</p>
        </div>
        <div
          className="avatar"
          style={{ background: user?.color, width: '34px', height: '34px', fontSize: '12px' }}
        >
          {user?.avatar}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
