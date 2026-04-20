import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

import AdminDashboard from '../admin/AdminDashboard';
import ManageUsers    from '../admin/ManageUsers';
import ManageCourses  from '../admin/ManageCourses';
import Reports        from '../admin/Reports';
import Settings       from '../admin/Settings';

const menuItems = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'users',     icon: '👥', label: 'Manage Users' },
  { id: 'courses',   icon: '📚', label: 'Manage Courses' },
  { id: 'reports',   icon: '📈', label: 'Reports & Analytics' },
  { id: 'settings',  icon: '⚙️', label: 'Settings' },
];

const pages = {
  dashboard: () => <AdminDashboard />,
  users:     () => <ManageUsers />,
  courses:   () => <ManageCourses />,
  reports:   () => <Reports />,
  settings:  () => <Settings />,
};

const AdminApp = () => {
  const { logout } = useAuth();
  const [page, setPage] = useState('dashboard');

  const PageComponent = pages[page] || pages.dashboard;

  return (
    <div className="app-layout">
      <Sidebar
        menuItems={menuItems}
        activePage={page}
        onNavigate={setPage}
        role="Admin"
        onLogout={logout}
      />
      <div className="main-area">
        <Navbar />
        <div className="page-content">
          {PageComponent()}
        </div>
      </div>
    </div>
  );
};

export default AdminApp;
