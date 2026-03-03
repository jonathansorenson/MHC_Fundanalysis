import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isConnected } from '../lib/supabase';

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('read');
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (token) => {
    try {
      const res = await fetch(`${API_BASE}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const profile = await res.json();
        setRole(profile.role || 'read');
        setUser(profile);
      }
    } catch { /* fallback to 'read' */ }
  }, []);

  useEffect(() => {
    if (!isConnected()) {
      // Demo mode — no Supabase configured
      setSession({ demo: true });
      setUser({ email: 'demo@mhc.com', role: 'admin' });
      setRole('admin');
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.access_token) fetchProfile(s.access_token);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.access_token) fetchProfile(s.access_token);
      else { setUser(null); setRole('read'); }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const login = useCallback(async (email, password) => {
    if (!isConnected()) throw new Error('Supabase not configured');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const logout = useCallback(async () => {
    if (isConnected()) await supabase.auth.signOut();
    setSession(null); setUser(null); setRole('read');
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
