import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';
import Modal from '../../components/Modal';
import '../../App.css';

const ManageUsers = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState(0);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [form, setForm]       = useState({ first_name: '', last_name: '', email: '', username: '', role: 'student', password: '' });
  const [saving, setSaving]   = useState(false);
  const [message, setMessage] = useState('');

  const tabs = ['All', 'Students', 'Trainers', 'Admins'];
  const roleFilter = ['all', 'student', 'trainer', 'admin'];
  const colors = ['#4f46e5','#06b6d4','#10b981','#f59e0b','#ef4444','#8b5cf6'];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await authAPI.getUsers();
      setUsers(Array.isArray(data) ? data : data?.results || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = tab === 0 ? users : users.filter(u => u.role === roleFilter[tab]);

  const handleRemove = async (id) => {
    if (!window.confirm('Are you sure you want to remove this user?')) return;
    try {
      await authAPI.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert(err.detail || 'Failed to remove user.');
    }
  };

  const handleAdd = async () => {
    setSaving(true);
    try {
      await authAPI.createUser({ ...form, password2: form.password });
      setMessage('✅ User created successfully!');
      setAddModal(false);
      setForm({ first_name: '', last_name: '', email: '', username: '', role: 'student', password: '' });
      fetchUsers();
    } catch (err) {
      setMessage('❌ ' + (err.detail || JSON.stringify(err)));
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (u) => {
    setEditModal(u);
    setForm({ first_name: u.first_name || '', last_name: u.last_name || '', email: u.email || '', username: u.username || '', role: u.role, password: '' });
  };

  if (loading) return (
    <div className="fade-in" style={{ textAlign: 'center', padding: '60px', color: 'var(--edu-sub)' }}>
      ⏳ Loading users...
    </div>
  );

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div>
          <div className="page-title">Manage Users</div>
          <div className="page-sub">All platform users</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setAddModal(true); setMessage(''); }}>+ Add User</button>
      </div>

      {message && (
        <div style={{
          background: message.startsWith('✅') ? '#d1fae5' : '#fee2e2',
          border: `1px solid ${message.startsWith('✅') ? '#6ee7b7' : '#fca5a5'}`,
          borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '14px',
          color: message.startsWith('✅') ? '#065f46' : '#dc2626',
        }}>{message}</div>
      )}

      <div className="tab-bar">
        {tabs.map((t, i) => (
          <div key={t} className={`tab ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>
            {t} ({i === 0 ? users.length : users.filter(u => u.role === roleFilter[i]).length})
          </div>
        ))}
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>{['Name', 'Email', 'Username', 'Role', 'Status', 'Action'].map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => {
              const initials = u.full_name
                ? u.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
                : (u.username || 'U')[0].toUpperCase();
              return (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="avatar" style={{ background: colors[i % colors.length], width: '32px', height: '32px', fontSize: '11px' }}>
                        {initials}
                      </div>
                      <span style={{ fontWeight: '600' }}>{u.full_name || u.username}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--edu-sub)' }}>{u.email}</td>
                  <td style={{ color: 'var(--edu-sub)' }}>{u.username}</td>
                  <td>
                    <span className={`badge badge-${u.role === 'admin' ? 'danger' : u.role === 'trainer' ? 'info' : 'purple'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td><span className="badge badge-success">Active</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(u)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleRemove(u.id)}>Remove</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px', color: 'var(--edu-sub)', fontSize: '13px' }}>
            No users found.
          </p>
        )}
      </div>

      {/* Add User Modal */}
      {addModal && (
        <Modal onClose={() => setAddModal(false)}>
          <div className="modal-title">Add New User</div>
          <div className="grid-2">
            <div className="form-group">
              <label className="label">First Name</label>
              <input className="input" placeholder="John" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="label">Last Name</label>
              <input className="input" placeholder="Doe" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="john@edu.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="label">Username</label>
            <input className="input" placeholder="johndoe" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="label">Role</label>
            <select className="input" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
              {['student','trainer','admin'].map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setAddModal(false)}>Cancel</button>
            <button className="btn btn-primary" style={{ flex: 1, opacity: saving ? 0.7 : 1 }} onClick={handleAdd} disabled={saving}>
              {saving ? '⏳ Creating...' : 'Create User'}
            </button>
          </div>
        </Modal>
      )}

      {/* Edit User Modal */}
      {editModal && (
        <Modal onClose={() => setEditModal(null)}>
          <div className="modal-title">Edit User — {editModal.username}</div>
          <div className="grid-2">
            <div className="form-group">
              <label className="label">First Name</label>
              <input className="input" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="label">Last Name</label>
              <input className="input" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Email</label>
            <input className="input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="label">Role</label>
            <select className="input" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
              {['student','trainer','admin'].map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setEditModal(null)}>Cancel</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => {
              setUsers(prev => prev.map(u => u.id === editModal.id ? { ...u, ...form } : u));
              setEditModal(null);
            }}>
              Save Changes
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ManageUsers;