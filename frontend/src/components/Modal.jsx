import React from 'react';
import '../App.css';

const Modal = ({ children, onClose }) => (
  <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="modal-box fade-in">
      {children}
    </div>
  </div>
);

export default Modal;
