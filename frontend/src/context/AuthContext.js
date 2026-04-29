import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, studentAPI, setTokens, clearTokens, getAccessToken } from '../services/api';
import { cacheSet, cacheClear } from '../services/dataCache';
import { startKeepAlive, stopKeepAlive } from '../services/keepAlive';

const AuthContext = createContext(null);

// Preload student data in background after login
const preloadStudentData = (role) => {
  if (role !== 'student') return;
  studentAPI.dashboard()
    .then((dash) => {
      if (!dash) return;
      cacheSet('my_enrollments', dash.enrollments  || []);
      cacheSet('my_assignments', dash.assignments  || []);
      cacheSet('my_submissions', dash.submissions  || []);
      console.log('[Preload] Student data cached ✅');
    })
    .catch(() => {
      // Silent — cache is optional, pages will fetch themselves
    });
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load — restore session if token exists
  useEffect(() => {
    const restoreSession = async () => {
      if (getAccessToken()) {
        try {
          const profile = await authAPI.getProfile();
          setUser(profile);
          startKeepAlive();                     // keep Neon DB awake
          preloadStudentData(profile.role);     // preload in background
        } catch {
          clearTokens();
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  // Login
  const login = async (username, password) => {
    try {
      const data = await authAPI.login(username, password);
      setTokens(data.access, data.refresh);
      setUser(data.user);
      startKeepAlive();                         // start pinging Neon
      preloadStudentData(data.user.role);       // preload data right after login
      return { success: true };
    } catch (err) {
      return { success: false, error: err.detail || 'Login failed. Check credentials.' };
    }
  };

  // Logout
  const logout = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) await authAPI.logout(refresh);
    } catch { /* ignore */ }
    stopKeepAlive();   // stop pinging
    cacheClear();      // clear all cached data
    clearTokens();
    setUser(null);
  };

  // Update profile
  const updateProfile = async (data) => {
    try {
      const updated = await authAPI.updateProfile(data);
      setUser(updated);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.detail || 'Update failed.' };
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#0A0F1E', color: '#fff',
        fontSize: '18px', fontFamily: 'sans-serif', gap: '12px',
      }}>
        <div style={{
          width: '20px', height: '20px', borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.2)',
          borderTopColor: '#3B82F6',
          animation: 'spin 0.8s linear infinite',
        }} />
        Loading EduTrack...
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);