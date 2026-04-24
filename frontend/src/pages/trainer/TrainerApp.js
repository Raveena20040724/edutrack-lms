import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

import TrainerDashboard from './TrainerDashboard';
import MyCourses        from './MyCourses';
import UploadContent    from './UploadContent';
import GradeAssignments from './GradeAssignments';
import Students         from './Students';

const menuItems = [
  { id: 'dashboard',   icon: '📊', label: 'Dashboard' },
  { id: 'courses',     icon: '📚', label: 'My Courses' },
  { id: 'upload',      icon: '⬆️', label: 'Upload Content' },
  { id: 'grade',       icon: '📝', label: 'Grade Work' },
  { id: 'students',    icon: '👥', label: 'Students' },
];

const pages = {
  dashboard: (nav) => <TrainerDashboard onNavigate={nav} />,
  courses:   (nav) => <MyCourses onNavigate={nav} />,
  upload:    ()    => <UploadContent />,
  grade:     ()    => <GradeAssignments />,
  students:  ()    => <Students />,
};

const TrainerApp = () => {
  const { logout } = useAuth();
  const [page, setPage] = useState('dashboard');

  const PageComponent = pages[page] || pages.dashboard;

  return (
    <div className="app-layout">
      <Sidebar
        menuItems={menuItems}
        activePage={page}
        onNavigate={setPage}
        role="Trainer"
        onLogout={logout}
      />
      <div className="main-area">
        <Navbar />
        <div className="page-content">
          {PageComponent(setPage)}
        </div>
      </div>
    </div>
  );
};

export default TrainerApp;
