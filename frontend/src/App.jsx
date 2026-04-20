import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login       from './pages/Login';
import StudentApp  from './pages/student/StudentApp';
import TrainerApp  from './pages/trainer/TrainerApp';
import AdminApp    from './pages/admin/AdminApp';
import './App.css';

const AppRouter = () => {
  const { user } = useAuth();

  if (!user)                  return <Login />;
  if (user.role === 'student') return <StudentApp />;
  if (user.role === 'trainer') return <TrainerApp />;
  if (user.role === 'admin')   return <AdminApp />;

  return <Login />;
};

const App = () => (
  <AuthProvider>
    <AppRouter />
  </AuthProvider>
);

export default App;
