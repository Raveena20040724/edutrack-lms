                                                                                                                                                                                                         import React, { useState, useEffect } from 'react';
import { coursesAPI } from '../../services/api';
import Modal from '../../components/Modal';
import '../../App.css';

const MyCourses = ({ onNavigate }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModal, setAddModal]   = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [form, setForm] = useState({ title: '', category: 'design', duration: '', description: '', icon: '📚' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      const data = await coursesAPI.myCourses();
      setCourses(Array.isArray(data) ? data : data?.results || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    if (!form.title || !form.duration) { setMessage('❌ Please fill title and duration.'); return; }
    setSaving(true);
    try {
      await coursesAPI.create(form);
      setMessage('✅ Course created!');
      setAddModal(false);
      setForm({ title: '', category: 'design', duration: '', description: '', icon: '📚' });
      fetchCourses();
    } catch (err) {
      setMessage('❌ ' + (err.detail || JSON.stringify(err)));
    } finally { setSaving(false); }
  };

  const handleEdit = async () => {
    setSaving(true);
    try {
      await coursesAPI.update(editModal.id, form);
      setCourses(prev => prev.map(c => c.id === editModal.id ? { ...c, ...form } : c));
      setMessage('✅ Course updated!');
      setEditModal(null);
    } catch (err) {
      setMessage('❌ ' + (err.detail || 'Update failed.'));
    } finally { setSaving(false); }
  };

  const openEdit = (c) => {
    setEditModal(c);
    setForm({ title: c.title, category: c.category, duration: c.duration, description: c.description, icon: c.icon || '📚' });
  };

  if (loading) return (
    <div className="fade-in" style={{ textAlign: 'center', padding: '60px', color: 'var(--edu-sub)' }}>
      ⏳ Loading courses...
    </div>
  );

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div className="page-title">My Courses</div>
          <div className="page-sub">Manage your teaching content</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setAddModal(true); setMessage(''); }}>+ New Course</button>
      </div>

      {message && (
        <div style={{
          background: message.startsWith('✅') ? '#d1fae5' : '#fee2e2',
          border: `1px solid ${message.startsWith('✅') ? '#6ee7b7' : '#fca5a5'}`,
          borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '14px',
          color: message.startsWith('✅') ? '#065f46' : '#dc2626',
        }}>{message}</div>
      )}

      {courses.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--edu-sub)' }}>
          <p style={{ fontSize: '48px', marginBottom: '12px' }}>📚</p>
          <p style={{ fontSize: '14px', marginBottom: '16px' }}>No courses yet. Create your first course!</p>
          <button className="btn btn-primary" onClick={() => setAddModal(true)}>+ Create Course</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
        {courses.map((c) => (
          <div key={c.id} className="course-card">
            <span style={{ fontSize: '32px' }}>{c.icon || '📚'}</span>
            <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '10px 0 4px', lineHeight: 1.3 }}>{c.title}</h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span className="badge badge-info">{c.category}</span>
              <span className="badge badge-success">{c.enrolled_count || 0} students</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}>Edit</button>
              <button className="btn btn-primary btn-sm" onClick={() => onNavigate('upload')}>Upload Video</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {addModal && (
        <Modal onClose={() => setAddModal(false)}>
          <div className="modal-title">Create New Course</div>
          {message && <div style={{ color: message.startsWith('✅') ? '#065f46' : '#dc2626', fontSize: '13px', marginBottom: '10px' }}>{message}</div>}
          <div className="form-group">
            <label className="label">Icon (emoji)</label>
            <input className="input" placeholder="📚" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Course Title *</label>
            <input className="input" placeholder="e.g. Advanced Machine Learning" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {[['design','Design'],['development','Development'],['data','Data Science'],['devops','DevOps'],['marketing','Marketing']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Duration *</label>
            <input className="input" placeholder="e.g. 8 weeks" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Description</label>
            <textarea className="input" rows={3} placeholder="What will students learn?" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setAddModal(false)}>Cancel</button>
            <button className="btn btn-primary" style={{ flex: 1, opacity: saving ? 0.7 : 1 }} onClick={handleCreate} disabled={saving}>
              {saving ? '⏳ Creating...' : 'Create Course'}
            </button>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {editModal && (
        <Modal onClose={() => setEditModal(null)}>
          <div className="modal-title">Edit: {editModal.title}</div>
          <div className="form-group">
            <label className="label">Icon (emoji)</label>
            <input className="input" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Course Title</label>
            <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {[['design','Design'],['development','Development'],['data','Data Science'],['devops','DevOps'],['marketing','Marketing']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Duration</label>
            <input className="input" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Description</label>
            <textarea className="input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setEditModal(null)}>Cancel</button>
            <button className="btn btn-primary" style={{ flex: 1, opacity: saving ? 0.7 : 1 }} onClick={handleEdit} disabled={saving}>
              {saving ? '⏳ Saving...' : 'Save Changes'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyCourses;