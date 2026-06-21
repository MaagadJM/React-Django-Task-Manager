import { useState, useEffect } from 'react'
import { api } from '../../api'
import { useTheme } from '../../ThemeContext'
import { getTheme } from '../../theme'

export default function TaskManager({ user, onBack, onLogout }) {
    const [tasks, setTasks] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const { dark, toggleDark } = useTheme()
    const t = getTheme(dark)

    useEffect(() => { fetchTasks() }, [])

    async function fetchTasks() {
        try {
            const res = await api.getTasks()
            const data = await res.json()
            setTasks(data)
        } catch { setError('Could not load tasks. Is Django running?') }
        finally { setLoading(false) }
    }

    async function addTask(e) {
        e.preventDefault()
        if (!input.trim()) return
        const res = await api.createTask({ title: input.trim() })
        const data = await res.json()
        setTasks([data, ...tasks])
        setInput('')
    }

    async function toggleTask(task) {
        const res = await api.updateTask(task.id, { completed: !task.completed })
        const data = await res.json()
        setTasks(tasks.map(tsk => tsk.id === task.id ? data : tsk))
    }

    async function deleteTask(id) {
        await api.deleteTask(id)
        setTasks(tasks.filter(tsk => tsk.id !== id))
    }

    const done = tasks.filter(tsk => tsk.completed).length
    const pending = tasks.filter(tsk => !tsk.completed).length

    return (
        <div style={{ ...styles.card, background: t.card }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <button onClick={onBack} style={{ ...styles.backBtn, background: t.btnBg, color: t.btnText, border: `1px solid ${t.btnBorder}` }}>← Back</button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ color: t.textSub, fontSize: '1rem', fontWeight: 'bold' }}>👤 {user}</span>
                    <button onClick={toggleDark} title="Toggle dark mode" style={{ ...styles.logoutBtn, background: t.btnBg, color: t.btnText, border: `1px solid ${t.btnBorder}` }}>{dark ? '☀️' : '🌙'}</button>
                    <button onClick={onLogout} style={{ ...styles.logoutBtn, background: t.btnBg, color: t.btnText, border: `1px solid ${t.btnBorder}` }}>Log out</button>
                </div>
            </div>

            <h1 style={{ ...styles.heading, color: t.text }}>📋 Task Manager</h1>
            <p style={{ ...styles.sub, color: t.textSub }}>{pending} pending · {done} done</p>

            <form onSubmit={addTask} style={styles.form}>
                <input
                    style={{ ...styles.input, background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="What needs to be done?"
                />
                <button style={styles.btn} type="submit">Add</button>
            </form>

            {error && <p style={styles.error}>{error}</p>}
            {loading
                ? <p style={{ ...styles.hint, color: t.textMuted }}>Loading…</p>
                : tasks.length === 0
                    ? <p style={{ ...styles.hint, color: t.textMuted }}>No tasks yet. Add one above!</p>
                    : (
                        <ul style={styles.list}>
                            {tasks.map(task => (
                                <li key={task.id} style={{ ...styles.item, background: t.itemBg, border: `1px solid ${t.border}` }}>
                                    <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task)} style={{ cursor: 'pointer', width: 18, height: 18 }} />
                                    <span style={{ ...styles.taskTitle, textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? t.textMuted : t.text }}>
                                        {task.title}
                                    </span>
                                    <button onClick={() => deleteTask(task.id)} style={{ ...styles.del, color: t.textMuted }}>✕</button>
                                </li>
                            ))}
                        </ul>
                    )}
        </div>
    )
}

const styles = {
    card: { background: '#ffffff', borderRadius: 16, padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', transition: 'background 0.2s' },
    heading: { fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginBottom: 20, marginTop: 24 },
    sub: { color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' },
    form: { display: 'flex', gap: 8, marginBottom: '1.5rem' },
    input: { flex: 1, padding: '0.6rem 1rem', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: '1rem', outline: 'none' },
    btn: { padding: '0.6rem 1.25rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, fontSize: '1rem', cursor: 'pointer', fontWeight: 600 },
    backBtn: { padding: '.35rem .85rem', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '.85rem', color: '#64748b' },
    logoutBtn: { padding: '.35rem .85rem', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '.85rem', color: '#64748b' },
    error: { color: '#ef4444', background: '#fef2f2', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem' },
    hint: { color: '#94a3b8', textAlign: 'center', padding: '2rem 0' },
    list: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, padding: 0 },
    item: { display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' },
    taskTitle: { flex: 1, fontSize: '0.95rem' },
    del: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.9rem', padding: '2px 6px', borderRadius: 4 },
}
