import { useState } from 'react';
import { api } from '../api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res  = await api.login(username, password);
      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || 'Login failed.');
        return;
      }

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
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Task Manager</h2>
        <p style={styles.subtitle}>Sign in to continue</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrapper:  { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#f0f2f5' },
  card:     { background:'#fff', padding:'2.5rem', borderRadius:'12px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', width:'100%', maxWidth:'360px' },
  title:    { margin:'0 0 .25rem', fontSize:'1.6rem', fontWeight:700, textAlign:'center' },
  subtitle: { margin:'0 0 1.5rem', color:'#888', textAlign:'center', fontSize:'.9rem' },
  form:     { display:'flex', flexDirection:'column', gap:'1rem' },
  input:    { padding:'.75rem 1rem', borderRadius:'8px', border:'1px solid #ddd', fontSize:'1rem', outline:'none' },
  button:   { padding:'.75rem', borderRadius:'8px', background:'#4f46e5', color:'#fff', border:'none', fontSize:'1rem', fontWeight:600, cursor:'pointer' },
  error:    { color:'#e53e3e', fontSize:'.875rem', margin:0 },
};