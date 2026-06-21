import { useTheme } from '../ThemeContext'
import { getTheme } from '../theme'

export default function Downtime({ cpuPercent, nextReset }) {
    const { dark } = useTheme()
    const t = getTheme(dark)

    const resetTime = nextReset ? new Date(nextReset).toLocaleString() : 'midnight UTC'

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: t.pageBg, padding: '2rem', transition: 'background 0.2s' }}>
            <div style={{ background: t.card, borderRadius: 16, padding: '2.5rem', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', border: `1px solid ${t.border}`, transition: 'background 0.2s' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔧</div>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: t.text, margin: '0 0 0.75rem' }}>
                    System Temporarily Unavailable
                </h1>
                <p style={{ fontSize: '0.9rem', color: t.textSub, lineHeight: 1.7, margin: '0 0 1rem' }}>
                    Our server has reached its daily processing limit. All services will resume automatically after the quota resets.
                </p>
                <div style={{ background: dark ? '#1a2744' : '#eff6ff', border: `1px solid ${dark ? '#2d4a8a' : '#bfdbfe'}`, borderRadius: 10, padding: '0.85rem 1.25rem', marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '0.82rem', color: dark ? '#93c5fd' : '#1d4ed8', margin: 0, fontWeight: 600 }}>
                        Estimated reset: {resetTime}
                    </p>
                </div>
                <p style={{ fontSize: '0.78rem', color: t.textMuted, margin: 0 }}>
                    If you need urgent assistance, please contact your system administrator.
                </p>
            </div>
        </div>
    )
}
