import { useState, useEffect } from 'react'
import Login from './components/Login'
import { api } from './api'

export default function App() {
  const [user,    setUser]    = useState(localStorage.getItem('username'))
  const [tasks,   setTasks]   = useState([])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => { if (user) fetchTasks() }, [user])

  async function fetchTasks() {
    try {
      const res  = await api.getTasks()
      const data = await res.json()
      setTasks(data)
    } catch {
      setError('Could not load tasks. Is Django running?')
    } finally {
      setLoading(false)
    }
  }

  async function addTask(e) {
    e.preventDefault()
    if (!input.trim()) return
    const res  = await api.createTask({ title: input.trim() })
    const data = await res.json()
    setTasks([data, ...tasks])
    setInput('')
  }

  async function toggleTask(task) {
    const res  = await api.updateTask(task.id, { completed: !task.completed })
    const data = await res.json()
    setTasks(tasks.map(t => (t.id === task.id ? data : t)))
  }

  async function deleteTask(id) {
    await api.deleteTask(id)
    setTasks(tasks.filter(t => t.id !== id))
  }

  function logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('username')
    setUser(null)
    setTasks([])
  }

  // ── Not logged in ─────────────────────────────────────────────
  if (!user) return <Login onLogin={setUser} />

  const done    = tasks.filter(t =>  t.completed).length
  const pending = tasks.filter(t => !t.completed).length

  // ── Logged in ─────────────────────────────────────────────────
  return (
    <div style={styles.card}>

      {/* Header with logout */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 4 }}>
        <h1 style={styles.heading}>📋 Task Manager</h1>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <span style={{ color:'#64748b', fontSize:'.9rem' }}>👤 {user}</span>
          <button onClick={logout} style={styles.logoutBtn}>Log out</button>
        </div>
      </div>

      <p style={styles.sub}>{pending} pending · {done} done</p>

      {/* Add task form */}
      <form onSubmit={addTask} style={styles.form}>
        <input
          style={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button style={styles.btn} type="submit">Add</button>
      </form>

      {/* Error */}
      {error && <p style={styles.error}>{error}</p>}

      {/* Task list */}
      {loading ? (
        <p style={styles.hint}>Loading…</p>
      ) : tasks.length === 0 ? (
        <p style={styles.hint}>No tasks yet. Add one above!</p>
      ) : (
        <ul style={styles.list}>
          {tasks.map(task => (
            <li key={task.id} style={styles.item}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task)}
                style={{ cursor: 'pointer', width: 18, height: 18 }}
              />
              <span style={{
                ...styles.title,
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? '#94a3b8' : '#1e293b',
              }}>
                {task.title}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                style={styles.del}
                title="Delete"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const styles = {
  card:      { background:'#ffffff', borderRadius:16, padding:'2rem', boxShadow:'0 4px 24px rgba(0,0,0,0.08)' },
  heading:   { fontSize:'1.75rem', fontWeight:700, color:'#1e293b', marginBottom:4 },
  sub:       { color:'#64748b', fontSize:'0.875rem', marginBottom:'1.5rem' },
  form:      { display:'flex', gap:8, marginBottom:'1.5rem' },
  input:     { flex:1, padding:'0.6rem 1rem', borderRadius:8, border:'1.5px solid #e2e8f0', fontSize:'1rem', outline:'none' },
  btn:       { padding:'0.6rem 1.25rem', background:'#6366f1', color:'#fff', border:'none', borderRadius:8, fontSize:'1rem', cursor:'pointer', fontWeight:600 },
  logoutBtn: { padding:'.35rem .85rem', borderRadius:8, border:'1px solid #e2e8f0', background:'#fff', cursor:'pointer', fontSize:'.85rem', color:'#64748b' },
  error:     { color:'#ef4444', background:'#fef2f2', padding:'0.75rem 1rem', borderRadius:8, marginBottom:'1rem' },
  hint:      { color:'#94a3b8', textAlign:'center', padding:'2rem 0' },
  list:      { listStyle:'none', display:'flex', flexDirection:'column', gap:8 },
  item:      { display:'flex', alignItems:'center', gap:12, padding:'0.75rem 1rem', background:'#f8fafc', borderRadius:10, border:'1px solid #e2e8f0' },
  title:     { flex:1, fontSize:'0.95rem' },
  del:       { background:'none', border:'none', color:'#94a3b8', cursor:'pointer', fontSize:'0.9rem', padding:'2px 6px', borderRadius:4 },
}