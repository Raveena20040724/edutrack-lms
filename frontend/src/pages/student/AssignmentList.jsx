import React, { useState, useEffect } from 'react';
import { assignmentsAPI } from '../../services/api';
import Modal from '../../components/Modal';
import '../../App.css';

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [modal, setModal]             = useState(null);
  const [note, setNote]               = useState('');
  const [file, setFile]               = useState(null);
  const [submitting, setSubmitting]   = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await assignmentsAPI.list();
        setAssignments(Array.isArray(data) ? data : data?.results || []);
      } catch (err) {
        console.error('Error fetching assignments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      if (file) formData.append('file', file);
      formData.append('notes', note);
      await assignmentsAPI.submit(modal.id, formData);
      setAssignments((prev) =>
        prev.map((a) => a.id === modal.id ? { ...a, submission_status: 'submitted' } : a)
      );
      setModal(null);
      setNote('');
      setFile(null);
    } catch (err) {
      alert(err.detail || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (status) => {
    if (status === 'graded')    return <span className="badge badge-success">Graded</span>;
    if (status === 'submitted') return <span className="badge badge-warning">Pending</span>;
    return                             <span className="badge badge-danger">Not Submitted</span>;
  };

  if (loading) {
    return (
      <div className="fade-in" style={{ textAlign: 'center', padding: '60px', color: 'var(--edu-sub)' }}>
        ⏳ Loading assignments...
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-title">Assignments</div>
      <div className="page-sub">Submit and track your work</div>

      {assignments.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '48px', marginBottom: '12px' }}>📝</p>
          <p style={{ color: 'var(--edu-sub)', fontSize: '14px' }}>No assignments yet. Enroll in courses to get assignments.</p>
        </div>
      )}

      {assignments.length > 0 && (
        <div className="card">
          <table>
            <thead>
              <tr>
                {['Assignment', 'Course', 'Due Date', 'Status', 'Action'].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: '600' }}>{a.title}</td>
                  <td>{a.course_icon} {a.course_title}</td>
                  <td>{a.due_date}</td>
                  <td>{statusBadge(a.submission_status)}</td>
                  <td>
                    {a.submission_status === 'not_submitted'
                      ? <button className="btn btn-primary btn-sm" onClick={() => setModal(a)}>Submit</button>
                      : <span style={{ fontSize: '12px', color: 'var(--edu-sub)' }}>
                          {a.submission_status === 'graded' ? '✅ Graded' : '⏳ Awaiting grade'}
                        </span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal onClose={() => setModal(null)}>
          <div className="modal-title">Submit Assignment</div>
          <p style={{ fontWeight: '600', marginBottom: '14px' }}>{modal.title}</p>
          <div className="upload-zone" onClick={() => document.getElementById('fileInput').click()}>
            <p style={{ fontSize: '24px', marginBottom: '8px' }}>📁</p>
            <p style={{ fontSize: '13px', color: 'var(--edu-sub)' }}>
              {file ? `✅ ${file.name}` : 'Click to upload your PDF/ZIP file'}
            </p>
            <input
              id="fileInput"
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => setFile(e.target.files[0])}
              accept=".pdf,.zip,.doc,.docx"
            />
          </div>
          <div className="form-group" style={{ marginTop: '14px' }}>
            <label className="label">Notes (optional)</label>
            <textarea
              className="input"
              rows={3}
              placeholder="Add any notes for your trainer..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setModal(null)}>Cancel</button>
            <button
              className="btn btn-primary"
              style={{ flex: 1, opacity: submitting ? 0.7 : 1 }}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? '⏳ Submitting...' : 'Submit Assignment'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AssignmentList;