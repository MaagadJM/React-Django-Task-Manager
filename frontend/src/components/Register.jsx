import { useState } from 'react';
import { api } from '../api';

export default function Register({ onGoToLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const res = await api.register(username, password, confirm);
            const data = await res.json();

            if (!res.ok) {
                setError(data.detail || 'Registration failed.');
                return;
            }

            setSuccess(data.detail);
            // Redirect to login after 2 seconds
            setTimeout(() => onGoToLogin(true), 2000);
        } catch {
            setError('Could not reach the server.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <h2 style={styles.title}>Create Account</h2>
                <p style={styles.subtitle}>Request access to Task Manager</p>
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
                        placeholder="Password (min 8 chars)"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Confirm password"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        required
                    />
                    {error && <p style={styles.error}>{error}</p>}
                    {success && <p style={styles.success}>{success}</p>}
                    <button style={styles.button} type="submit" disabled={loading}>
                        {loading ? 'Registering…' : 'Register'}
                    </button>
                </form>
                <p style={styles.link}>
                    Already have an account?{' '}
                    <span onClick={() => onGoToLogin(false)} style={styles.anchor}>Sign in</span>
                </p>
            </div>
        </div>
    );
}

const styles = {
    wrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' },
    card: { background: '#fff', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '360px' },
    title: { margin: '0 0 .25rem', fontSize: '1.6rem', fontWeight: 700, textAlign: 'center' },
    subtitle: { margin: '0 0 1.5rem', color: '#888', textAlign: 'center', fontSize: '.9rem' },
    form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    input: { padding: '.75rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' },
    button: { padding: '.75rem', borderRadius: '8px', background: '#4f46e5', color: '#fff', border: 'none', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' },
    error: { color: '#e53e3e', fontSize: '.875rem', margin: 0 },
    success: { color: '#16a34a', fontSize: '.875rem', margin: 0 },
    link: { textAlign: 'center', marginTop: '1.25rem', fontSize: '.875rem', color: '#888' },
    anchor: { color: '#4f46e5', cursor: 'pointer', fontWeight: 600 },
};