import { useState, useEffect } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/dashboard/index.jsx'
import TaskManager from './components/task-manager/index.jsx'
import OIGScreener from './components/oig-screener/index.jsx'
import Downtime from './components/Downtime'
import { ThemeProvider, useTheme } from './ThemeContext'
import { api } from './api'

function App() {
  const [user, setUser] = useState(localStorage.getItem('username'))
  const [isGuest, setIsGuest] = useState(false)
  const [showReg, setShowReg] = useState(false)
  const [loginMsg, setLoginMsg] = useState('')
  const [activeModule, setActiveModule] = useState(null)
  const [systemStatus, setSystemStatus] = useState({ status: 'ok', cpu_percent: 0 })
  const { dark } = useTheme()

  useEffect(() => {
    api.health()
      .then(r => r.json())
      .then(data => setSystemStatus(data))
      .catch(() => {})
  }, [])

  function logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('username')
    setUser(null)
    setIsGuest(false)
    setActiveModule(null)
  }

  if (systemStatus.status === 'down') {
    return <Downtime cpuPercent={systemStatus.cpu_percent} nextReset={systemStatus.next_reset} />
  }

  const warningBanner = systemStatus.status === 'warning' ? (
    <div style={{ background: dark ? '#422006' : '#fffbeb', borderBottom: `1px solid ${dark ? '#854d0e' : '#fde68a'}`, padding: '0.6rem 1.5rem', textAlign: 'center', fontSize: '0.82rem', fontWeight: 600, color: dark ? '#fbbf24' : '#92400e' }}>
      ⚠️ System is under high load ({systemStatus.cpu_percent}% daily CPU used). Searches may be slower. Resets at midnight UTC.
    </div>
  ) : null

  if (!user && !isGuest) {
    if (showReg) return (
      <>
        {warningBanner}
        <Register onGoToLogin={(registered) => {
          setShowReg(false)
          if (registered) setLoginMsg('Account created! Wait for admin approval, then sign in.')
        }} />
      </>
    )
    return (
      <>
        {warningBanner}
        <Login
          onLogin={setUser}
          onGuestLogin={() => setIsGuest(true)}
          successMessage={loginMsg}
          onGoToRegister={() => { setLoginMsg(''); setShowReg(true) }}
        />
      </>
    )
  }

  const displayUser = isGuest ? 'Guest' : user

  if (!activeModule) return <>{warningBanner}<Dashboard user={displayUser} isGuest={isGuest} onSelectModule={setActiveModule} onLogout={logout} /></>
  if (activeModule === 'tasks') return <>{warningBanner}<TaskManager user={displayUser} onBack={() => setActiveModule(null)} onLogout={logout} /></>
  if (activeModule === 'oig') return <>{warningBanner}<OIGScreener user={displayUser} isGuest={isGuest} onBack={() => setActiveModule(null)} onLogout={logout} /></>
}

export default function AppWithTheme() {
  return <ThemeProvider><App /></ThemeProvider>
}