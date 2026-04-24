import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { coursesAPI, assignmentsAPI } from '../../services/api';
import '../../App.css';

const Dashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [activity, setActivity]       = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrollData, assignData] = await Promise.all([
          coursesAPI.myEnrollments(),
          assignmentsAPI.mySubmissions(),
        ]);
        setEnrollments(Array.isArray(enrollData)      ? enrollData      : enrollData?.results      || []);
        setAssignments(Array.isArray(assignData)      ? assignData      : assignData?.results      || []);
        setActivity([
          { text: 'You logged in successfully',   time: 'Just now',     type: 'success' },
          { text: 'Check your assignments below', time: 'Today',        type: 'info'    },
          { text: 'Keep learning every day!',     time: 'Motivation 🔥', type: 'purple'  },
        ]);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pending = assignments.filter((a) => a.status === 'submitted');
  const graded  = assignments.filter((a) => a.status === 'graded');
  const avg     = graded.length
    ? Math.round(graded.reduce((s, a) => s + (a.percentage || 0), 0) / graded.length)
    : 0;

  const stats = [
    { label: 'Courses Enrolled',    value: enrollments.length, c: 'var(--edu-accent)'  },
    { label: 'Completed Lessons',   value: '—',                c: 'var(--edu-accent2)' },
    { label: 'Pending Assignments', value: pending.length,     c: 'var(--edu-warning)' },
    { label: 'Avg Score',           value: avg ? `${avg}%` : '—', c: 'var(--edu-success)' },
  ];

  if (loading) {
    return (
      <div className="fade-in" style={{ textAlign: 'center', padding: '60px', color: 'var(--edu-sub)' }}>
        ⏳ Loading dashboard...
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-title">Welcome Back, {user?.first_name || user?.username} 👋</div>
      <div className="page-sub">Here is your learning overview.</div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '20px' }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ '--c': s.c }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-val">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* My Courses */}
        <div className="card">
          <div className="card-title">My Courses</div>
          {enrollments.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--edu-sub)' }}>
              <p style={{ fontSize: '32px', marginBottom: '8px' }}>📚</p>
              <p style={{ fontSize: '13px' }}>No courses yet.</p>
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: '10px' }}
                onClick={() => onNavigate('browse')}
              >
                Browse Courses
              </button>
            </div>
          )}
          {enrollments.map((e) => (
            <div key={e.id} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>
                  {e.course_icon} {e.course_title}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--edu-sub)' }}>{e.progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${e.progress}%` }} />
              </div>
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: '8px' }}
                onClick={() => onNavigate('videos')}
              >
                Continue →
              </button>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-title">Recent Activity</div>
          {activity.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, marginTop: '5px',
                background: a.type === 'success' ? 'var(--edu-success)' : a.type === 'purple' ? 'var(--edu-accent)' : 'var(--edu-accent2)',
              }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: '500' }}>{a.text}</p>
                <p style={{ fontSize: '11px', color: 'var(--edu-sub)' }}>{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
