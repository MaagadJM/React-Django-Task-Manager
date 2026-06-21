import { useState } from 'react';
import { api } from '../api';
import { useTheme } from '../ThemeContext';
import { getTheme } from '../theme';

export default function Login({ onLogin, onGuestLogin, onGoToRegister, successMessage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { dark, toggleDark } = useTheme();
  const t = getTheme(dark);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login(username, password);
      const data = await res.json();
      if (!res.ok) { setError(data.detail || 'Login failed.'); return; }
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('username', data.username);
      onLogin(data.username);
    } catch {
      setError('Could not reach the server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: t.pageBg, transition: 'background 0.2s' }}>
      <div style={{ background: t.card, padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', width: '100%', maxWidth: '360px', position: 'relative', transition: 'background 0.2s' }}>
        <button onClick={toggleDark} title="Toggle dark mode" style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}>
          {dark ? '☀️' : '🌙'}
        </button>

        <h2 style={{ margin: '0 0 .25rem', fontSize: '1.6rem', fontWeight: 700, textAlign: 'center', color: t.text }}>AIO System</h2>
        <p style={{ margin: '0 0 1.5rem', color: t.textSub, textAlign: 'center', fontSize: '.9rem' }}>Sign in to continue</p>

        {successMessage && <p style={{ color: '#16a34a', fontSize: '.875rem', textAlign: 'center', marginBottom: '1rem' }}>{successMessage}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            style={{ padding: '.75rem 1rem', borderRadius: '8px', border: `1px solid ${t.inputBorder}`, fontSize: '1rem', outline: 'none', background: t.inputBg, color: t.text }}
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            style={{ padding: '.75rem 1rem', borderRadius: '8px', border: `1px solid ${t.inputBorder}`, fontSize: '1rem', outline: 'none', background: t.inputBg, color: t.text }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <p style={{ color: '#e53e3e', fontSize: '.875rem', margin: 0 }}>{error}</p>}
          <button style={{ padding: '.75rem', borderRadius: '8px', background: '#4f46e5', color: '#fff', border: 'none', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }} type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <button onClick={onGuestLogin} style={{ marginTop: '0.75rem', width: '100%', padding: '.75rem', borderRadius: '8px', background: t.btnBg, color: t.btnText, border: `1px solid ${t.btnBorder}`, fontSize: '1rem', cursor: 'pointer' }}>
          Continue as Guest
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '.875rem', color: t.textSub }}>
          Don't have an account?{' '}
          <span onClick={onGoToRegister} style={{ color: '#4f46e5', cursor: 'pointer', fontWeight: 600 }}>Register</span>
        </p>
      </div>
    </div>
  );
}
