                                                                                                                                                                                                                                        import React, { useState, useEffect } from 'react';
import { assignmentsAPI } from '../../services/api';
import '../../App.css';

const Results = () => {
  const [results, setResults] = useState([]);
  const [avg, setAvg]         = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await assignmentsAPI.myResults();
        setResults(data.results || []);
        setAvg(data.average || 0);
      } catch (err) {
        console.error('Error fetching results:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) return (
    <div className="fade-in" style={{ textAlign: 'center', padding: '60px', color: 'var(--edu-sub)' }}>
      ⏳ Loading results...
    </div>
  );

  const stats = [
    { label: 'Overall Average',     value: avg ? `${avg}%` : '—', c: 'var(--edu-success)' },
    { label: 'Graded Assignments',  value: results.length,         c: 'var(--edu-accent)'  },
    { label: 'Certificates Earned', value: '0',                    c: 'var(--edu-warning)' },
  ];

  return (
    <div className="fade-in">
      <div className="page-title">Results &amp; Progress</div>
      <div className="page-sub">Your academic performance overview</div>

      {/* Stat cards — all same height */}
      <div className="grid-3" style={{ marginBottom: '20px' }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ '--c': s.c, minHeight: '90px' }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-val" style={{ fontSize: '28px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title">Assignment Scores</div>

        {results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--edu-sub)' }}>
            <p style={{ fontSize: '32px', marginBottom: '8px' }}>🏆</p>
            <p>No graded assignments yet. Submit your work to see results here.</p>
          </div>
        )}

        {results.map((r, i) => (
          <div key={i} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>{r.assignment}</span>
                <span style={{ fontSize: '11px', color: 'var(--edu-sub)', marginLeft: '8px' }}>{r.course}</span>
              </div>
              <span style={{
                fontSize: '14px', fontWeight: '700', minWidth: '48px', textAlign: 'right',
                color: r.percentage >= 90 ? 'var(--edu-success)' : r.percentage >= 60 ? 'var(--edu-warning)' : 'var(--edu-danger)',
              }}>
                {r.percentage}%
              </span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{
                width: `${r.percentage}%`,
                background: r.percentage >= 90 ? 'var(--edu-success)' : r.percentage >= 60 ? 'var(--edu-warning)' : 'var(--edu-danger)',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              {r.feedback && (
                <p style={{ fontSize: '12px', color: 'var(--edu-sub)' }}>💬 {r.feedback}</p>
              )}
              <p style={{ fontSize: '11px', color: 'var(--edu-sub)', marginLeft: 'auto' }}>
                {r.score}/{r.max_score} marks
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;