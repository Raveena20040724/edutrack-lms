import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, studentAPI, setTokens, clearTokens, getAccessToken } from '../services/api';
import { cacheSet, cacheGet, cacheClear } from '../services/dataCache'; //
import { startKeepAlive, stopKeepAlive } from '../services/keepAlive'; //

const AuthContext = createContext(null);

// Preload function stays outside the component as a helper
const preloadStudentData = (role) => {
  if (role !== 'student') return;

  // Uses the 3x faster StudentDashboardView from your backend
  studentAPI.dashboard()
    .then((dash) => {
      if (!dash) return;
      // Saves data locally so the dashboard loads instantly next time
      cacheSet('my_enrollments', dash.enrollments || []);
      cacheSet('my_assignments', dash.assignments || []);
      cacheSet('my_submissions', dash.submissions || []);
      console.log('[Preload] Student data cached');
    })
    .catch(() => {});
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // ✅ FIXED: Hooks must be inside the function component
  const [dashboardData, setDashboardData] = useState(cacheGet('dashboard_cache')); 

  // Restore session on app load
  useEffect(() => {
    const restoreSession = async () => {
      if (getAccessToken()) {
        try {
          const profile = await authAPI.getProfile();
          setUser(profile);
          startKeepAlive(); // Keeps Neon DB awake
          preloadStudentData(profile.role);
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
      startKeepAlive(); //
      preloadStudentData(data.user.role);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.detail || 'Login failed. Check credentials.'
      };
    }
  };

  // Logout
  const logout = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) await authAPI.logout(refresh);
    } catch {}

    stopKeepAlive(); //
    cacheClear(); // Clears all local dashboard data for security
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
      return {
        success: false,
        error: err.detail || 'Update failed.'
      };
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#0A0F1E',
        color: '#fff',
        fontSize: '18px',
        fontFamily: 'sans-serif',
        flexDirection: 'column',
        gap: '12px',
      }}>
        <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
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
    <AuthContext.Provider value={{ user, login, logout, updateProfile, dashboardData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);