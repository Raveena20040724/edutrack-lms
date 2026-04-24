import React, { useState, useEffect } from 'react';
import { coursesAPI } from '../../services/api';
import Modal from '../../components/Modal';
import '../../App.css';

const BrowseCourses = () => {
  const [courses, setCourses]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage]   = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await coursesAPI.list();
        setCourses(Array.isArray(data) ? data : data?.results || []);
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    setEnrolling(true);
    try {
      await coursesAPI.enroll(courseId);
      setCourses((prev) =>
        prev.map((c) => c.id === courseId ? { ...c, is_enrolled: true, enrolled_count: c.enrolled_count + 1 } : c)
      );
      setMessage('✅ Enrolled successfully!');
      setModal(null);
    } catch (err) {
      setMessage('❌ ' + (err.detail || 'Enrollment failed.'));
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="fade-in" style={{ textAlign: 'center', padding: '60px', color: 'var(--edu-sub)' }}>
        ⏳ Loading courses...
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-title">Browse Courses</div>
      <div className="page-sub">Explore all available courses</div>

      {message && (
        <div style={{
          background: message.startsWith('✅') ? '#d1fae5' : '#fee2e2',
          border: `1px solid ${message.startsWith('✅') ? '#6ee7b7' : '#fca5a5'}`,
          borderRadius: '8px', padding: '10px 14px',
          fontSize: '13px', marginBottom: '16px',
          color: message.startsWith('✅') ? '#065f46' : '#dc2626',
        }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
        {courses.map((c) => (
          <div key={c.id} className="course-card">
            <span style={{ fontSize: '32px' }}>{c.icon || '📚'}</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '10px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700' }}>{c.title}</h3>
              <span className="badge badge-info">{c.category}</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--edu-sub)', margin: '4px 0 10px' }}>
              {c.description}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--edu-sub)', marginBottom: '12px' }}>
              <span>⭐ {c.rating || 'N/A'}</span>
              <span>👥 {c.enrolled_count || 0} students</span>
              <span>📹 {c.lesson_count || 0} lessons</span>
            </div>
            {c.is_enrolled
              ? <button className="btn btn-ghost btn-sm" style={{ width: '100%' }}>✓ Enrolled</button>
              : <button
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => setModal(c)}
                >
                  Enroll Now
                </button>
            }
          </div>
        ))}
      </div>

      {modal && (
        <Modal onClose={() => setModal(null)}>
          <div className="modal-title">Enroll in Course</div>
          <p style={{ fontSize: '36px', textAlign: 'center', margin: '10px 0' }}>{modal.icon || '📚'}</p>
          <p style={{ fontWeight: '700', fontSize: '16px', textAlign: 'center', marginBottom: '8px' }}>
            {modal.title}
          </p>
          <p style={{ color: 'var(--edu-sub)', fontSize: '13px', textAlign: 'center', marginBottom: '18px' }}>
            {modal.description}
          </p>
          <button
            className="btn btn-primary"
            style={{ width: '100%', opacity: enrolling ? 0.7 : 1 }}
            onClick={() => handleEnroll(modal.id)}
            disabled={enrolling}
          >
            {enrolling ? '⏳ Enrolling...' : 'Confirm Enrollment'}
          </button>
        </Modal>
      )}
    </div>
  );
};

export default BrowseCourses;