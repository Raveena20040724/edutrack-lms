import React, { useState, useEffect } from 'react';
import { coursesAPI } from '../../services/api';
import '../../App.css';

const VideoPlayer = () => {
  const [enrollments, setEnrollments]     = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessons, setLessons]             = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [playing, setPlaying]             = useState(false);
  const [doneLessons, setDoneLessons]     = useState([]);
  const [loading, setLoading]             = useState(true);
  const [lessonLoading, setLessonLoading] = useState(false);

  // Step 1 — fetch enrolled courses
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const data = await coursesAPI.myEnrollments();
        const list = Array.isArray(data) ? data : data?.results || [];
        setEnrollments(list);
        if (list.length > 0) {
          setSelectedCourse(list[0]);
        }
      } catch (err) {
        console.error('Error fetching enrollments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  // Step 2 — fetch lessons when course changes
  useEffect(() => {
    if (!selectedCourse) return;
    const fetchLessons = async () => {
      setLessonLoading(true);
      try {
        const data = await coursesAPI.getLessons(selectedCourse.course);
        const list = Array.isArray(data) ? data : data?.results || [];
        setLessons(list);
        setSelectedLesson(list[0] || null);
        setPlaying(false);

        // fetch progress
        const progress = await coursesAPI.getLessonProgress(selectedCourse.course);
        const progList = Array.isArray(progress) ? progress : progress?.results || [];
        setDoneLessons(progList.filter((p) => p.completed).map((p) => p.lesson));
      } catch (err) {
        console.error('Error fetching lessons:', err);
      } finally {
        setLessonLoading(false);
      }
    };
    fetchLessons();
  }, [selectedCourse]);

  const handleMarkDone = async () => {
    if (!selectedLesson || !selectedCourse) return;
    try {
      await coursesAPI.markLessonDone(selectedCourse.course, selectedLesson.id);
      setDoneLessons((prev) => [...prev, selectedLesson.id]);
    } catch (err) {
      console.error('Error marking lesson done:', err);
    }
  };

  const active = selectedLesson;

  if (loading) {
    return (
      <div className="fade-in" style={{ textAlign: 'center', padding: '60px', color: 'var(--edu-sub)' }}>
        ⏳ Loading your courses...
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <div className="fade-in" style={{ textAlign: 'center', padding: '60px' }}>
        <p style={{ fontSize: '48px', marginBottom: '12px' }}>🎬</p>
        <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: 'var(--edu-text)' }}>
          No courses enrolled
        </p>
        <p style={{ fontSize: '13px', color: 'var(--edu-sub)' }}>
          Enroll in a course first to watch videos.
        </p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '18px' }}>

        {/* ── Video Area ──────────────────────────────────────────────────── */}
        <div>

          {/* ✅ FIXED: real HTML5 video player using Cloudinary URL */}
          <div style={{
            borderRadius: '12px', overflow: 'hidden',
            background: '#000', marginBottom: '16px',
            aspectRatio: '16/9', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            {active?.video_url ? (
              // key forces remount when lesson changes — stops old video playing
              <video
                key={active.video_url}
                controls
                style={{ width: '100%', height: '100%', display: 'block' }}
                onEnded={handleMarkDone}
              >
                <source src={active.video_url} type="video/mp4" />
                Your browser does not support video playback.
              </video>
            ) : active && !active.video_url ? (
              // lesson exists but no video URL saved
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '40px' }}>
                <p style={{ fontSize: '40px', marginBottom: '10px' }}>🎬</p>
                <p style={{ fontSize: '14px' }}>No video available for this lesson yet.</p>
              </div>
            ) : (
              // no lesson selected
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '40px' }}>
                <p style={{ fontSize: '40px', marginBottom: '10px' }}>▶</p>
                <p style={{ fontSize: '14px' }}>Select a lesson to start watching</p>
              </div>
            )}
          </div>

          <div className="card">
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px', fontFamily: 'var(--syne)' }}>
              {active?.title || 'Select a lesson'}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--edu-sub)', marginBottom: '12px' }}>
              {selectedCourse?.course_title} • {active?.duration || '—'}
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-primary btn-sm" onClick={handleMarkDone}>
                {doneLessons.includes(active?.id) ? '✓ Done' : 'Mark as Done'}
              </button>
              {active?.material && (
                <a href={active.material} target="_blank" rel="noreferrer">
                  <button className="btn btn-ghost btn-sm">Download Materials</button>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Lesson List */}
        <div className="card" style={{ padding: '14px' }}>
          {/* Course Switcher */}
          <div className="form-group">
            <label className="label">Course</label>
            <select
              className="input"
              value={selectedCourse?.course || ''}
              onChange={(e) => {
                const found = enrollments.find((en) => String(en.course) === e.target.value);
                if (found) { setSelectedCourse(found); setSelectedLesson(null); }
              }}
            >
              {enrollments.map((en) => (
                <option key={en.course} value={en.course}>
                  {en.course_title}
                </option>
              ))}
            </select>
          </div>

          <div className="card-title" style={{ marginTop: '8px' }}>Lessons</div>

          {lessonLoading && (
            <p style={{ fontSize: '13px', color: 'var(--edu-sub)', textAlign: 'center', padding: '20px' }}>
              ⏳ Loading lessons...
            </p>
          )}

          {!lessonLoading && lessons.length === 0 && (
            <p style={{ fontSize: '13px', color: 'var(--edu-sub)', textAlign: 'center', padding: '20px' }}>
              No lessons uploaded yet.
            </p>
          )}

          {!lessonLoading && lessons.map((l, i) => (
            <div
              key={l.id}
              className={`lesson-item ${active?.id === l.id ? 'active' : ''}`}
              onClick={() => { setSelectedLesson(l); setPlaying(false); }}
            >
              <div
                className="lesson-num"
                style={{
                  background: doneLessons.includes(l.id)
                    ? 'var(--edu-success)'
                    : active?.id === l.id ? 'var(--edu-accent)' : '#e2e8f0',
                  color: doneLessons.includes(l.id) || active?.id === l.id ? '#fff' : 'var(--edu-sub)',
                }}
              >
                {doneLessons.includes(l.id) ? '✓' : i + 1}
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: '600' }}>{l.title}</p>
                <p style={{ fontSize: '11px', color: 'var(--edu-sub)' }}>{l.duration || '—'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;