import { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/dashboard/index.jsx'
import TaskManager from './components/task-manager/index.jsx'
import OIGScreener from './components/oig-screener/index.jsx'

export default function App() {
  const [user, setUser] = useState(localStorage.getItem('username'))
  const [showReg, setShowReg] = useState(false)
  const [loginMsg, setLoginMsg] = useState('')
  const [activeModule, setActiveModule] = useState(null)

  function logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('username')
    setUser(null)
    setActiveModule(null)
  }

  if (!user) {
    if (showReg) return (
      <Register onGoToLogin={(registered) => {
        setShowReg(false)
        if (registered) setLoginMsg('Account created! Wait for admin approval, then sign in.')
      }} />
    )
    return (
      <Login
        onLogin={setUser}
        successMessage={loginMsg}
        onGoToRegister={() => { setLoginMsg(''); setShowReg(true) }}
      />
    )
  }

  if (!activeModule) return <Dashboard user={user} onSelectModule={setActiveModule} onLogout={logout} />
  if (activeModule === 'tasks') return <TaskManager user={user} onBack={() => setActiveModule(null)} onLogout={logout} />
  if (activeModule === 'oig') return <OIGScreener user={user} onBack={() => setActiveModule(null)} onLogout={logout} />
}