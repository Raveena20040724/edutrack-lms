import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, setTokens, clearTokens, getAccessToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load — restore session if token exists in localStorage
  useEffect(() => {
    const restoreSession = async () => {
      if (getAccessToken()) {
        try {
          const profile = await authAPI.getProfile();
          setUser(profile);
        } catch {
          clearTokens();
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  // Login — calls Django /api/auth/login/
  const login = async (username, password) => {
    try {
      const data = await authAPI.login(username, password);
      setTokens(data.access, data.refresh);
      setUser(data.user);
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

  // Loading screen while checking saved session
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#1a1a2e',
        color: '#fff',
        fontSize: '18px',
        fontFamily: 'sans-serif',
      }}>
        ⏳ Loading EduTrack...
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