import React, { useState, useEffect } from 'react'
import axios from '../config/axios'
import './Menu.scss'
import CartModel from './CartModel.js'
import noItemFound from '../images/no-item-found.svg'
import LoadingSpinner from './LoadingSpinner.js'
import { getUserDetails } from '../assets/user-functions.js'
import { useSelector, useDispatch } from 'react-redux'
import { addItem, removeItem, clearCart } from '../store/slices/cartSlice'
import { Link } from 'react-router-dom'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import Drawer from '@mui/material/Drawer'
import InputAdornment from '@mui/material/InputAdornment'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import CheckIcon from '@mui/icons-material/Check'
import Tooltip from '@mui/material/Tooltip'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import NavigationBar from './NavigationBar'
import UserOptions from './UserOptions'
import { useAppTheme } from '../context/ThemeContext'

const SIDEBAR_W = 240
const SIDEBAR_COLLAPSED_W = 64

const CATEGORIES = ['all', 'breakfast', 'lunch', 'dinner', 'sweets', 'snacks', 'special']

const Menu = () => {
    const [items, setItems] = useState([])
    const [searchFilter, setSearchFilter] = useState([])
    const [inputSearch, setInputSearch] = useState('')
    const [username, setUserName] = useState('')
    const [userType, setUserType] = useState(false)
    const [spinnerLoading, setSpinnerLoading] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [category, setCategory] = useState('all')
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const muiTheme = useTheme()
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'))
    const { themeMode } = useAppTheme()
    const isDark = themeMode === 'dark'

    // ── colour tokens ──────────────────────────────────────────────
    const pageBg         = isDark ? '#0f0e0b'                    : '#E8DCC8'
    const barBg          = isDark ? '#1a1800'                    : '#F5ECD8'
    const barBorder      = isDark ? 'rgba(201,162,39,0.18)'      : 'rgba(139,95,10,0.3)'
    const cardBg         = isDark ? 'rgba(255,255,255,0.025)'    : '#FFFDF7'
    const cardBorder     = isDark ? 'rgba(255,255,255,0.06)'     : 'rgba(139,95,10,0.2)'
    const cardShadow     = isDark ? 'none'                       : '0 2px 12px rgba(100,65,0,0.12)'
    const cardBorderActive = '#C9A227'
    const cardBgActive   = isDark ? 'rgba(201,162,39,0.07)'      : 'rgba(201,162,39,0.12)'
    const nameColor      = isDark ? 'rgba(255,255,255,0.78)'     : '#2a1500'
    const catColor       = isDark ? 'rgba(201,162,39,0.38)'      : '#8B5F0A'
    const searchInputColor = isDark ? '#fff'                     : '#1a0f00'
    const searchPlaceholder = isDark ? 'rgba(255,255,255,0.25)'  : 'rgba(60,35,0,0.4)'
    const searchBorder   = isDark ? 'rgba(201,162,39,0.18)'      : 'rgba(139,95,10,0.35)'
    const cartBarBg      = isDark ? 'rgba(15,14,11,0.97)'        : 'rgba(232,220,200,0.97)'
    // light-mode text tokens — solid and readable on parchment
    const adminText      = isDark ? 'rgba(201,162,39,0.55)'      : '#5a3e00'
    const mutedAction    = isDark ? 'rgba(201,162,39,0.65)'      : '#7a5500'
    const mutedBorder    = isDark ? 'rgba(201,162,39,0.18)'      : 'rgba(139,95,10,0.35)'
    const iconColor      = isDark ? 'rgba(201,162,39,0.65)'      : '#7a5500'

    const dispatch = useDispatch()
    const cartItems = useSelector(state => state.cart.items)
    const cartItemIds = cartItems.map(i => i._id)
    const cartCount = cartItems.length

    useEffect(() => {
        getUserDetails()
            .then(res => {
                setUserName(res.username)
                setUserType(res.userType)
                getUserMenu()
            })
            .catch(() => {
                window.alert('Please login, you will be redirected')
                window.location.href = '/signin'
            })
    }, [])

    const getUserMenu = () => {
        axios.get('/api/menu', { headers: { 'x-auth': localStorage.getItem('token') } })
            .then(response => {
                const allItems = response.data.filter(item => item.display === true)
                setItems(allItems)
                setSearchFilter(allItems)
                setSpinnerLoading(false)
            })
            .catch(err => console.log(err))
    }

    const toggleItem = (item) => {
        if (cartItemIds.includes(item._id)) dispatch(removeItem(item._id))
        else dispatch(addItem({ ...item, quantity: 1 }))
    }

    const applyFilters = (search, cat) => {
        let filtered = items
        if (search) filtered = filtered.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
        if (cat !== 'all') filtered = filtered.filter(i => Array.isArray(i.category) ? i.category.some(c => c.toLowerCase() === cat.toLowerCase()) : String(i.category).toLowerCase() === cat.toLowerCase())
        setSearchFilter(filtered)
    }

    const handleSearch = (value) => {
        setInputSearch(value)
        applyFilters(value, category)
    }

    const handleCategory = (_, value) => {
        setCategory(value)
        applyFilters(inputSearch, value)
    }

    const clearSearch = () => {
        setInputSearch('')
        setCategory('all')
        setSearchFilter(items)
    }

    const sidebarW = collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_W

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: pageBg }}>

            {/* Desktop: persistent sidebar — same pattern as MainLayout */}
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
                    sx={{ '& .MuiDrawer-paper': { width: SIDEBAR_W, border: 'none' } }}
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
                pb: '80px',
            }}>

            {/* Top bar — sticky so hamburger is always accessible */}
            <Box sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1100,
                bgcolor: barBg,
                borderBottom: `1px solid ${barBorder}`,
                px: { xs: 2, sm: 3 },
                pt: 2,
                pb: 0,
            }}>
                {/* Admin strip */}
                {userType === 'Admin' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
                        <Typography sx={{ color: adminText, fontSize: '0.68rem', fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>
                            Admin · {username}
                        </Typography>
                        <Button
                            size="small"
                            onClick={() => dispatch(clearCart())}
                            startIcon={<DeleteSweepIcon sx={{ fontSize: '0.85rem !important' }} />}
                            sx={{
                                color: mutedAction, fontSize: '0.68rem',
                                border: `1px solid ${mutedBorder}`,
                                borderRadius: '6px', py: 0.25, px: 0.75,
                                '&:hover': { bgcolor: 'rgba(201,162,39,0.07)' },
                            }}
                        >
                            Clear Cart
                        </Button>
                    </Box>
                )}

                {/* Search row */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Typography sx={{
                        color: '#C9A227', fontWeight: 800,
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        letterSpacing: 0.5,
                        flexShrink: 0,
                    }}>
                        Menu
                    </Typography>
                    <TextField
                        value={inputSearch}
                        onChange={e => handleSearch(e.target.value)}
                        placeholder="Search dishes…"
                        size="small"
                        sx={{
                            flex: 1,
                            maxWidth: 340,
                            '& .MuiOutlinedInput-root': {
                                bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,253,247,0.9)',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                color: searchInputColor,
                                '& fieldset': { borderColor: searchBorder },
                                '&:hover fieldset': { borderColor: 'rgba(201,162,39,0.5)' },
                                '&.Mui-focused fieldset': { borderColor: '#C9A227' },
                            },
                            '& input::placeholder': { color: searchPlaceholder, opacity: 1 },
                        }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: 'rgba(201,162,39,0.45)', fontSize: '0.95rem' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: inputSearch ? (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={clearSearch} sx={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(60,35,0,0.4)', p: 0.25 }}>
                                            <ClearIcon sx={{ fontSize: '0.8rem' }} />
                                        </IconButton>
                                    </InputAdornment>
                                ) : null,
                            },
                        }}
                    />
                    <Chip
                        label={searchFilter.length}
                        size="small"
                        sx={{
                            bgcolor: isDark ? 'rgba(201,162,39,0.1)' : 'rgba(139,95,10,0.12)',
                            color: isDark ? 'rgba(201,162,39,0.7)' : '#5a3e00',
                            fontWeight: 700,
                            fontSize: '0.68rem',
                            height: 20,
                            '& .MuiChip-label': { px: 1 },
                        }}
                    />

                    {/* Spacer */}
                    <Box sx={{ flex: 1 }} />

                    {/* Contact Us */}
                    <Tooltip title="Contact Us" placement="bottom">
                        <IconButton
                            component={Link}
                            to="/contact"
                            size="small"
                            sx={{
                                color: isDark ? 'rgba(201,162,39,0.55)' : '#7a5500',
                                border: `1px solid ${isDark ? 'rgba(201,162,39,0.2)' : 'rgba(139,95,10,0.3)'}`,
                                borderRadius: '8px',
                                p: 0.6,
                                '&:hover': {
                                    color: '#C9A227',
                                    bgcolor: 'rgba(201,162,39,0.08)',
                                    borderColor: 'rgba(201,162,39,0.5)',
                                },
                                transition: 'all 0.15s ease',
                                flexShrink: 0,
                            }}
                        >
                            <PhoneOutlinedIcon sx={{ fontSize: '1.1rem' }} />
                        </IconButton>
                    </Tooltip>

                    {/* User account */}
                    <UserOptions />
                </Box>

                {/* Category chips */}
                <Box sx={{
                    display: 'flex',
                    gap: 0.75,
                    pt: 0.5,
                    pb: 1.5,
                    px: 0.5,
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': { display: 'none' },
                    scrollbarWidth: 'none',
                }}>
                    {CATEGORIES.map(cat => {
                        const isActive = category === cat
                        const label = cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)
                        return (
                            <Chip
                                key={cat}
                                label={label}
                                onClick={() => handleCategory(null, cat)}
                                size="small"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: '0.72rem',
                                    letterSpacing: 0.3,
                                    cursor: 'pointer',
                                    flexShrink: 0,
                                    height: 28,
                                    bgcolor: isActive
                                        ? '#C9A227'
                                        : isDark ? 'rgba(201,162,39,0.08)' : 'rgba(139,95,10,0.08)',
                                    color: isActive
                                        ? '#1a1400'
                                        : isDark ? 'rgba(255,255,255,0.55)' : '#5a3e00',
                                    border: isActive
                                        ? '1.5px solid #C9A227'
                                        : isDark ? '1.5px solid rgba(201,162,39,0.2)' : '1.5px solid rgba(139,95,10,0.3)',
                                    '&:hover': {
                                        bgcolor: isActive ? '#e8c84d' : 'rgba(201,162,39,0.15)',
                                        color: isActive ? '#1a1400' : '#C9A227',
                                    },
                                    transition: 'all 0.15s ease',
                                }}
                            />
                        )
                    })}
                </Box>
            </Box>

            {showAlert && (
                <Alert
                    severity="success"
                    sx={{ bgcolor: 'rgba(201,162,39,0.08)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.25)', mx: 2, mt: 1.5 }}
                    onClose={() => setShowAlert(false)}
                >
                    Enquiry submitted!&nbsp;
                    <Link to='/myOrders' className="menu-alert-link">View status</Link>
                </Alert>
            )}

            {/* Item grid */}
            <Box sx={{ flex: 1, px: { xs: 1.5, sm: 2 }, py: 2 }}>
                {spinnerLoading ? (
                    <LoadingSpinner LoadingSpinner={spinnerLoading} />
                ) : searchFilter.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography sx={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)', mb: 2, fontSize: '0.85rem' }}>
                            No items found
                        </Typography>
                        <img src={noItemFound} alt="no-item-found" className="menu-no-items-img" style={{ opacity: 0.4 }} />
                    </Box>
                ) : (
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: 'repeat(2, 1fr)',
                            sm: 'repeat(3, 1fr)',
                            md: 'repeat(4, 1fr)',
                            lg: 'repeat(5, 1fr)',
                            xl: 'repeat(6, 1fr)',
                        },
                        gap: { xs: 1, sm: 1.25 },
                    }}>
                        {searchFilter.map((item) => {
                            const selected = cartItemIds.includes(item._id)
                            return (
                                <Box
                                    key={item._id}
                                    onClick={() => toggleItem(item)}
                                    sx={{
                                        borderRadius: '10px',
                                                        border: selected
                                            ? `1.5px solid ${cardBorderActive}`
                                            : `1.5px solid ${cardBorder}`,
                                        bgcolor: selected ? cardBgActive : cardBg,
                                        boxShadow: selected ? 'none' : cardShadow,
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                        transition: 'all 0.14s ease',
                                        '&:hover': {
                                            border: '1.5px solid rgba(201,162,39,0.45)',
                                            bgcolor: 'rgba(201,162,39,0.04)',
                                            transform: 'translateY(-1px)',
                                        },
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    {/* Image */}
                                    <Box sx={{
                                        position: 'relative',
                                        height: { xs: 88, sm: 108, md: 118 },
                                        overflow: 'hidden',
                                        bgcolor: 'rgba(255,255,255,0.03)',
                                    }}>
                                        <img
                                            src={`/images/food-item-images/${item.imgUrl}`}
                                            alt={item.name}
                                            className="menu-item-img"
                                            onError={e => { e.target.style.display = 'none' }}
                                        />
                                        {selected && (
                                            <Box sx={{
                                                position: 'absolute', inset: 0,
                                                bgcolor: 'rgba(201,162,39,0.15)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <Box sx={{
                                                    bgcolor: '#C9A227', borderRadius: '50%',
                                                    width: 26, height: 26,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}>
                                                    <CheckIcon sx={{ fontSize: '0.88rem', color: '#1a1400' }} />
                                                </Box>
                                            </Box>
                                        )}
                                    </Box>

                                    {/* Info */}
                                    <Box sx={{ p: { xs: 0.875, sm: 1 } }}>
                                        <Typography sx={{
                                            fontWeight: 600,
                                            fontSize: { xs: '0.82rem', sm: '0.9rem' },
                                            color: selected ? '#C9A227' : nameColor,
                                            lineHeight: 1.3,
                                            mb: 0.5,
                                        }}>
                                            {item.name}
                                        </Typography>
                                        {(() => {
                                            const cat = Array.isArray(item.category) ? item.category[0] : item.category
                                            if (!cat || String(cat).toLowerCase() === 'all') return null
                                            const label = String(cat).charAt(0).toUpperCase() + String(cat).slice(1)
                                            return (
                                            <Chip
                                                label={label}
                                                size="small"
                                                sx={{
                                                    height: 18,
                                                    fontSize: '0.6rem',
                                                    fontWeight: 700,
                                                    letterSpacing: 0.3,
                                                    bgcolor: isDark ? 'rgba(201,162,39,0.1)' : 'rgba(139,95,10,0.1)',
                                                    color: catColor,
                                                    border: `1px solid ${isDark ? 'rgba(201,162,39,0.2)' : 'rgba(139,95,10,0.25)'}`,
                                                    '& .MuiChip-label': { px: 0.75 },
                                                }}
                                            />
                                            )
                                        })()}
                                    </Box>
                                </Box>
                            )
                        })}
                    </Box>
                )}
            </Box>

            {/* Fixed cart bar — left tracks sidebar width so it never overlaps the nav */}
            <Box sx={{
                position: 'fixed',
                bottom: 0,
                left: isMobile ? 0 : sidebarW,
                right: 0,
                zIndex: 1200,
                transition: 'left 0.22s cubic-bezier(.4,0,.2,1)',
                px: { xs: 2, sm: 3 },
                py: 1,
                bgcolor: cartBarBg,
                backdropFilter: 'blur(12px)',
                borderTop: `1px solid ${barBorder}`,
                display: 'flex',
                justifyContent: 'center',
            }}>
                <CartModel
                    buttonLabel={cartCount > 0 ? `View Cart · ${cartCount} item${cartCount !== 1 ? 's' : ''}` : 'Cart is empty'}
                    userType={userType}
                />
            </Box>

            </Box>{/* end main content column */}
        </Box>
    )
}

export default Menu
