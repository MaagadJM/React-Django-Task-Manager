import { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/dashboard/index.jsx'
import TaskManager from './components/task-manager/index.jsx'
import OIGScreener from './components/oig-screener/index.jsx'
import { ThemeProvider } from './ThemeContext'

function App() {
  const [user, setUser] = useState(localStorage.getItem('username'))
  const [isGuest, setIsGuest] = useState(false)
  const [showReg, setShowReg] = useState(false)
  const [loginMsg, setLoginMsg] = useState('')
  const [activeModule, setActiveModule] = useState(null)

  function logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('username')
    setUser(null)
    setIsGuest(false)
    setActiveModule(null)
  }

  if (!user && !isGuest) {
    if (showReg) return (
      <Register onGoToLogin={(registered) => {
        setShowReg(false)
        if (registered) setLoginMsg('Account created! Wait for admin approval, then sign in.')
      }} />
    )
    return (
      <Login
        onLogin={setUser}
        onGuestLogin={() => setIsGuest(true)}
        successMessage={loginMsg}
        onGoToRegister={() => { setLoginMsg(''); setShowReg(true) }}
      />
    )
  }

  const displayUser = isGuest ? 'Guest' : user

  if (!activeModule) return <Dashboard user={displayUser} isGuest={isGuest} onSelectModule={setActiveModule} onLogout={logout} />
  if (activeModule === 'tasks') return <TaskManager user={displayUser} onBack={() => setActiveModule(null)} onLogout={logout} />
  if (activeModule === 'oig') return <OIGScreener user={displayUser} isGuest={isGuest} onBack={() => setActiveModule(null)} onLogout={logout} />
}

export default function AppWithTheme() {
  return <ThemeProvider><App /></ThemeProvider>
}