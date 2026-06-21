import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

    useEffect(() => {
        document.body.setAttribute('data-theme', dark ? 'dark' : 'light')
        document.body.style.background = dark ? '#0f172a' : '#f0f4f8'
    }, [dark])

    function toggleDark() {
        setDark(prev => {
            localStorage.setItem('theme', prev ? 'light' : 'dark')
            return !prev
        })
    }

    return <ThemeContext.Provider value={{ dark, toggleDark }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
    return useContext(ThemeContext)
}
