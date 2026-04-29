import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

import Dashboard    from './Dashboard';
import CourseList   from './CourseList';
import VideoPlayer  from './VideoPlayer';
import AssignmentList from './AssignmentList';
import Results      from './Results';
import Profile       from './Profile';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'courses',  label: 'My Courses' },
  { id: 'videos',    label: 'Videos' },
  { id: 'assignments', label: 'Assignments' },
  { id: 'results',  label: 'Results' },
  { id: 'profile',   label: 'Profile' },
];

const StudentApp = () => {
  const { logout } = useAuth();
  const [page, setPage] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // We define the page mapping inside the component now to access searchQuery
  const renderPage = () => {
    switch (page) {
      case 'dashboard':   return <Dashboard onNavigate={setPage} />;
      case 'courses':     return <CourseList />;
      case 'videos':      return <VideoPlayer />;
      case 'assignments': return <AssignmentList />;
      case 'results':     return <Results />;
      case 'profile':     return <Profile />;
      default:            return <Dashboard onNavigate={setPage} />;
    }
  };

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
        <Navbar search={searchQuery} onSearch={setSearchQuery} />
        <div className="page-content">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default StudentApp;