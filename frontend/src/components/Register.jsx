import { useState } from 'react';
import { api } from '../api';
import { useTheme } from '../ThemeContext';
import { getTheme } from '../theme';

export default function Register({ onGoToLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { dark, toggleDark } = useTheme();
    const t = getTheme(dark);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const res = await api.register(username, password, confirm);
            const data = await res.json();
            if (!res.ok) { setError(data.detail || 'Registration failed.'); return; }
            setSuccess(data.detail);
            setTimeout(() => onGoToLogin(true), 2000);
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

                <h2 style={{ margin: '0 0 .25rem', fontSize: '1.6rem', fontWeight: 700, textAlign: 'center', color: t.text }}>Create Account</h2>
                <p style={{ margin: '0 0 1.5rem', color: t.textSub, textAlign: 'center', fontSize: '.9rem' }}>Request access to Task Manager</p>

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
                        placeholder="Password (min 8 chars)"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <input
                        style={{ padding: '.75rem 1rem', borderRadius: '8px', border: `1px solid ${t.inputBorder}`, fontSize: '1rem', outline: 'none', background: t.inputBg, color: t.text }}
                        type="password"
                        placeholder="Confirm password"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        required
                    />
                    {error && <p style={{ color: '#e53e3e', fontSize: '.875rem', margin: 0 }}>{error}</p>}
                    {success && <p style={{ color: '#16a34a', fontSize: '.875rem', margin: 0 }}>{success}</p>}
                    <button style={{ padding: '.75rem', borderRadius: '8px', background: '#4f46e5', color: '#fff', border: 'none', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }} type="submit" disabled={loading}>
                        {loading ? 'Registering…' : 'Register'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '.875rem', color: t.textSub }}>
                    Already have an account?{' '}
                    <span onClick={() => onGoToLogin(false)} style={{ color: '#4f46e5', cursor: 'pointer', fontWeight: 600 }}>Sign in</span>
                </p>
            </div>
        </div>
    );
}
