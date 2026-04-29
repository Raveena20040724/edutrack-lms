import React, { useState } from 'react'; // Hooks stay here
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

// Import the components used in the pages object
import TrainerDashboard from './TrainerDashboard';
import MyCourses from './MyCourses';
import UploadContent from './UploadContent';
import GradeAssignments from './GradeAssignments';
import Students from './Students';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'courses',label: 'My Courses' },
  { id: 'upload', label: 'Upload Content' },
  { id: 'grade', label: 'Grade Work' },
  { id: 'students', label: 'Students' },
];

const TrainerApp = () => {
  const { logout } = useAuth();
  
  // FIX 1: Hooks must be INSIDE the component function
  const [page, setPage] = useState('dashboard');

  // Define how pages render
  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <TrainerDashboard onNavigate={setPage} />;
      case 'courses':   return <MyCourses onNavigate={setPage} />;
      case 'upload':    return <UploadContent />;
      case 'grade':     return <GradeAssignments />;
      case 'students':  return <Students />;
      default:          return <TrainerDashboard onNavigate={setPage} />;
    }
  };

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
        {/* Pass setSearchQuery to Navbar so typing updates state */}
        <Navbar onSearch={setSearchQuery} /> 
        
        <div className="page-content">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default TrainerApp;