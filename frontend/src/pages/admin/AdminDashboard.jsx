import React, { useState, useEffect } from 'react';
import { authAPI, coursesAPI, assignmentsAPI } from '../../services/api';
import '../../App.css';

const AdminDashboard = () => {
  const [users, setUsers]       = useState([]);
  const [courses, setCourses]   = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersData, coursesData, analyticsData] = await Promise.all([
          authAPI.getUsers(),
          coursesAPI.adminAllCourses(),
          assignmentsAPI.adminAnalytics(),
        ]);
        setUsers(Array.isArray(usersData)   ? usersData   : usersData?.results   || []);
        setCourses(Array.isArray(coursesData) ? coursesData : coursesData?.results || []);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const stats = [
    { label: 'Total Users',       value: users.length,                        c: 'var(--edu-accent)'  },
    { label: 'Active Courses',    value: courses.filter(c=>c.is_active).length, c: 'var(--edu-accent2)' },
    { label: 'Total Submissions', value: analytics?.total_submissions || 0,   c: 'var(--edu-warning)' },
    { label: 'Avg Score',         value: analytics?.average_score ? `${analytics.average_score}%` : '—', c: 'var(--edu-success)' },
  ];

  const maxEnrolled = Math.max(...courses.map(c => c.enrolled_count || 0), 1);

  if (loading) return (
    <div className="fade-in" style={{ textAlign: 'center', padding: '60px', color: 'var(--edu-sub)' }}>
      ⏳ Loading dashboard...
    </div>
  );

  return (
    <div className="fade-in">
      <div className="page-title">Admin Dashboard</div>
      <div className="page-sub">Platform-wide overview</div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '20px' }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ '--c': s.c }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-val" style={{ fontSize: '28px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Enrollments by Course */}
        <div className="card">
          <div className="card-title">Enrollments by Course</div>
          {courses.length === 0 && (
            <p style={{ color: 'var(--edu-sub)', fontSize: '13px' }}>No courses yet.</p>
          )}
          {courses.map((c, i) => (
            <div key={i} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '13px', fontWeight: '500' }}>{c.icon || '📚'} {c.title}</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--edu-accent)' }}>
                  {c.enrolled_count || 0}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${((c.enrolled_count || 0) / maxEnrolled) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Users */}
        <div className="card">
          <div className="card-title">Recent Users</div>
          {users.slice(0, 6).map((u, i) => {
            const initials = u.full_name
              ? u.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
              : (u.username || 'U')[0].toUpperCase();
            const colors = ['#4f46e5','#06b6d4','#10b981','#f59e0b','#ef4444','#8b5cf6'];
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div className="avatar" style={{ background: colors[i % colors.length], width: '32px', height: '32px', fontSize: '11px' }}>
                  {initials}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: '600' }}>{u.full_name || u.username}</p>
                  <p style={{ fontSize: '11px', color: 'var(--edu-sub)' }}>{u.email}</p>
                </div>
                <span className={`badge badge-${u.role === 'admin' ? 'danger' : u.role === 'trainer' ? 'info' : 'purple'}`}>
                  {u.role}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;