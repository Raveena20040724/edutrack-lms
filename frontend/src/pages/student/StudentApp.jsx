import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

import Dashboard    from '../student/Dashboard';
import CourseList   from '../student/CourseList';
import BrowseCourses from '../student/BrowseCourses';
import VideoPlayer  from '../student/VideoPlayer';
import AssignmentList from '../student/AssignmentList';
import Results      from '../student/Results';
import Profile      from '../student/Profile';

const menuItems = [
  { id: 'dashboard',   icon: '📊', label: 'Dashboard' },
  { id: 'courses',     icon: '📚', label: 'My Courses' },
  { id: 'browse',      icon: '🔍', label: 'Browse' },
  { id: 'videos',      icon: '🎬', label: 'Videos' },
  { id: 'assignments', icon: '📝', label: 'Assignments' },
  { id: 'results',     icon: '🏆', label: 'Results' },
  { id: 'profile',     icon: '👤', label: 'Profile' },
];

const pages = {
  dashboard:   (nav) => <Dashboard onNavigate={nav} />,
  courses:     (nav) => <CourseList onNavigate={nav} />,
  browse:      ()    => <BrowseCourses />,
  videos:      ()    => <VideoPlayer />,
  assignments: ()    => <AssignmentList />,
  results:     ()    => <Results />,
  profile:     ()    => <Profile />,
};

const StudentApp = () => {
  const { logout } = useAuth();
  const [page, setPage] = useState('dashboard');

  const PageComponent = pages[page] || pages.dashboard;

  return (
    <div className="app-layout">
      <Sidebar
        menuItems={menuItems}
        activePage={page}
        onNavigate={setPage}
        role="Student"
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

export default StudentApp;
