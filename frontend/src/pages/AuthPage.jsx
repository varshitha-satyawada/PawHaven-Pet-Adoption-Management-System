import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      if (isRegister) await register(name, email, password);
      else await login(email, password);
      navigate('/');
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  return <main className="auth-page">
    <div className="auth-art"><div className="auth-paw">🐾</div><span className="eyebrow">GOOD THINGS START HERE</span><h1>{isRegister ? 'Make room for a little more love.' : 'Welcome back, friend.'}</h1><p>Every adoption is a small act that makes the world kinder.</p><div className="auth-art-bottom">♡ Adopt kindness. Adopt a friend.</div></div>
    <div className="auth-form-wrap">
      <form className="auth-form" onSubmit={handleSubmit}>
        <Link className="back-link" to="/">← Back to pets</Link>
        <span className="eyebrow">{isRegister ? 'JOIN THE PAWHAVEN FAMILY' : 'YOUR NEXT CHAPTER'}</span>
        <h2>{isRegister ? 'Create your account' : 'Log in'}</h2>
        <p>{isRegister ? 'A new best friend might be just around the corner.' : 'Pick up where your adoption journey left off.'}</p>
        {error && <div className="alert alert-error">{error}</div>}
        {isRegister && <label>Full name<input required maxLength="80" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" /></label>}
        <label>Email address<input required type="email" maxLength="150" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></label>
        <label>Password<input required type="password" minLength="8" maxLength="72" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" /></label>
        <button className="button button-primary button-wide" disabled={busy}>{busy ? 'Please wait…' : isRegister ? 'Create account' : 'Log in'} <span>→</span></button>
        <div className="auth-switch">{isRegister ? 'Already have an account?' : 'New to PawHaven?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Log in' : 'Create an account'}</Link></div>
        <small className="auth-hint">New accounts start with the Adopter role.</small>
      </form>
    </div>
  </main>;
}
