import React, { useState, useEffect, useRef } from 'react';
import { coursesAPI } from '../../services/api';
import '../../App.css';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [enrollments, setEnrollments]     = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessons, setLessons]             = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [doneLessons, setDoneLessons]     = useState([]);
  const [loading, setLoading]             = useState(true);
  const [lessonLoading, setLessonLoading] = useState(false);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !selectedLesson) return;
    
    // Logic: Auto-mark as done if 90% watched
    const progress = (video.currentTime / video.duration) * 100;
    if (progress > 90 && !doneLessons.includes(selectedLesson.id)) {
      handleMarkDone();
    }
  };

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const data = await coursesAPI.myEnrollments();
        const list = Array.isArray(data) ? data : data?.results || [];
        setEnrollments(list);
        if (list.length > 0) setSelectedCourse(list[0]);
      } catch (err) {
        console.error('Error fetching enrollments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    const fetchLessons = async () => {
      setLessonLoading(true);
      try {
        const data = await coursesAPI.getLessons(selectedCourse.course);
        const list = Array.isArray(data) ? data : data?.results || [];
        setLessons(list);
        setSelectedLesson(list[0] || null);

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
    if (!selectedLesson || !selectedCourse || doneLessons.includes(selectedLesson.id)) return;
    try {
      await coursesAPI.markLessonDone(selectedCourse.course, selectedLesson.id);
      setDoneLessons((prev) => [...prev, selectedLesson.id]);
    } catch (err) {
      console.error('Error marking lesson done:', err);
    }
  };

  const active = selectedLesson;

  if (loading) return <div className="fade-in" style={{ textAlign: 'center', padding: '60px' }}>⟳ Loading...</div>;

  return (
    <div className="fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '18px' }}>
        <div>
          <div style={{ borderRadius: '12px', overflow: 'hidden', background: '#000', marginBottom: '16px', aspectRatio: '16/9' }}>
            {lessonLoading && (
              <div style={{
                position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)',
                zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(4px)', color: '#fff'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ animation: 'pulse 1.5s infinite' }}>⟳ Switching Lesson...</p>
                </div>
              </div>
            )}
            {active?.video_url ? (
              <video
                ref={videoRef}
                key={active.video_url}
                controls
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleMarkDone}
                style={{ width: '100%', height: '100%' }}
              >
                <source src={active.video_url} type="video/mp4" />
              </video>
            ) : (
              <div style={{ color: '#fff', padding: '40px', textAlign: 'center' }}>No Video Available</div>
            )}
          </div>
          
          <div className="card">
            <h2>{active?.title || 'Select a lesson'}</h2>
            <button className="btn btn-primary btn-sm" onClick={handleMarkDone}>
              {doneLessons.includes(active?.id) ? '✓ Done' : 'Mark as Done'}
            </button>
          </div>
        </div>

        <div className="card">
          <select 
            className="input" 
            value={selectedCourse?.course || ''} 
            onChange={(e) => {
              const found = enrollments.find((en) => String(en.course) === e.target.value);
              if (found) setSelectedCourse(found);
            }}
          >
            {enrollments.map((en) => <option key={en.course} value={en.course}>{en.course_title}</option>)}
          </select>
          <div className="card-title">Lessons</div>
          {lessons.map((l, i) => (
            <div 
              key={l.id} 
              className={`lesson-item ${active?.id === l.id ? 'active' : ''}`}
              onClick={() => setSelectedLesson(l)}
            >
              {l.title} {doneLessons.includes(l.id) && '✓'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;