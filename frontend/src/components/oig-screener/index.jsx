import { useState } from 'react'
import { api } from '../../api'

export default function OIGScreener({ user, onBack, onLogout }) {
    const [form, setForm] = useState({ firstName: '', lastName: '', busName: '', npi: '' })
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSearch(e) {
        e.preventDefault()
        if (!form.lastName.trim() && !form.busName.trim())
            return setError('Last name or business name is required.')
        setError('')
        setLoading(true)
        setResults(null)
        try {
            const res = await api.searchOIG(form)
            const data = await res.json()
            setResults(data)
        } catch { setError('Could not connect to screening service.') }
        finally { setLoading(false) }
    }

    function handleReset() {
        setForm({ firstName: '', lastName: '', busName: '', npi: '' })
        setResults(null)
        setError('')
    }

    return (
        <div style={styles.card}>
            {/* Header */}
            <div style={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={onBack} style={styles.backBtn}>← Back</button>
                    <div>
                        <h1 style={styles.heading}>🔍 OIG Exclusion Screener</h1>
                        <p style={styles.sub}>Search the federal LEIE database for excluded individuals</p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ color: '#64748b', fontSize: '.9rem' }}>👤 {user}</span>
                    <button onClick={onLogout} style={styles.logoutBtn}>Log out</button>
                </div>
            </div>

            {/* Search Form */}
            <div style={styles.formCard}>
                <h2 style={styles.sectionTitle}>Search Individual</h2>
                <form onSubmit={handleSearch}>
                    <div style={styles.fieldRow}>
                        <div style={styles.field}>
                            <label style={styles.label}>First Name</label>
                            <input style={styles.input} name="firstName" value={form.firstName} onChange={handleChange} placeholder="e.g. John" />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Last Name *</label>
                            <input style={styles.input} name="lastName" value={form.lastName} onChange={handleChange} placeholder="e.g. Smith" />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Business Name (optional)</label>
                            <input style={styles.input} name="busName" value={form.busName} onChange={handleChange} placeholder="e.g. Acme Health LLC" />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>NPI (optional)</label>
                            <input style={styles.input} name="npi" value={form.npi} onChange={handleChange} placeholder="e.g. 1234567890" />
                        </div>
                    </div>
                    {error && <p style={styles.error}>{error}</p>}
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                        <button type="submit" style={styles.searchBtn} disabled={loading}>
                            {loading ? 'Searching…' : '🔍 Search'}
                        </button>
                        {results !== null && <button type="button" onClick={handleReset} style={styles.resetBtn}>Reset</button>}
                    </div>
                </form>
            </div>

            {/* Results */}
            {results !== null && (
                <div style={styles.resultsCard}>
                    <h2 style={styles.sectionTitle}>
                        Results <span style={{ fontWeight: 400, color: '#64748b' }}>{results.length} found</span>
                    </h2>

                    {results.length === 0 ? (
                        <div style={styles.clearBox}>
                            <p style={{ color: '#15803d', fontWeight: 600, margin: 0 }}>✅ No exclusions found.</p>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 4 }}>
                                This individual does not appear on the OIG LEIE exclusion list. Document this result for your compliance records.
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {results.map((r, i) => (
                                <div key={i} style={styles.resultItem}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <p style={styles.name}>{r.lastname}, {r.firstname} {r.midname}</p>
                                            <p style={styles.meta}>Exclusion Type: <b>{r.excltype}</b> · Date: {r.excldate}</p>
                                            {r.npi && <p style={styles.meta}>NPI: {r.npi}</p>}
                                            {r.specialty && <p style={styles.meta}>Specialty: {r.specialty}</p>}
                                            {r.reindate && <p style={{ ...styles.meta, color: '#f59e0b' }}>Reinstatement Date: {r.reindate}</p>}
                                        </div>
                                        <span style={styles.excludedBadge}>⛔ EXCLUDED</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

const styles = {
    card: { background: '#fff', borderRadius: 16, padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', maxWidth: 900, margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
    heading: { fontSize: '1.6rem', fontWeight: 700, color: '#1e293b', marginBottom: 2 },
    sub: { color: '#64748b', fontSize: '0.875rem', margin: 0 },
    backBtn: { padding: '.35rem .85rem', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '.85rem', color: '#64748b' },
    logoutBtn: { padding: '.35rem .85rem', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '.85rem', color: '#64748b' },
    formCard: { background: '#f8fafc', borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0' },
    sectionTitle: { fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: 12, marginTop: 0 },
    fieldRow: { display: 'flex', gap: 12, flexWrap: 'wrap' },
    field: { display: 'flex', flexDirection: 'column', gap: 4, flex: '1 1 160px' },
    label: { fontSize: '0.8rem', fontWeight: 600, color: '#475569' },
    input: { padding: '0.6rem 1rem', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: '0.95rem', outline: 'none' },
    error: { color: '#ef4444', background: '#fef2f2', padding: '0.5rem 1rem', borderRadius: 8, marginTop: 8 },
    searchBtn: { padding: '0.6rem 1.5rem', background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: 8, fontSize: '1rem', cursor: 'pointer', fontWeight: 600 },
    resetBtn: { padding: '0.6rem 1rem', background: '#fff', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.95rem', cursor: 'pointer' },
    resultsCard: { background: '#f8fafc', borderRadius: 12, padding: '1.5rem', border: '1px solid #e2e8f0' },
    clearBox: { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '1rem 1.25rem' },
    resultItem: { background: '#fff', border: '1.5px solid #fecaca', borderRadius: 10, padding: '1rem 1.25rem' },
    excludedBadge: { padding: '0.35rem 0.75rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700, color: '#ef4444', background: '#fef2f2', whiteSpace: 'nowrap' },
    name: { fontWeight: 700, color: '#1e293b', margin: '0 0 4px 0', fontSize: '1rem' },
    meta: { color: '#64748b', fontSize: '0.82rem', margin: '2px 0 0 0' },
}