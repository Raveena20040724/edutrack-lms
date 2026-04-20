import React, { useState, useEffect } from 'react';
import { coursesAPI, assignmentsAPI } from '../../services/api';
import '../../App.css';

const TrainerDashboard = ({ onNavigate }) => {
  const [courses, setCourses]     = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, analyticsData] = await Promise.all([
          coursesAPI.myCourses(),
          assignmentsAPI.trainerAnalytics(),
        ]);
        setCourses(Array.isArray(coursesData) ? coursesData : coursesData?.results || []);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error('Trainer dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalStudents = courses.reduce((sum, c) => sum + (c.enrolled_count || 0), 0);
  const avgRating     = courses.length
    ? (courses.reduce((s, c) => s + (c.rating || 0), 0) / courses.length).toFixed(1)
    : 'N/A';

  const stats = [
    { label: 'Active Courses',  value: courses.length,                       c: 'var(--edu-accent)'  },
    { label: 'Total Students',  value: totalStudents,                         c: 'var(--edu-accent2)' },
    { label: 'Pending Grades',  value: analytics?.pending_count || 0,         c: 'var(--edu-warning)' },
    { label: 'Avg Rating',      value: avgRating,                             c: 'var(--edu-success)' },
  ];

  if (loading) return (
    <div className="fade-in" style={{ textAlign: 'center', padding: '60px', color: 'var(--edu-sub)' }}>
      ⏳ Loading dashboard...
    </div>
  );

  const pending = analytics?.pending_submissions || [];
  const maxEnrolled = Math.max(...courses.map(c => c.enrolled_count || 0), 1);

  return (
    <div className="fade-in">
      <div className="page-title">Trainer Dashboard</div>
      <div className="page-sub">Overview of your courses and students</div>

      <div className="grid-4" style={{ marginBottom: '20px' }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ '--c': s.c }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-val" style={{ fontSize: '28px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Course Performance Chart */}
        <div className="card">
          <div className="card-title">Course Enrollment</div>
          {courses.length === 0 && (
            <p style={{ color: 'var(--edu-sub)', fontSize: '13px' }}>No courses yet. Create your first course!</p>
          )}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px', padding: '10px 0 0' }}>
            {courses.slice(0, 6).map((c, i) => {
              const pct = Math.max(((c.enrolled_count || 0) / maxEnrolled) * 100, 4);
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '9px', color: 'var(--edu-sub)', fontWeight: '600' }}>{c.enrolled_count || 0}</span>
                  <div style={{ width: '100%', height: `${pct}%`, background: 'var(--edu-accent)', borderRadius: '4px 4px 0 0', opacity: 0.85, minHeight: '4px' }} />
                  <span style={{ fontSize: '9px', color: 'var(--edu-sub)', fontWeight: '600', textAlign: 'center', maxWidth: '40px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {c.title.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Submissions */}
        <div className="card">
          <div className="card-title">Pending Submissions</div>
          {pending.length === 0 && (
            <p style={{ color: 'var(--edu-sub)', fontSize: '13px' }}>All caught up! 🎉</p>
          )}
          {pending.slice(0, 5).map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: '600' }}>{s.assignment_title}</p>
                <p style={{ fontSize: '11px', color: 'var(--edu-sub)' }}>{s.student_name} • {s.course_title}</p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => onNavigate('grade')}>Grade</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;