import { useState } from 'react'
import { api } from '../../api'
import { useTheme } from '../../ThemeContext'
import { getTheme } from '../../theme'

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

export default function OIGScreener({ user, isGuest, onBack, onLogout }) {
    const [form, setForm] = useState({ firstName: '', lastName: '', npi: '', busName: '' })
    const [results, setResults] = useState([])
    const [meta, setMeta] = useState({ total_count: 0, total_pages: 1, page: 1, page_size: 20 })
    const [pageSize, setPageSize] = useState(20)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [searched, setSearched] = useState(false)
    const { dark, toggleDark } = useTheme()
    const t = getTheme(dark)

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function fetchPage(page, size) {
        setLoading(true)
        setError('')
        try {
            const res = await api.searchOIG({ ...form, page, pageSize: size })
            const data = await res.json()
            if (data.error) { setError(data.error); return }
            setResults(data.results)
            setMeta(data)
            setCurrentPage(data.page)
            setSearched(true)
        } catch {
            setError('Could not connect to screening service.')
        } finally {
            setLoading(false)
        }
    }

    async function handleSearch(e) {
        e.preventDefault()
        setCurrentPage(1)
        await fetchPage(1, pageSize)
    }

    function handlePageSizeChange(e) {
        const newSize = Number(e.target.value)
        setPageSize(newSize)
        fetchPage(1, newSize)
    }

    function handlePageChange(page) {
        fetchPage(page, pageSize)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    function handleReset() {
        setForm({ firstName: '', lastName: '', npi: '', busName: '' })
        setResults([])
        setMeta({ total_count: 0, total_pages: 1, page: 1, page_size: 20 })
        setSearched(false)
        setError('')
    }

    const start = (meta.page - 1) * meta.page_size + 1
    const end = Math.min(meta.page * meta.page_size, meta.total_count)

    const inputStyle = { ...styles.input, background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }
    const btnStyle = { ...styles.backBtn, background: t.btnBg, color: t.btnText, border: `1px solid ${t.btnBorder}` }

    return (
        <div style={{ ...styles.card, background: t.card }}>
            <div style={styles.header}>
                <button onClick={onBack} style={btnStyle}>← Back</button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ color: t.textSub, fontSize: '1rem', fontWeight: 'bold' }}>👤 {user}</span>
                    <button onClick={toggleDark} title="Toggle dark mode" style={{ ...btnStyle, padding: '.35rem .5rem', fontSize: '.9rem' }}>{dark ? '☀️' : '🌙'}</button>
                    <button onClick={onLogout} style={btnStyle}>{isGuest ? 'Sign In' : 'Log out'}</button>
                </div>
            </div>

            <div style={{ paddingBottom: '20px' }}>
                <h1 style={{ ...styles.heading, color: t.text }}>🔍 OIG Exclusion Screener</h1>
                <p style={{ ...styles.sub, color: t.textSub }}>Search the federal LEIE database for excluded individuals</p>
            </div>

            <div style={{ ...styles.formCard, background: t.cardAlt, border: `1px solid ${t.border}` }}>
                <h2 style={{ ...styles.sectionTitle, color: t.text }}>Search Individual</h2>
                <form onSubmit={handleSearch}>
                    <div style={styles.fieldRow}>
                        <div style={styles.field}>
                            <label style={{ ...styles.label, color: t.textSub }}>First Name</label>
                            <input style={inputStyle} name="firstName" value={form.firstName} onChange={handleChange} placeholder="e.g. John" />
                        </div>
                        <div style={styles.field}>
                            <label style={{ ...styles.label, color: t.textSub }}>Last Name *</label>
                            <input style={inputStyle} name="lastName" value={form.lastName} onChange={handleChange} placeholder="e.g. Smith" />
                        </div>
                        <div style={styles.field}>
                            <label style={{ ...styles.label, color: t.textSub }}>Business Name (optional)</label>
                            <input style={inputStyle} name="busName" value={form.busName} onChange={handleChange} placeholder="e.g. Acme Health LLC" />
                        </div>
                        <div style={styles.field}>
                            <label style={{ ...styles.label, color: t.textSub }}>NPI (optional)</label>
                            <input style={inputStyle} name="npi" value={form.npi} onChange={handleChange} placeholder="e.g. 1234567890" />
                        </div>
                    </div>
                    {error && <p style={styles.error}>{error}</p>}
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                        <button type="submit" style={styles.searchBtn} disabled={loading}>
                            {loading ? 'Searching…' : '🔍 Search'}
                        </button>
                        {searched && <button type="button" onClick={handleReset} style={btnStyle}>Reset</button>}
                    </div>
                </form>
            </div>

            {searched && (
                <div style={{ ...styles.resultsCard, background: t.cardAlt, border: `1px solid ${t.border}` }}>
                    {meta.total_count === 0 ? (
                        <div style={styles.clearBox}>
                            <p style={{ color: '#15803d', fontWeight: 600, margin: 0 }}>✅ No exclusions found.</p>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 4 }}>
                                This individual does not appear on the OIG LEIE exclusion list. Document this result for your compliance records.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div style={styles.toolbar}>
                                <p style={{ fontSize: 13, color: t.textSub, margin: 0 }}>
                                    Showing <b>{start}–{end}</b> of <b>{meta.total_count}</b> result{meta.total_count !== 1 ? 's' : ''}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: t.textSub }}>
                                    Rows per page:
                                    <select style={{ ...styles.select, background: t.inputBg, color: t.text, border: `1px solid ${t.border}` }} value={pageSize} onChange={handlePageSizeChange}>
                                        {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div style={{ overflowX: 'auto' }}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            {['Name', 'Business / Practice', 'Specialty', 'NPI', 'State', 'Excl. Date', 'Status'].map(h => (
                                                <th key={h} style={{ ...styles.th, color: t.textSub, borderBottom: `1px solid ${t.border}` }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.map((r, i) => (
                                            <tr key={i}>
                                                <td style={{ ...styles.td, fontWeight: 600, color: t.text, borderBottom: `1px solid ${t.border}` }}>{r.lastname}{r.firstname ? `, ${r.firstname}` : ''} {r.midname}</td>
                                                <td style={{ ...styles.td, color: t.textSub, borderBottom: `1px solid ${t.border}` }}>{r.busname || '—'}</td>
                                                <td style={{ ...styles.td, color: t.text, borderBottom: `1px solid ${t.border}` }}>{r.specialty || '—'}</td>
                                                <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: 12, color: t.text, borderBottom: `1px solid ${t.border}` }}>{r.npi || '—'}</td>
                                                <td style={{ ...styles.td, color: t.text, borderBottom: `1px solid ${t.border}` }}>{r.state || '—'}</td>
                                                <td style={{ ...styles.td, color: t.text, borderBottom: `1px solid ${t.border}` }}>{r.excldate || '—'}</td>
                                                <td style={{ ...styles.td, borderBottom: `1px solid ${t.border}` }}>
                                                    {r.reindate && r.reindate !== '00000000'
                                                        ? <span style={styles.badgeGreen}>✅ Reinstated</span>
                                                        : <span style={styles.excludedBadge}>⛔ Excluded</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {meta.total_pages > 1 && (
                                <div style={styles.pagination}>
                                    <button style={{ ...styles.pgBtn, background: t.btnBg, color: t.btnText, border: `1px solid ${t.btnBorder}` }} disabled={currentPage === 1}
                                        onClick={() => handlePageChange(currentPage - 1)}>← Prev</button>

                                    {getPaginationRange(currentPage, meta.total_pages).map((p, i) =>
                                        p === '…'
                                            ? <span key={i} style={{ padding: '0 4px', color: t.textMuted, fontSize: 13 }}>…</span>
                                            : <button key={i}
                                                style={{ ...styles.pgBtn, background: t.btnBg, color: t.btnText, border: `1px solid ${t.btnBorder}`, ...(p === currentPage ? styles.pgBtnActive : {}) }}
                                                onClick={() => handlePageChange(p)}>{p}</button>
                                    )}

                                    <button style={{ ...styles.pgBtn, background: t.btnBg, color: t.btnText, border: `1px solid ${t.btnBorder}` }} disabled={currentPage === meta.total_pages}
                                        onClick={() => handlePageChange(currentPage + 1)}>Next →</button>

                                    <span style={{ fontSize: 12, color: t.textMuted, marginLeft: 8 }}>
                                        Page {currentPage} of {meta.total_pages}
                                    </span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

function getPaginationRange(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    if (current <= 4) return [1, 2, 3, 4, 5, '…', total]
    if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
    return [1, '…', current - 1, current, current + 1, '…', total]
}

const styles = {
    card: { background: '#fff', borderRadius: 16, padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', maxWidth: 900, margin: '0 auto', transition: 'background 0.2s' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
    heading: { fontSize: '1.6rem', fontWeight: 700, color: '#1e293b', marginBottom: 2 },
    sub: { color: '#64748b', fontSize: '0.875rem', margin: 0 },
    backBtn: { padding: '.35rem .85rem', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '.85rem', color: '#64748b' },
    formCard: { background: '#f8fafc', borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0' },
    sectionTitle: { fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: 12, marginTop: 0 },
    fieldRow: { display: 'flex', gap: 12, flexWrap: 'wrap' },
    field: { display: 'flex', flexDirection: 'column', gap: 4, flex: '1 1 160px' },
    label: { fontSize: '0.8rem', fontWeight: 600, color: '#475569' },
    input: { padding: '0.6rem 1rem', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: '0.95rem', outline: 'none' },
    error: { color: '#ef4444', background: '#fef2f2', padding: '0.5rem 1rem', borderRadius: 8, marginTop: 8 },
    searchBtn: { padding: '0.6rem 1.5rem', background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: 8, fontSize: '1rem', cursor: 'pointer', fontWeight: 600 },
    resultsCard: { background: '#f8fafc', borderRadius: 12, padding: '1.5rem', border: '1px solid #e2e8f0' },
    clearBox: { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '1rem 1.25rem' },
    toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 },
    select: { padding: '4px 8px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 13, color: '#1e293b', background: '#fff' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
    th: { textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', padding: '6px 10px', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.04em' },
    td: { padding: '9px 10px', borderBottom: '1px solid #f1f5f9', color: '#1e293b', verticalAlign: 'middle' },
    excludedBadge: { padding: '0.25rem 0.65rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, color: '#ef4444', background: '#fef2f2', whiteSpace: 'nowrap' },
    badgeGreen: { padding: '0.25rem 0.65rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, color: '#15803d', background: '#f0fdf4', whiteSpace: 'nowrap' },
    pagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 16, flexWrap: 'wrap' },
    pgBtn: { minWidth: 32, height: 28, padding: '0 8px', fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', cursor: 'pointer', color: '#475569' },
    pgBtnActive: { background: '#0ea5e9', color: '#fff', borderColor: '#0ea5e9', fontWeight: 600 },
}
