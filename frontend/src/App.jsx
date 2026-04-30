import React, { useEffect, useState } from 'react';
import { startKeepAlive } from './services/keepAlive';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentApp from './pages/student/StudentApp';
import TrainerApp from './pages/trainer/TrainerApp';
import AdminApp from './pages/admin/AdminApp';
import './App.css';

const AppRouter = () => {
  const { user } = useAuth();
  const [page, setPage] = useState('login'); 

  if (!user) {
    if (page === 'register') {
      return <Register onGoLogin={() => setPage('login')} />;
    }
    return <Login onGoRegister={() => setPage('register')} />;
  }

  // Role-based routing after login
  if (user.role === 'student') return <StudentApp />;
  if (user.role === 'trainer') return <TrainerApp />;
  if (user.role === 'admin')   return <AdminApp />;

  return <Login onGoRegister={() => setPage('register')} />;
};

const App = () => {
  useEffect(() => {
    startKeepAlive();
  }, []);

  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;