import React, { useState, useEffect } from 'react';
import { assignmentsAPI } from '../../services/api';
import '../../App.css';

const GradeAssignments = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [grades, setGrades]           = useState({});
  const [saving, setSaving]           = useState({});
  const [message, setMessage]         = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await assignmentsAPI.trainerAnalytics();
        const all  = [
          ...(data.pending_submissions || []),
        ];
        // Also try to get graded ones
        setSubmissions(all);
      } catch (err) {
        console.error('Grade assignments error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleGrade = async (submissionId) => {
    const score    = parseInt(grades[`${submissionId}_score`]);
    const feedback = grades[`${submissionId}_feedback`] || 'Good work!';

    if (isNaN(score) || score < 0 || score > 100) {
      alert('Please enter a valid score between 0 and 100.');
      return;
    }

    setSaving(prev => ({ ...prev, [submissionId]: true }));
    try {
      await assignmentsAPI.grade(submissionId, { score, feedback, status: 'graded' });
      setSubmissions(prev => prev.map(s =>
        s.id === submissionId ? { ...s, status: 'graded', score, feedback } : s
      ));
      setMessage('✅ Grade saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(err.detail || 'Failed to save grade.');
    } finally {
      setSaving(prev => ({ ...prev, [submissionId]: false }));
    }
  };

  if (loading) return (
    <div className="fade-in" style={{ textAlign: 'center', padding: '60px', color: 'var(--edu-sub)' }}>
      ⏳ Loading submissions...
    </div>
  );

  return (
    <div className="fade-in">
      <div className="page-title">Grade Assignments</div>
      <div className="page-sub">Review and score student submissions</div>

      {message && (
        <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '14px', color: '#065f46' }}>
          {message}
        </div>
      )}

      {submissions.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</p>
          <p style={{ color: 'var(--edu-sub)', fontSize: '14px' }}>No pending submissions. All caught up!</p>
        </div>
      )}

      {submissions.length > 0 && (
        <div className="card">
          <table>
            <thead>
              <tr>{['Student','Assignment','Course','Submitted','Score','Feedback','Action'].map(h=><th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: '600' }}>{s.student_name}</td>
                  <td>{s.assignment_title}</td>
                  <td style={{ fontSize: '12px', color: 'var(--edu-sub)' }}>{s.course_title}</td>
                  <td>
                    <span className={`badge badge-${s.status === 'graded' ? 'success' : 'warning'}`}>
                      {s.status === 'graded' ? 'Graded' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    {s.status === 'graded'
                      ? <span style={{ fontWeight: '700', color: 'var(--edu-success)' }}>{s.score}%</span>
                      : <input
                          className="input" style={{ width: '75px' }}
                          type="number" min={0} max={100} placeholder="0–100"
                          onChange={e => setGrades(g => ({ ...g, [`${s.id}_score`]: e.target.value }))}
                        />
                    }
                  </td>
                  <td>
                    {s.status === 'graded'
                      ? <span style={{ fontSize: '12px', color: 'var(--edu-sub)' }}>{s.feedback}</span>
                      : <input
                          className="input" placeholder="Write feedback..."
                          onChange={e => setGrades(g => ({ ...g, [`${s.id}_feedback`]: e.target.value }))}
                        />
                    }
                  </td>
                  <td>
                    {s.status !== 'graded' && (
                      <button
                        className="btn btn-success btn-sm"
                        disabled={saving[s.id]}
                        onClick={() => handleGrade(s.id)}
                      >
                        {saving[s.id] ? '⏳' : 'Save Grade'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GradeAssignments;