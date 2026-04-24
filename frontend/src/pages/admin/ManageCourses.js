import React, { useState, useEffect } from 'react';
import { coursesAPI } from '../../services/api';
import Modal from '../../components/Modal';
import '../../App.css';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [form, setForm]       = useState({ title: '', category: 'design', duration: '', description: '', icon: '📚' });
  const [saving, setSaving]   = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await coursesAPI.adminAllCourses();
      setCourses(Array.isArray(data) ? data : data?.results || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Remove this course?')) return;
    try {
      await coursesAPI.delete(id);
      setCourses(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert(err.detail || 'Failed to remove course.');
    }
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      await coursesAPI.create(form);
      setMessage('✅ Course created!');
      setModal(false);
      fetchCourses();
    } catch (err) {
      setMessage('❌ ' + (err.detail || JSON.stringify(err)));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="fade-in" style={{ textAlign: 'center', padding: '60px', color: 'var(--edu-sub)' }}>
      ⏳ Loading courses...
    </div>
  );

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div>
          <div className="page-title">Manage Courses</div>
          <div className="page-sub">All platform courses</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ New Course</button>
      </div>

      {message && (
        <div style={{
          background: message.startsWith('✅') ? '#d1fae5' : '#fee2e2',
          border: `1px solid ${message.startsWith('✅') ? '#6ee7b7' : '#fca5a5'}`,
          borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '14px',
          color: message.startsWith('✅') ? '#065f46' : '#dc2626',
        }}>{message}</div>
      )}

      <div className="card">
        <table>
          <thead>
            <tr>{['Course','Category','Instructor','Students','Rating','Status','Action'].map(h=><th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {courses.map((c, i) => (
              <tr key={i}>
                <td style={{ fontWeight: '600' }}>{c.icon || '📚'} {c.title}</td>
                <td><span className="badge badge-info">{c.category}</span></td>
                <td>{c.instructor_name || '—'}</td>
                <td>{c.enrolled_count || 0}</td>
                <td>⭐ {c.rating || 'N/A'}</td>
                <td><span className={`badge badge-${c.is_active ? 'success' : 'danger'}`}>{c.is_active ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => { setEditModal(c); setForm({ title: c.title, category: c.category, duration: c.duration, description: c.description, icon: c.icon || '📚' }); }}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleRemove(c.id)}>Remove</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {courses.length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px', color: 'var(--edu-sub)', fontSize: '13px' }}>No courses yet.</p>
        )}
      </div>

      {/* Create Modal */}
      {modal && (
        <Modal onClose={() => setModal(false)}>
          <div className="modal-title">Create New Course</div>
          <div className="form-group">
            <label className="label">Course Title</label>
            <input className="input" placeholder="e.g. Advanced Machine Learning" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
          </div>
          <div className="form-group">
            <label className="label">Icon (emoji)</label>
            <input className="input" placeholder="📚" value={form.icon} onChange={e=>setForm({...form,icon:e.target.value})} />
          </div>
          <div className="form-group">
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
              {[['design','Design'],['development','Development'],['data','Data Science'],['devops','DevOps'],['marketing','Marketing']].map(([v,l])=><option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Duration</label>
            <input className="input" placeholder="e.g. 8 weeks" value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} />
          </div>
          <div className="form-group">
            <label className="label">Description</label>
            <textarea className="input" rows={3} placeholder="What will students learn?" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setModal(false)}>Cancel</button>
            <button className="btn btn-primary" style={{ flex: 1, opacity: saving ? 0.7 : 1 }} onClick={handleCreate} disabled={saving}>
              {saving ? '⏳ Creating...' : 'Create Course'}
            </button>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {editModal && (
        <Modal onClose={() => setEditModal(null)}>
          <div className="modal-title">Edit Course</div>
          <div className="form-group">
            <label className="label">Course Title</label>
            <input className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
          </div>
          <div className="form-group">
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
              {[['design','Design'],['development','Development'],['data','Data Science'],['devops','DevOps'],['marketing','Marketing']].map(([v,l])=><option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Duration</label>
            <input className="input" value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} />
          </div>
          <div className="form-group">
            <label className="label">Description</label>
            <textarea className="input" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setEditModal(null)}>Cancel</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={async () => {
              try {
                await coursesAPI.update(editModal.id, form);
                setCourses(prev => prev.map(c => c.id === editModal.id ? { ...c, ...form } : c));
                setEditModal(null);
              } catch (err) { alert(err.detail || 'Update failed.'); }
            }}>Save Changes</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ManageCourses;