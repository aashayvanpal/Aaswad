import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import logo from '../images/aaswad-logo.svg'
import NavigationBar from './NavigationBar'
import UserOptions from './UserOptions'
import { useAppTheme } from '../context/ThemeContext'
import './Header.scss'

const SIDEBAR_W = 240
const SIDEBAR_COLLAPSED_W = 64

export default function MainLayout() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const [mobileOpen, setMobileOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const { themeMode } = useAppTheme()
    const isDark = themeMode === 'dark'

    const sidebarW = collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_W

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: isDark ? '#0f0e0b' : '#FDFAF4' }}>

            {/* Desktop: persistent sidebar */}
            {!isMobile && (
                <Box sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    height: '100vh',
                    zIndex: 1200,
                    width: sidebarW,
                    transition: 'width 0.22s cubic-bezier(.4,0,.2,1)',
                }}>
                    <NavigationBar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
                </Box>
            )}

            {/* Mobile: temporary drawer */}
            {isMobile && (
                <Drawer
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    variant="temporary"
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: SIDEBAR_W,
                            boxSizing: 'border-box',
                            border: 'none',
                        },
                    }}
                >
                    <NavigationBar onClose={() => setMobileOpen(false)} />
                </Drawer>
            )}

            {/* Main content column */}
            <Box sx={{
                flex: 1,
                ml: isMobile ? 0 : `${sidebarW}px`,
                transition: 'margin-left 0.22s cubic-bezier(.4,0,.2,1)',
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
            }}>
                {/* Top bar */}
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        bgcolor: isDark ? '#1a1400' : '#ffffff',
                        borderBottom: '1.5px solid rgba(201,162,39,0.3)',
                        zIndex: 1100,
                    }}
                >
                    <Toolbar sx={{ gap: 1, minHeight: { xs: 52, sm: 56 }, px: { xs: 1.5, sm: 2 } }}>
                        {isMobile && (
                            <IconButton
                                onClick={() => setMobileOpen(true)}
                                size="small"
                                sx={{ color: 'rgba(201,162,39,0.65)', '&:hover': { color: '#C9A227' } }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}

                        <Link to="/" className="header-logo-link" style={{ marginLeft: 4 }}>
                            <img src={logo} alt="Aaswad" className="header-logo-img" style={{ height: 30 }} />
                        </Link>

                        <Box sx={{ flex: 1 }} />
                        <UserOptions />
                    </Toolbar>
                </AppBar>

                {/* Page content */}
                <Box sx={{ flex: 1 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    )
}
