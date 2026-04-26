import React, { useState, useEffect } from 'react';
import { coursesAPI, assignmentsAPI } from '../../services/api';
import '../../App.css';

const CLOUD_NAME    = process.env.REACT_APP_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_UPLOAD_PRESET;

// ─── Debug: remove these two lines once working ───────────────────────────────
console.log("Cloud:", CLOUD_NAME);
console.log("Preset:", UPLOAD_PRESET);
// ─────────────────────────────────────────────────────────────────────────────

const UploadContent = () => {
  const [courses, setCourses]   = useState([]);
  const [videoForm, setVideoForm] = useState({ courseId: '', title: '', order: 1 });
  const [videoFile, setVideoFile] = useState(null);
  const [assignForm, setAssignForm] = useState({ courseId: '', title: '', due: '', instructions: '' });
  const [uploadMsg, setUploadMsg]   = useState('');
  const [assignMsg, setAssignMsg]   = useState('');
  const [uploading, setUploading]   = useState(false);
  const [publishing, setPublishing] = useState(false);

//Fetch Trainer Courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await coursesAPI.myCourses();
        const list = Array.isArray(data) ? data : data?.results || [];
        setCourses(list);
        if (list.length > 0) {
          setVideoForm(v => ({ ...v, courseId: list[0].id }));
          setAssignForm(a => ({ ...a, courseId: list[0].id }));
        }
      } catch (err) { console.error(err); }
    };
    fetchCourses();
  }, []);

//  Upload Video to Cloudinary + Save to Backend
  const handleUploadVideo = async () => {
    console.log("Uploading started");
    if (!videoForm.title) { setUploadMsg('❌ Please enter a lesson title.'); return; }
    if (!videoForm.courseId) { setUploadMsg('❌ Please select a course.'); return; }
    if (!videoFile) { setUploadMsg('❌ Select a video file'); return; }
    
    // ✅ FIXED: guard against missing .env vars BEFORE hitting Cloudinary
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setUploadMsg('❌ Cloudinary config missing. Add REACT_APP_CLOUD_NAME and REACT_APP_UPLOAD_PRESET to your .env and restart.');
      return;
    }

    setUploading(true);
    setUploadMsg('');

    try {
      //Step 1: Upload file to Cloudinary 
      const cloudForm = new FormData();
      cloudForm.append('file', videoFile);
      cloudForm.append('upload_preset', UPLOAD_PRESET);
      
      console.log("Sending to Cloudinary...");

      // Upload to Cloudinary
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
        {
          method: "POST",
          body: cloudForm
        }
      );
      const data = await res.json();
      // ✅ FIXED: check Cloudinary response before using secure_url
      if (!data.secure_url) {
          console.error('Cloudinary error:', data);
          setUploadMsg('❌ Cloudinary upload failed: ' + (data.error?.message || 'Check cloud name & preset'));
          return;
          }
    // Cloudinary URL
      const videoUrl = data.secure_url;
    
    // ── Step 2: Save lesson to Django backend ─────────────────────────────
      // ✅ FIXED: send as FormData so api.js correctly drops Content-Type header
      const lessonForm = new FormData();
      lessonForm.append('title', videoForm.title);
      lessonForm.append('order', videoForm.order);
      lessonForm.append('video_url', videoUrl);
      await coursesAPI.createLesson(videoForm.courseId, lessonForm);
      setUploadMsg('✅ Lesson uploaded successfully!');
      setVideoForm(v => ({ ...v, title: '' }));
      setVideoFile(null);
      
    } catch (err) {
      console.error(err);
      setUploadMsg('❌ Upload failed: ' + (err?.detail || err?.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  // create Assignment
  const handlePublishAssignment = async () => {
    if (!assignForm.title) { setAssignMsg('❌ Please enter assignment title.'); return; }
    if (!assignForm.due)   { setAssignMsg('❌ Please select a due date.'); return; }
    if (!assignForm.courseId) { setAssignMsg('❌ Please select a course.'); return; }

    setPublishing(true);
    setAssignMsg('');
    try {
      await assignmentsAPI.create({
        course:       assignForm.courseId,
        title:        assignForm.title,
        due_date:     assignForm.due,
        instructions: assignForm.instructions,
        max_score:    100,
      });
      setAssignMsg('✅ Assignment published successfully!');
      setAssignForm(a => ({ ...a, title: '', due: '', instructions: '' }));
    } catch (err) {
      setAssignMsg('❌ Failed to create assignment'+ (err?.detail || 'Unknown error'));
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-title">Upload Content</div>
      <div className="page-sub">Add videos, assignments, and materials</div>

      <div className="grid-2">
        {/* Upload Video */}
        <div className="card">
          <div className="card-title">Upload Video Lesson</div>

          {uploadMsg && (
            <div style={{
              background: uploadMsg.startsWith('✅') ? '#d1fae5' : '#fee2e2',
              border: `1px solid ${uploadMsg.startsWith('✅') ? '#6ee7b7' : '#fca5a5'}`,
              borderRadius: '8px', padding: '8px 12px', fontSize: '13px', marginBottom: '12px',
              color: uploadMsg.startsWith('✅') ? '#065f46' : '#dc2626',
            }}>{uploadMsg}</div>
          )}

          <div className="form-group">
            <label className="label">Select Course</label>
            <select className="input" value={videoForm.courseId} 
              onChange={e => setVideoForm({ ...videoForm, courseId: e.target.value })}>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              {courses.length === 0 && <option value="">No courses available</option>}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Lesson Title</label>
            <input className="input" placeholder="e.g. Advanced React Patterns" value={videoForm.title} onChange={e => setVideoForm({ ...videoForm, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Lesson Order</label>
            <input className="input" type="number" min="1" value={videoForm.order} onChange={e => setVideoForm({ ...videoForm, order: e.target.value })} />
          </div>

          {/* Upload Zone */}
          <div
            className="upload-zone"
            style={{ marginBottom: '14px' }}
            onClick={() => document.getElementById('videoFileInput').click()}
          >
            <p style={{ fontSize: '28px', marginBottom: '8px' }}>🎬</p>
            <p style={{ fontSize: '13px', color: 'var(--edu-sub)' }}>
              {videoFile ? `✅ ${videoFile.name}` : 'Click to select MP4 video (max 2GB)'}
            </p>
            <input
              id="videoFileInput"
              type="file"
              accept="video/mp4,video/*"
              style={{ display: 'none' }}
              onChange={e => setVideoFile(e.target.files[0])}
            />
          </div>

          <button
            className="btn btn-primary btn-full"
            onClick={handleUploadVideo}
            disabled={uploading}
            style={{ opacity: uploading ? 0.7 : 1 }}
          >
            {uploading ? '⏳ Uploading...' : 'Upload Video'}
          </button>
        </div>

        {/* Create Assignment */}
        <div className="card">
          <div className="card-title">Create Assignment</div>

          {assignMsg && (
            <div style={{
              background: assignMsg.startsWith('✅') ? '#d1fae5' : '#fee2e2',
              border: `1px solid ${assignMsg.startsWith('✅') ? '#6ee7b7' : '#fca5a5'}`,
              borderRadius: '8px', padding: '8px 12px', fontSize: '13px', marginBottom: '12px',
              color: assignMsg.startsWith('✅') ? '#065f46' : '#dc2626',
            }}>{assignMsg}</div>
          )}

          <div className="form-group">
            <label className="label">Select Course</label>
            <select className="input" value={assignForm.courseId} onChange={e => setAssignForm({ ...assignForm, courseId: e.target.value })}>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              {courses.length === 0 && <option value="">No courses available</option>}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Assignment Title</label>
            <input className="input" placeholder="e.g. Final Portfolio" value={assignForm.title} onChange={e => setAssignForm({ ...assignForm, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Due Date</label>
            <input className="input" type="date" value={assignForm.due} onChange={e => setAssignForm({ ...assignForm, due: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Instructions</label>
            <textarea className="input" rows={4} placeholder="Describe the assignment in detail..." value={assignForm.instructions} onChange={e => setAssignForm({ ...assignForm, instructions: e.target.value })} />
          </div>

          <button
            className="btn btn-primary btn-full"
            onClick={handlePublishAssignment}
            disabled={publishing}
            style={{ opacity: publishing ? 0.7 : 1 }}
          >
            {publishing ? '⏳ Publishing...' : 'Publish Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadContent;