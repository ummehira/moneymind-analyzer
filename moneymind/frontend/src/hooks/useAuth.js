import { useState, useEffect, useCallback } from 'react';
import { getMe } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mm_user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem('mm_token');
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await getMe();
      setUser(data.user);
      localStorage.setItem('mm_user', JSON.stringify(data.user));
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('mm_token');
    localStorage.removeItem('mm_user');
    setUser(null);
  };

  const isAuthenticated = !!localStorage.getItem('mm_token');

  return { user, setUser, loading, refresh, logout, isAuthenticated };
};
