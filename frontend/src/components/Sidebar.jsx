import React from 'react';
import '../App.css';

const Sidebar = ({ menuItems, activePage, onNavigate, role, onLogout }) => {
  return (
    <div style={{
      width: '220px',
      background: 'var(--edu-primary)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 18px 14px',
        fontSize: '20px',
        fontWeight: '800',
        fontFamily: 'var(--syne)',
        letterSpacing: '-0.5px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        lineHeight: 1.2,
      }}>
        Edu<span style={{ color: 'var(--edu-accent2)' }}>Track</span>
      </div>

      {/* Role label */}
      <div style={{
        padding: '8px 18px',
        fontSize: '10px',
        fontWeight: '700',
        letterSpacing: '1.5px',
        color: 'rgba(255,255,255,0.35)',
        textTransform: 'uppercase',
        marginTop: '10px',
      }}>
        {role} Portal
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1 }}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '11px 18px',
              cursor: 'pointer',
              fontSize: '13px',
              fontFamily: 'var(--dm)',
              color: activePage === item.id ? '#fff' : 'rgba(255,255,255,0.6)',
              background: activePage === item.id ? 'rgba(79,70,229,0.2)' : 'transparent',
              borderLeft: activePage === item.id ? '3px solid var(--edu-accent)' : '3px solid transparent',
              transition: '0.15s',
              userSelect: 'none',
            }}
            onMouseEnter={e => { if (activePage !== item.id) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { if (activePage !== item.id) e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{ fontSize: '15px', width: '20px', textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Logout — no icon, clean text */}
      <div style={{ padding: '16px 18px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '13px',
            transition: '0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </div>
      </div>
    </div>
  );
};

export default Sidebar;