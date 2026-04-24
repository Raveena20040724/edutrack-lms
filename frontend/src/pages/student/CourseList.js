import React, { useState, useEffect } from 'react';
import { coursesAPI } from '../../services/api';
import '../../App.css';

const CourseList = ({ onNavigate }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const data = await coursesAPI.myEnrollments();
        setEnrollments(Array.isArray(data) ? data : data?.results || []);
      } catch (err) {
        console.error('Error fetching enrollments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  if (loading) {
    return (
      <div className="fade-in" style={{ textAlign: 'center', padding: '60px', color: 'var(--edu-sub)' }}>
        ⏳ Loading courses...
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-title">My Courses</div>
      <div className="page-sub">Courses you are enrolled in</div>

      {enrollments.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--edu-sub)' }}>
          <p style={{ fontSize: '48px', marginBottom: '12px' }}>📚</p>
          <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No courses yet</p>
          <p style={{ fontSize: '13px', marginBottom: '16px' }}>Browse and enroll in courses to get started</p>
          <button className="btn btn-primary" onClick={() => onNavigate('browse')}>
            Browse Courses
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
        {enrollments.map((e) => (
          <div key={e.id} className="course-card">
            <span style={{ fontSize: '32px' }}>{e.course_icon || '📚'}</span>
            <h3 style={{ margin: '12px 0 4px', fontSize: '15px', fontWeight: '700' }}>
              {e.course_title}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--edu-sub)', marginBottom: '10px' }}>
              {e.course_duration}
            </p>
            <div className="progress-bar" style={{ marginBottom: '8px' }}>
              <div className="progress-fill" style={{ width: `${e.progress || 0}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--edu-sub)' }}>
                {e.progress || 0}% complete
              </span>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onNavigate('videos')}
              >
                Open
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;