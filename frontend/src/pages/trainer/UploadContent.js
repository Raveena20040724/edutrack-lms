import React, { useState } from 'react';
import { MOCK_COURSES } from '../../data/mockData';
import '../../App.css';

const UploadContent = () => {
  const [videoForm, setVideoForm] = useState({ courseId: 1, title: '' });
  const [assignForm, setAssignForm] = useState({ courseId: 1, title: '', due: '', instructions: '' });

  return (
    <div className="fade-in">
      <div className="page-title">Upload Content</div>
      <div className="page-sub">Add videos, assignments, and materials</div>

      <div className="grid-2">
        {/* Upload Video */}
        <div className="card">
          <div className="card-title">Upload Video Lesson</div>
          <div className="form-group">
            <label className="label">Select Course</label>
            <select className="input" value={videoForm.courseId} onChange={(e) => setVideoForm({ ...videoForm, courseId: Number(e.target.value) })}>
              {MOCK_COURSES.slice(0, 3).map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Lesson Title</label>
            <input className="input" placeholder="e.g. Advanced React Patterns" value={videoForm.title} onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })} />
          </div>
          <div className="upload-zone" style={{ marginBottom: '14px' }}>
            <p style={{ fontSize: '24px', marginBottom: '8px' }}>🎬</p>
            <p style={{ fontSize: '13px', color: 'var(--edu-sub)' }}>Upload MP4 video (max 2GB)</p>
          </div>
          <button className="btn btn-primary btn-full">Upload Video</button>
        </div>

        {/* Create Assignment */}
        <div className="card">
          <div className="card-title">Create Assignment</div>
          <div className="form-group">
            <label className="label">Select Course</label>
            <select className="input" value={assignForm.courseId} onChange={(e) => setAssignForm({ ...assignForm, courseId: Number(e.target.value) })}>
              {MOCK_COURSES.slice(0, 3).map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Assignment Title</label>
            <input className="input" placeholder="e.g. Final Portfolio" value={assignForm.title} onChange={(e) => setAssignForm({ ...assignForm, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Due Date</label>
            <input className="input" type="date" value={assignForm.due} onChange={(e) => setAssignForm({ ...assignForm, due: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Instructions</label>
            <textarea className="input" rows={3} placeholder="Describe the assignment..." value={assignForm.instructions} onChange={(e) => setAssignForm({ ...assignForm, instructions: e.target.value })} />
          </div>
          <button className="btn btn-primary btn-full">Publish Assignment</button>
        </div>
      </div>
    </div>
  );
};

export default UploadContent;
