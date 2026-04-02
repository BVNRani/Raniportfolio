// src/hooks/useAuth.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../firebase/config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Safety timeout — if Supabase doesn't respond in 8s, stop loading
    const timeout = setTimeout(() => {
      setLoading(false);
      setAuthError('Could not connect to Supabase. Check your internet connection and .env setup.');
    }, 8000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      clearTimeout(timeout);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const login = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })
      .then(({ error }) => { if (error) throw error; });

  const logout = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, authError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
