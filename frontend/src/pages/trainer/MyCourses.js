import React, { useState } from 'react';
import { MOCK_COURSES } from '../../data/mockData';
import Modal from '../../components/Modal';
import '../../App.css';

const MyCourses = ({ onNavigate }) => {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'Design', duration: '', description: '' });

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div className="page-title">My Courses</div>
          <div className="page-sub">Manage your teaching content</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ New Course</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
        {MOCK_COURSES.slice(0, 3).map((c) => (
          <div key={c.id} className="course-card">
            <span style={{ fontSize: '32px' }}>{c.icon}</span>
            <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '10px 0 4px' }}>{c.title}</h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <span className="badge badge-info">{c.category}</span>
              <span className="badge badge-success">{c.enrolled} students</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-ghost btn-sm">Edit</button>
              <button className="btn btn-primary btn-sm" onClick={() => onNavigate('upload')}>Upload Video</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal onClose={() => setModal(false)}>
          <div className="modal-title">Create New Course</div>
          <div className="form-group">
            <label className="label">Course Title</label>
            <input className="input" placeholder="e.g. Advanced Machine Learning" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {['Design', 'Development', 'Data', 'DevOps', 'Marketing'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Duration</label>
            <input className="input" placeholder="e.g. 8 weeks" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Description</label>
            <textarea className="input" rows={3} placeholder="What will students learn?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setModal(false)}>Cancel</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setModal(false)}>Create Course</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyCourses;
