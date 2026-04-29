import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const Navbar = ({search, onSearch }) => {
  const { user } = useAuth();

  const initials = user?.first_name && user?.last_name
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : (user?.username || 'U')[0].toUpperCase();

  const fullName = user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.username || '';

  return (
    <header style={{
      height: '56px',
      background: '#07021a',
      borderBottom: '1px solid var(--edu-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 22px',
      flexShrink: 0,
    }}>

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