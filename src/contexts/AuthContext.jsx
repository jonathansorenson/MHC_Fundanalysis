import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isConnected } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('read');
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (authUser) => {
    if (!authUser || !isConnected()) return;
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role, display_name, email')
        .eq('id', authUser.id)
        .single();
      if (!error && data) {
        setRole(data.role || 'read');
        setUser({ email: data.email || authUser.email, display_name: data.display_name, role: data.role || 'read' });
      } else {
        setUser({ email: authUser.email, role: 'read' });
      }
    } catch {
      setUser({ email: authUser.email, role: 'read' });
    }
  }, []);

  useEffect(() => {
    if (!isConnected()) {
      // No Supabase configured — stay on login screen
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) fetchProfile(s.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) fetchProfile(s.user);
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
