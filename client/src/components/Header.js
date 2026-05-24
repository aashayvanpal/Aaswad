import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import logo from '../images/aaswad-logo.svg'
import './Header.scss'
import UserOptions from './UserOptions.js'
import { Link } from 'react-router-dom'

export default function Header() {
    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: '#1a1400',
                borderBottom: '2px solid #C9A227',
            }}
        >
            <Toolbar sx={{ px: { xs: 2, sm: 3 }, gap: 2, minHeight: { xs: 56, sm: 64 } }}>
                {/* Logo */}
                <Link to="/" className="header-logo-link">
                    <img src={logo} alt="Aaswad Caterers" className="header-logo-img" />
                </Link>

                <Box sx={{ flex: 1 }} />

                {/* Nav links */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                        component={Link}
                        to="/menu"
                        sx={{
                            color: '#C9A227', fontWeight: 700, fontSize: '0.9rem',
                            textTransform: 'none', letterSpacing: 0.3,
                            '&:hover': { bgcolor: 'rgba(201,162,39,0.12)' },
                        }}
                    >
                        Menu
                    </Button>
                    <Button
                        component={Link}
                        to="/contact"
                        sx={{
                            color: '#C9A227', fontWeight: 700, fontSize: '0.9rem',
                            textTransform: 'none', letterSpacing: 0.3,
                            '&:hover': { bgcolor: 'rgba(201,162,39,0.12)' },
                        }}
                    >
                        Contact Us
                    </Button>
                    <Button
                        component={Link}
                        to="/SignIn"
                        variant="contained"
                        sx={{
                            bgcolor: '#C9A227', color: '#3d2e00', fontWeight: 800,
                            fontSize: '0.9rem', textTransform: 'none',
                            borderRadius: '10px', px: 2.5,
                            '&:hover': { bgcolor: '#e8c84d' },
                        }}
                    >
                        Order Now
                    </Button>
                    <UserOptions />
                </Box>
            </Toolbar>
        </AppBar>
    )
}
