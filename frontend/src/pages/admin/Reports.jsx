import React, { useState, useEffect } from 'react';
import { assignmentsAPI, coursesAPI } from '../../services/api';
import '../../App.css';

const Reports = () => {
  const [analytics, setAnalytics] = useState(null);
  const [courses, setCourses]     = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsData, coursesData] = await Promise.all([
          assignmentsAPI.adminAnalytics(),
          coursesAPI.adminAllCourses(),
        ]);
        setAnalytics(analyticsData);
        setCourses(Array.isArray(coursesData) ? coursesData : coursesData?.results || []);
      } catch (err) {
        console.error('Reports error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Monthly data — static display (replace with real API if you add monthly tracking)
  const monthlyData = [
    ['Jan', 40], ['Feb', 55], ['Mar', 70],
    ['Apr', 85], ['May', 60], ['Jun', 95],
  ];

  const totalEnrollments = courses.reduce((sum, c) => sum + (c.enrolled_count || 0), 0);
  const avgScore = analytics?.average_score || 0;

  if (loading) return (
    <div className="fade-in" style={{ textAlign: 'center', padding: '60px', color: 'var(--edu-sub)' }}>
      ⏳ Loading reports...
    </div>
  );

  return (
    <div className="fade-in">
      <div className="page-title">Reports & Analytics</div>
      <div className="page-sub">Platform performance metrics</div>

      {/* Stats Row */}
      <div className="grid-3" style={{ marginBottom: '20px' }}>
        {[
          { label: 'Total Enrollments',    value: totalEnrollments,             c: 'var(--edu-accent)'  },
          { label: 'Total Submissions',    value: analytics?.total_submissions || 0, c: 'var(--edu-success)' },
          { label: 'Avg Assignment Score', value: avgScore ? `${avgScore}%` : '—', c: 'var(--edu-accent2)' },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ '--c': s.c }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-val" style={{ fontSize: '28px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Monthly Enrollment Trend */}
        <div className="card">
          <div className="card-title">Monthly Enrollment Trend</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '140px', padding: '10px 0 0' }}>
            {monthlyData.map(([month, val]) => (
              <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '10px', color: 'var(--edu-sub)', fontWeight: '600' }}>{val}</span>
                <div style={{
                  width: '100%',
                  height: `${val}%`,
                  background: 'var(--edu-accent)',
                  borderRadius: '4px 4px 0 0',
                  opacity: 0.85,
                  minHeight: '4px',
                }} />
                <span style={{ fontSize: '10px', color: 'var(--edu-sub)', fontWeight: '600' }}>{month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Course Statistics */}
        <div className="card">
          <div className="card-title">Course Statistics</div>
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Students</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c, i) => (
                <tr key={i}>
                  <td style={{ fontSize: '12px', fontWeight: '600' }}>{c.icon || '📚'} {c.title}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div className="progress-bar" style={{ width: '60px' }}>
                        <div className="progress-fill" style={{ width: `${Math.min((c.enrolled_count || 0) * 3, 100)}%` }} />
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--edu-sub)' }}>{c.enrolled_count || 0}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${c.is_active ? 'success' : 'danger'}`}>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--edu-sub)', padding: '20px' }}>No courses yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submissions Breakdown */}
      {analytics && (
        <div className="card" style={{ marginTop: '16px' }}>
          <div className="card-title">Submissions Breakdown</div>
          <div className="grid-3">
            {[
              { label: 'Total Submissions', value: analytics.total_submissions || 0,  c: 'var(--edu-accent)'  },
              { label: 'Graded',            value: analytics.graded_count || 0,        c: 'var(--edu-success)' },
              { label: 'Pending Review',    value: analytics.pending_count || 0,       c: 'var(--edu-warning)' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: '10px' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: s.c, fontFamily: 'var(--syne)' }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: 'var(--edu-sub)', marginTop: '4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;