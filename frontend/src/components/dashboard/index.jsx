import { useState } from 'react'
import { useTheme } from '../../ThemeContext'
import { getTheme } from '../../theme'

const modules = [
    {
        id: 'tasks',
        icon: '📋',
        title: 'Task Manager',
        description: 'Create, track, and manage your daily tasks.',
        tooltip: 'Add, edit, complete, and delete personal tasks. Tasks are private to your account.',
        color: '#6366f1',
        bg: '#eef2ff',
    },
    {
        id: 'oig',
        icon: '🔍',
        title: 'OIG Exclusion Screener',
        description: 'Verify individuals against the federal OIG LEIE exclusion database.',
        tooltip: 'Search the U.S. Office of Inspector General\'s List of Excluded Individuals/Entities (LEIE) to check if a person or business is excluded from federal healthcare programs.',
        color: '#0ea5e9',
        bg: '#f0f9ff',
    },
]

export default function Dashboard({ user, isGuest, onSelectModule, onLogout }) {
    const [activeTooltip, setActiveTooltip] = useState(null)
    const [showGuestModal, setShowGuestModal] = useState(false)
    const { dark, toggleDark } = useTheme()
    const t = getTheme(dark)

    function handleModuleClick(modId) {
        if (isGuest && modId === 'tasks') {
            setShowGuestModal(true)
        } else {
            onSelectModule(modId)
        }
    }

    return (
        <div style={{ ...styles.wrapper, background: t.pageBg }}>
            <div style={{ ...styles.card, background: t.card }}>
                <div style={styles.header}>
                    <div>
                        <h1 style={{ ...styles.heading, color: t.text }}>Welcome back, {user} 👋</h1>
                        <p style={{ ...styles.sub, color: t.textSub }}>Select a system to continue</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button onClick={toggleDark} title="Toggle dark mode" style={{ ...styles.iconBtn, background: t.btnBg, color: t.btnText, border: `1px solid ${t.btnBorder}` }}>
                            {dark ? '☀️' : '🌙'}
                        </button>
                        <button onClick={onLogout} style={{ ...styles.logoutBtn, background: t.btnBg, color: t.btnText, border: `1px solid ${t.btnBorder}` }}>Log out</button>
                    </div>
                </div>

                <div style={styles.grid}>
                    {modules.map(mod => (
                        <button
                            key={mod.id}
                            onClick={() => handleModuleClick(mod.id)}
                            style={{ ...styles.moduleCard, borderColor: mod.color, background: dark ? t.card : mod.bg }}
                        >
                            <div style={styles.cardTop}>
                                <span style={styles.icon}>{mod.icon}</span>
                                <div style={styles.infoWrapper}>
                                    <span
                                        style={styles.infoIcon}
                                        onMouseEnter={() => setActiveTooltip(mod.id)}
                                        onMouseLeave={() => setActiveTooltip(null)}
                                        onClick={e => { e.stopPropagation(); setActiveTooltip(activeTooltip === mod.id ? null : mod.id) }}
                                    >ℹ</span>
                                    {activeTooltip === mod.id && (
                                        <div style={styles.tooltip}>{mod.tooltip}</div>
                                    )}
                                </div>
                            </div>
                            <h2 style={{ ...styles.modTitle, color: mod.color }}>{mod.title}</h2>
                            <p style={{ ...styles.modDesc, color: t.textSub }}>{mod.description}</p>
                            <span style={{ ...styles.openBtn, background: mod.color }}>Open →</span>
                        </button>
                    ))}
                </div>
            </div>

            {showGuestModal && (
                <div style={styles.modalOverlay}>
                    <div style={{ ...styles.modal, background: t.card }}>
                        <h2 style={{ ...styles.modalTitle, color: t.text }}>Account required</h2>
                        <p style={{ ...styles.modalText, color: t.textSub }}>
                            Task Manager saves your tasks to your account. Create a free account or sign in to use this feature.
                        </p>
                        <div style={styles.modalBtns}>
                            <button onClick={onLogout} style={styles.modalPrimaryBtn}>Sign In / Register</button>
                            <button onClick={() => setShowGuestModal(false)} style={{ ...styles.modalCancelBtn, background: t.btnBg, color: t.btnText, border: `1px solid ${t.btnBorder}` }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const styles = {
    wrapper: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', transition: 'background 0.2s' },
    card: { background: '#fff', borderRadius: 20, padding: '2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: '100%', maxWidth: 700, transition: 'background 0.2s' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' },
    heading: { fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginBottom: 4 },
    sub: { color: '#64748b', fontSize: '0.9rem', margin: 0 },
    logoutBtn: { padding: '.35rem .85rem', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '.85rem', color: '#64748b' },
    iconBtn: { padding: '.35rem .5rem', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '.9rem', lineHeight: 1 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 },
    moduleCard: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '1.5rem', borderRadius: 16, border: '2px solid', cursor: 'pointer', textAlign: 'left', gap: 8 },
    cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' },
    icon: { fontSize: '2rem' },
    infoWrapper: { position: 'relative' },
    infoIcon: { width: 20, height: 20, borderRadius: '50%', background: '#cbd5e1', color: '#475569', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', userSelect: 'none', fontStyle: 'normal' },
    tooltip: { position: 'absolute', top: 24, right: 0, width: 220, background: '#1e293b', color: '#f8fafc', fontSize: '0.78rem', lineHeight: 1.5, padding: '0.6rem 0.8rem', borderRadius: 8, zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.2)', pointerEvents: 'none' },
    modTitle: { fontSize: '1.1rem', fontWeight: 700, margin: 0 },
    modDesc: { color: '#64748b', fontSize: '0.85rem', margin: 0, flex: 1 },
    openBtn: { marginTop: 8, padding: '0.4rem 1rem', borderRadius: 8, color: '#fff', fontSize: '0.85rem', fontWeight: 600, border: 'none', cursor: 'pointer' },
    modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
    modal: { background: '#fff', borderRadius: 16, padding: '2rem', maxWidth: 380, width: '90%', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' },
    modalTitle: { fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', margin: '0 0 0.75rem' },
    modalText: { color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 1.5rem' },
    modalBtns: { display: 'flex', gap: 8 },
    modalPrimaryBtn: { flex: 1, padding: '0.65rem', borderRadius: 8, background: '#6366f1', color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' },
    modalCancelBtn: { padding: '0.65rem 1rem', borderRadius: 8, background: '#fff', color: '#64748b', border: '1px solid #e2e8f0', fontSize: '0.9rem', cursor: 'pointer' },
}
