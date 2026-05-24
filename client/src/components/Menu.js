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
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import Drawer from '@mui/material/Drawer'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import CheckIcon from '@mui/icons-material/Check'
import MenuIcon from '@mui/icons-material/Menu'
import NavigationBar from './NavigationBar'
import { useAppTheme } from '../context/ThemeContext'

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
    const [navOpen, setNavOpen] = useState(false)
    const { themeMode } = useAppTheme()
    const isDark = themeMode === 'dark'

    // ── colour tokens ──────────────────────────────────────────────
    const pageBg    = isDark ? '#0f0e0b' : '#FDFAF4'
    const barBg     = isDark ? '#1a1800' : '#ffffff'
    const barBorder = isDark ? 'rgba(201,162,39,0.18)' : 'rgba(201,162,39,0.25)'
    const cardBg    = isDark ? 'rgba(255,255,255,0.025)' : '#ffffff'
    const cardBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(201,162,39,0.22)'
    const cardBorderActive = '#C9A227'
    const cardBgActive = isDark ? 'rgba(201,162,39,0.07)' : 'rgba(201,162,39,0.08)'
    const nameColor = isDark ? 'rgba(255,255,255,0.78)' : '#2a1f00'
    const catColor  = isDark ? 'rgba(201,162,39,0.38)' : 'rgba(201,162,39,0.65)'
    const searchInputColor = isDark ? '#fff' : '#1a1400'
    const searchPlaceholder = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.35)'
    const searchBorder = isDark ? 'rgba(201,162,39,0.18)' : 'rgba(201,162,39,0.3)'
    const cartBarBg = isDark ? 'rgba(15,14,11,0.97)' : 'rgba(253,250,244,0.97)'

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
        if (cat !== 'all') filtered = filtered.filter(i => i.category.includes(cat.toLowerCase()))
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

    return (
        <Box sx={{ bgcolor: pageBg, minHeight: '100vh', pb: '80px', display: 'flex', flexDirection: 'column' }}>

            {/* Nav drawer */}
            <Drawer
                open={navOpen}
                onClose={() => setNavOpen(false)}
                variant="temporary"
                ModalProps={{ keepMounted: true }}
                sx={{ '& .MuiDrawer-paper': { width: 240, border: 'none' } }}
            >
                <NavigationBar onClose={() => setNavOpen(false)} />
            </Drawer>

            {/* Top bar */}
            <Box sx={{
                bgcolor: barBg,
                borderBottom: `1px solid ${barBorder}`,
                px: { xs: 2, sm: 3 },
                pt: 2,
                pb: 0,
            }}>
                {/* Admin strip */}
                {userType === 'Admin' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
                        <Typography sx={{ color: 'rgba(201,162,39,0.55)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>
                            Admin · {username}
                        </Typography>
                        <Button
                            size="small"
                            onClick={() => dispatch(clearCart())}
                            startIcon={<DeleteSweepIcon sx={{ fontSize: '0.85rem !important' }} />}
                            sx={{
                                color: 'rgba(201,162,39,0.65)', fontSize: '0.68rem',
                                border: '1px solid rgba(201,162,39,0.18)',
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
                    <IconButton
                        onClick={() => setNavOpen(true)}
                        size="small"
                        sx={{ color: 'rgba(201,162,39,0.65)', '&:hover': { color: '#C9A227' }, flexShrink: 0 }}
                    >
                        <MenuIcon sx={{ fontSize: '1.1rem' }} />
                    </IconButton>
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
                                bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
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
                                        <IconButton size="small" onClick={clearSearch} sx={{ color: 'rgba(255,255,255,0.25)', p: 0.25 }}>
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
                            bgcolor: 'rgba(201,162,39,0.1)',
                            color: 'rgba(201,162,39,0.7)',
                            fontWeight: 700,
                            fontSize: '0.68rem',
                            height: 20,
                            '& .MuiChip-label': { px: 1 },
                        }}
                    />
                </Box>

                {/* Category tabs */}
                <Tabs
                    value={category}
                    onChange={handleCategory}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        minHeight: 36,
                        '& .MuiTabs-indicator': { bgcolor: '#C9A227', height: 2 },
                        '& .MuiTabs-scrollButtons': { color: 'rgba(201,162,39,0.45)' },
                    }}
                >
                    {CATEGORIES.map(cat => (
                        <Tab
                            key={cat}
                            value={cat}
                            label={cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                            sx={{
                                minHeight: 36,
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                letterSpacing: 0.2,
                                color: 'rgba(255,255,255,0.38)',
                                px: 1.5,
                                py: 0,
                                '&.Mui-selected': { color: '#C9A227' },
                            }}
                        />
                    ))}
                </Tabs>
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
                        <Typography sx={{ color: 'rgba(255,255,255,0.35)', mb: 2, fontSize: '0.85rem' }}>
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
                                    <Box sx={{ p: { xs: 0.75, sm: 0.875 } }}>
                                        <Typography sx={{
                                            fontWeight: 600,
                                            fontSize: { xs: '0.68rem', sm: '0.73rem' },
                                            color: selected ? '#C9A227' : nameColor,
                                            lineHeight: 1.3,
                                        }}>
                                            {item.name}
                                        </Typography>
                                        {item.category && (
                                            <Typography sx={{
                                                fontSize: '0.58rem',
                                                color: catColor,
                                                textTransform: 'capitalize',
                                                fontWeight: 600,
                                                letterSpacing: 0.4,
                                                mt: 0.25,
                                            }}>
                                                {item.category}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            )
                        })}
                    </Box>
                )}
            </Box>

            {/* Fixed cart bar */}
            <Box sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1200,
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
        </Box>
    )
}

export default Menu
