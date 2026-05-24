import React from 'react'
import {
    Box, Card, CardContent, Divider, Typography, Chip, Avatar,
    List, ListItem, ListItemIcon, ListItemText, ToggleButtonGroup, ToggleButton,
} from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import PhoneIcon from '@mui/icons-material/Phone'
import PersonIcon from '@mui/icons-material/Person'
import UpdateIcon from '@mui/icons-material/Update'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import PaletteIcon from '@mui/icons-material/Palette'
import { appVersion } from '../config/main.client.js'
import { useAppTheme } from '../context/ThemeContext'

const GOLD = '#C9A227'
const GOLD_BORDER = 'rgba(201,162,39,0.28)'

export default function SettingsPage() {
    const { themeMode, setThemeMode } = useAppTheme()

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 640, mx: 'auto' }}>
            <Typography variant="h5" fontWeight={700} gutterBottom sx={{ color: GOLD }}>
                Settings
            </Typography>

            {/* Theme */}
            <Card variant="outlined" sx={{ borderColor: GOLD_BORDER, borderRadius: 3, mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <PaletteIcon sx={{ color: GOLD, fontSize: '1.1rem' }} />
                        <Typography variant="overline" fontWeight={700} sx={{ color: GOLD, lineHeight: 1 }}>
                            Appearance
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 2.5, borderColor: GOLD_BORDER }} />

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography variant="subtitle2" fontWeight={700}>
                                Theme
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                                {themeMode === 'dark' ? 'Dark — gold on black' : 'Light — warm ivory'}
                            </Typography>
                        </Box>

                        <ToggleButtonGroup
                            value={themeMode}
                            exclusive
                            onChange={(_, val) => { if (val) setThemeMode(val) }}
                            size="small"
                            sx={{
                                '& .MuiToggleButton-root': {
                                    border: `1px solid ${GOLD_BORDER}`,
                                    color: 'text.secondary',
                                    px: 2,
                                    gap: 0.75,
                                    fontSize: '0.78rem',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    '&.Mui-selected': {
                                        bgcolor: GOLD,
                                        color: '#1a1400',
                                        borderColor: GOLD,
                                        '&:hover': { bgcolor: '#e8c84d' },
                                    },
                                },
                            }}
                        >
                            <ToggleButton value="dark">
                                <DarkModeIcon sx={{ fontSize: '0.95rem' }} />
                                Dark
                            </ToggleButton>
                            <ToggleButton value="light">
                                <LightModeIcon sx={{ fontSize: '0.95rem' }} />
                                Light
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                </CardContent>
            </Card>

            {/* App info */}
            <Card variant="outlined" sx={{ borderColor: GOLD_BORDER, borderRadius: 3, mb: 3 }}>
                <CardContent>
                    <Typography variant="overline" color="text.secondary" fontWeight={600}>
                        App Info
                    </Typography>
                    <Divider sx={{ mb: 2, borderColor: GOLD_BORDER }} />
                    <List disablePadding>
                        <ListItem disableGutters>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <UpdateIcon sx={{ color: GOLD }} />
                            </ListItemIcon>
                            <ListItemText
                                primary="App Version"
                                secondary={
                                    <Chip label={appVersion} size="small" sx={{
                                        mt: 0.5, bgcolor: GOLD, color: '#3d2e00', fontWeight: 700, fontSize: '0.75rem',
                                    }} />
                                }
                            />
                        </ListItem>

                        <Divider sx={{ borderColor: GOLD_BORDER, my: 1 }} />

                        <ListItem disableGutters>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <PersonIcon sx={{ color: GOLD }} />
                            </ListItemIcon>
                            <ListItemText primary="Created By" secondary="Aashay S Vanpal" />
                        </ListItem>

                        <Divider sx={{ borderColor: GOLD_BORDER, my: 1 }} />

                        <ListItem disableGutters>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <PhoneIcon sx={{ color: GOLD }} />
                            </ListItemIcon>
                            <ListItemText primary="Support Contact" secondary="9743419673" />
                        </ListItem>
                    </List>
                </CardContent>
            </Card>

            <Card variant="outlined" sx={{ borderColor: GOLD_BORDER, borderRadius: 3 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: GOLD, color: '#3d2e00', width: 48, height: 48, fontWeight: 700 }}>
                        AC
                    </Avatar>
                    <Box>
                        <Typography fontWeight={700}>Aaswad Caterers</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Order management system
                        </Typography>
                    </Box>
                    <InfoIcon sx={{ color: GOLD_BORDER, ml: 'auto' }} />
                </CardContent>
            </Card>
        </Box>
    )
}
