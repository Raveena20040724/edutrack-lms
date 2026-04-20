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
      <div style={{
        padding: '20px 18px 14px',
        fontSize: '20px',
        fontWeight: '800',
        fontFamily: 'var(--syne)',
        letterSpacing: '-0.5px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        Edu<span style={{ color: 'var(--edu-accent2)' }}>Track</span>
      </div>

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

      <nav>
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
              color: activePage === item.id ? '#fff' : 'rgba(255,255,255,0.6)',
              background: activePage === item.id ? 'rgba(79,70,229,0.2)' : 'transparent',
              borderLeft: activePage === item.id ? '3px solid var(--edu-accent)' : '3px solid transparent',
              transition: '0.15s',
              userSelect: 'none',
            }}
          >
            <span style={{ fontSize: '15px', width: '18px', textAlign: 'center' }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="logout-btn" onClick={onLogout}>
          <span>🚪</span> Logout
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
