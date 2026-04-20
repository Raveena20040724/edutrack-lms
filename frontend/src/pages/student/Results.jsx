import React from 'react';
import { MOCK_ASSIGNMENTS } from '../../data/mockData';
import '../../App.css';

const Results = () => {
  const graded = MOCK_ASSIGNMENTS.filter((a) => a.score);
  const avg = graded.length ? Math.round(graded.reduce((s, a) => s + a.score, 0) / graded.length) : 0;

  return (
    <div className="fade-in">
      <div className="page-title">Results & Progress</div>
      <div className="page-sub">Your academic performance overview</div>

      <div className="grid-3" style={{ marginBottom: '20px' }}>
        {[
          { label: 'Overall Average',    value: `${avg}%`, c: 'var(--edu-success)' },
          { label: 'Graded Assignments', value: graded.length, c: 'var(--edu-accent)' },
          { label: 'Certificates Earned', value: '0',      c: 'var(--edu-warning)' },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ '--c': s.c }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-val">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title">Assignment Scores</div>
        {graded.map((a, i) => (
          <div key={i} style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>{a.title}</span>
              <span style={{ fontWeight: '700', color: a.score >= 90 ? 'var(--edu-success)' : 'var(--edu-warning)' }}>
                {a.score}%
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${a.score}%`, background: a.score >= 90 ? 'var(--edu-success)' : 'var(--edu-warning)' }}
              />
            </div>
            {a.feedback && (
              <p style={{ fontSize: '12px', color: 'var(--edu-sub)', marginTop: '4px' }}>
                💬 {a.feedback}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;
