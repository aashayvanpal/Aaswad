import React, { createContext, useContext, useState, useMemo } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { darkTheme, lightTheme } from '../theme'

const LS_KEY = 'aaswad-theme'

const ThemeContext = createContext({
    themeMode: 'dark',
    toggleTheme: () => {},
    setThemeMode: () => {},
})

export function AppThemeProvider({ children }) {
    const [themeMode, setThemeModeState] = useState(
        () => localStorage.getItem(LS_KEY) || 'dark'
    )

    const setThemeMode = (mode) => {
        localStorage.setItem(LS_KEY, mode)
        setThemeModeState(mode)
    }

    const toggleTheme = () => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')

    const theme = useMemo(
        () => themeMode === 'dark' ? darkTheme : lightTheme,
        [themeMode]
    )

    return (
        <ThemeContext.Provider value={{ themeMode, toggleTheme, setThemeMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline enableColorScheme />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    )
}

export const useAppTheme = () => useContext(ThemeContext)
