import { createContext, useContext, useMemo, useState } from 'react';
import { api } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pawhaven_user') || 'null'); }
    catch { return null; }
  });

  async function login(email, password) {
    const data = await api('/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password })
    });
    localStorage.setItem('pawhaven_token', data.token);
    localStorage.setItem('pawhaven_user', JSON.stringify({
      id: data.id, name: data.name, email: data.email, role: data.role
    }));
    setUser({ id: data.id, name: data.name, email: data.email, role: data.role });
  }

  async function register(name, email, password) {
    const data = await api('/auth/register', {
      method: 'POST', body: JSON.stringify({ name, email, password })
    });
    localStorage.setItem('pawhaven_token', data.token);
    const nextUser = { id: data.id, name: data.name, email: data.email, role: data.role };
    localStorage.setItem('pawhaven_user', JSON.stringify(nextUser));
    setUser(nextUser);
  }

  function logout() {
    localStorage.removeItem('pawhaven_token');
    localStorage.removeItem('pawhaven_user');
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, register, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
