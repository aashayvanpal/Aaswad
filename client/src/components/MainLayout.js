import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Box, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Header from './Header'
import NavigationBar from './NavigationBar'

export default function MainLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#f5edc0' }}>
            <Header />
            <Box sx={{ display: 'flex' }}>
                {sidebarOpen && (
                    <NavigationBar onClose={() => setSidebarOpen(false)} />
                )}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    {!sidebarOpen && (
                        <IconButton
                            onClick={() => setSidebarOpen(true)}
                            sx={{
                                m: 1,
                                bgcolor: '#04045f',
                                color: 'white',
                                borderRadius: '20px',
                                fontWeight: 'bold',
                                '&:hover': { bgcolor: '#4c4cfd73' }
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Outlet />
                </Box>
            </Box>
        </Box>
    )
}
