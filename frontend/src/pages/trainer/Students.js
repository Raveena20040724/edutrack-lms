import React, { useState, useEffect } from 'react';
import { coursesAPI } from '../../services/api';
import '../../App.css';

const Students = () => {
  const [courses, setCourses]   = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await coursesAPI.myCourses();
        const list = Array.isArray(data) ? data : data?.results || [];
        setCourses(list);
        if (list.length > 0) {
          setSelected(list[0].id);
          fetchStudents(list[0].id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error:', err);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const fetchStudents = async (courseId) => {
    setLoading(true);
    try {
      const data = await coursesAPI.getCourseStudents(courseId);
      setStudents(Array.isArray(data) ? data : data?.results || []);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (courseId) => {
    setSelected(courseId);
    fetchStudents(courseId);
  };

  const colors = ['#4f46e5','#06b6d4','#10b981','#f59e0b','#ef4444','#8b5cf6'];

  return (
    <div className="fade-in">
      <div className="page-title">Students</div>
      <div className="page-sub">Students enrolled in your courses</div>

      {/* Course Filter */}
      {courses.length > 0 && (
        <div className="form-group" style={{ maxWidth: '320px', marginBottom: '16px' }}>
          <label className="label">Filter by Course</label>
          <select className="input" value={selected || ''} onChange={e => handleCourseChange(parseInt(e.target.value))}>
            {courses.map(c => <option key={c.id} value={c.id}>{c.icon || '📚'} {c.title}</option>)}
          </select>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--edu-sub)' }}>⏳ Loading students...</div>
      ) : students.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '48px', marginBottom: '12px' }}>👥</p>
          <p style={{ color: 'var(--edu-sub)', fontSize: '14px' }}>No students enrolled yet in this course.</p>
        </div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>{['Student','Email','Progress','Enrolled On'].map(h=><th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {students.map((s, i) => {
                const initials = s.name
                  ? s.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)
                  : 'S';
                return (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="avatar" style={{ background: colors[i % colors.length], width: '32px', height: '32px', fontSize: '11px' }}>
                          {initials}
                        </div>
                        <span style={{ fontWeight: '600' }}>{s.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--edu-sub)' }}>{s.email}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="progress-bar" style={{ width: '80px' }}>
                          <div className="progress-fill" style={{ width: `${s.progress || 0}%` }} />
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--edu-sub)' }}>{s.progress || 0}%</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--edu-sub)' }}>
                      {s.enrolled_at ? new Date(s.enrolled_at).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Students;