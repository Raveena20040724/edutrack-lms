import React, { useState } from 'react';
import '../../App.css';

const Settings = () => {
  const [general, setGeneral] = useState({
    platformName: 'EduTrack LMS',
    supportEmail: 'support@edutrack.com',
    maxStudents: 50,
    passingScore: 60,
  });

  const [notif, setNotif] = useState({
    emailOnSubmit: true,
    emailOnGrade: true,
    weeklyReport: false,
  });

  return (
    <div className="fade-in">
      <div className="page-title">Platform Settings</div>
      <div className="page-sub">Configure EduTrack settings</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* General */}
        <div className="card">
          <div className="card-title">General Settings</div>
          <div className="grid-2">
            <div className="form-group">
              <label className="label">Platform Name</label>
              <input className="input" value={general.platformName} onChange={(e) => setGeneral({ ...general, platformName: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="label">Support Email</label>
              <input className="input" type="email" value={general.supportEmail} onChange={(e) => setGeneral({ ...general, supportEmail: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="label">Max Students Per Course</label>
              <input className="input" type="number" value={general.maxStudents} onChange={(e) => setGeneral({ ...general, maxStudents: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="label">Passing Score (%)</label>
              <input className="input" type="number" value={general.passingScore} onChange={(e) => setGeneral({ ...general, passingScore: e.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary">Save General Settings</button>
        </div>

        {/* Notifications */}
        <div className="card">
          <div className="card-title">Notification Settings</div>
          {[
            { key: 'emailOnSubmit', label: 'Email trainer when assignment is submitted' },
            { key: 'emailOnGrade',  label: 'Email student when assignment is graded' },
            { key: 'weeklyReport',  label: 'Send weekly analytics report to admin' },
          ].map(({ key, label }) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '14px' }}>{label}</span>
              <div
                onClick={() => setNotif((n) => ({ ...n, [key]: !n[key] }))}
                style={{
                  width: '44px', height: '24px', borderRadius: '12px', cursor: 'pointer', transition: '0.2s',
                  background: notif[key] ? 'var(--edu-accent)' : '#e2e8f0',
                  position: 'relative',
                }}
              >
                <div style={{
                  width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: '3px', transition: '0.2s',
                  left: notif[key] ? '23px' : '3px',
                }} />
              </div>
            </div>
          ))}
          <button className="btn btn-primary" style={{ marginTop: '14px' }}>Save Notification Settings</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
