import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import '../../App.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm]         = useState({
    first_name: user?.first_name || '',
    last_name:  user?.last_name  || '',
    email:      user?.email      || '',
  });
  const [passwords, setPasswords] = useState({ old_password: '', new_password: '', confirm: '' });
  const [saving, setSaving]       = useState(false);
  const [message, setMessage]     = useState('');
  const [passMsg, setPassMsg]     = useState('');

  const handleSave = async () => {
    setSaving(true);
    const result = await updateProfile(form);
    setSaving(false);
    setMessage(result.success ? '✅ Profile updated!' : '❌ ' + result.error);
  };

  const handleChangePassword = async () => {
    if (passwords.new_password !== passwords.confirm) {
      setPassMsg('❌ Passwords do not match.');
      return;
    }
    try {
      await authAPI.changePassword(passwords.old_password, passwords.new_password);
      setPassMsg('✅ Password changed successfully!');
      setPasswords({ old_password: '', new_password: '', confirm: '' });
    } catch (err) {
      setPassMsg('❌ ' + (err.detail || 'Failed to change password.'));
    }
  };

  const initials = user?.first_name && user?.last_name
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : (user?.username || 'U')[0].toUpperCase();

  return (
    <div className="fade-in">
      <div className="page-title">Profile</div>
      <div className="grid-2">
        {/* Info Card */}
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div
              className="avatar"
              style={{ background: '#4f46e5', width: '64px', height: '64px', fontSize: '22px', margin: '0 auto 12px' }}
            >
              {initials}
            </div>
            <h3 style={{ fontWeight: '800', fontFamily: 'var(--syne)' }}>
              {user?.first_name} {user?.last_name}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--edu-sub)' }}>{user?.email}</p>
            <span className="badge badge-purple" style={{ marginTop: '8px', display: 'inline-block', textTransform: 'capitalize' }}>
              {user?.role}
            </span>
          </div>

          {message && (
            <div style={{
              background: message.startsWith('✅') ? '#d1fae5' : '#fee2e2',
              border: `1px solid ${message.startsWith('✅') ? '#6ee7b7' : '#fca5a5'}`,
              borderRadius: '8px', padding: '8px 12px',
              fontSize: '13px', marginBottom: '12px',
              color: message.startsWith('✅') ? '#065f46' : '#dc2626',
            }}>
              {message}
            </div>
          )}

          <div className="form-group">
            <label className="label">First Name</label>
            <input className="input" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Last Name</label>
            <input className="input" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Email</label>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? '⏳ Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Password Card */}
        <div className="card">
          <div className="card-title">Change Password</div>

          {passMsg && (
            <div style={{
              background: passMsg.startsWith('✅') ? '#d1fae5' : '#fee2e2',
              border: `1px solid ${passMsg.startsWith('✅') ? '#6ee7b7' : '#fca5a5'}`,
              borderRadius: '8px', padding: '8px 12px',
              fontSize: '13px', marginBottom: '12px',
              color: passMsg.startsWith('✅') ? '#065f46' : '#dc2626',
            }}>
              {passMsg}
            </div>
          )}

          <div className="form-group">
            <label className="label">Current Password</label>
            <input className="input" type="password" placeholder="••••••••"
              value={passwords.old_password}
              onChange={(e) => setPasswords({ ...passwords, old_password: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">New Password</label>
            <input className="input" type="password" placeholder="••••••••"
              value={passwords.new_password}
              onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Confirm New Password</label>
            <input className="input" type="password" placeholder="••••••••"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
          </div>
          <button className="btn btn-primary" onClick={handleChangePassword}>
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;