const modules = [
    {
        id: 'tasks',
        icon: '📋',
        title: 'Task Manager',
        description: 'Create, track, and manage your daily tasks.',
        color: '#6366f1',
        bg: '#eef2ff',
    },
    {
        id: 'oig',
        icon: '🔍',
        title: 'OIG Exclusion Screener',
        description: 'Verify individuals against the federal OIG LEIE exclusion database.',
        color: '#0ea5e9',
        bg: '#f0f9ff',
    },
]

export default function Dashboard({ user, onSelectModule, onLogout }) {
    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.heading}>Welcome back, {user} 👋</h1>
                        <p style={styles.sub}>Select a system to continue</p>
                    </div>
                    <button onClick={onLogout} style={styles.logoutBtn}>Log out</button>
                </div>

                <div style={styles.grid}>
                    {modules.map(mod => (
                        <button
                            key={mod.id}
                            onClick={() => onSelectModule(mod.id)}
                            style={{ ...styles.moduleCard, borderColor: mod.color, background: mod.bg }}
                        >
                            <span style={styles.icon}>{mod.icon}</span>
                            <h2 style={{ ...styles.modTitle, color: mod.color }}>{mod.title}</h2>
                            <p style={styles.modDesc}>{mod.description}</p>
                            <span style={{ ...styles.openBtn, background: mod.color }}>Open →</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

const styles = {
    wrapper: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' },
    card: { background: '#fff', borderRadius: 20, padding: '2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: '100%', maxWidth: 700 },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' },
    heading: { fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginBottom: 4 },
    sub: { color: '#64748b', fontSize: '0.9rem', margin: 0 },
    logoutBtn: { padding: '.35rem .85rem', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '.85rem', color: '#64748b' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 },
    moduleCard: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '1.5rem', borderRadius: 16, border: '2px solid', cursor: 'pointer', textAlign: 'left', gap: 8 },
    icon: { fontSize: '2rem' },
    modTitle: { fontSize: '1.1rem', fontWeight: 700, margin: 0 },
    modDesc: { color: '#64748b', fontSize: '0.85rem', margin: 0, flex: 1 },
    openBtn: { marginTop: 8, padding: '0.4rem 1rem', borderRadius: 8, color: '#fff', fontSize: '0.85rem', fontWeight: 600, border: 'none', cursor: 'pointer' },
}