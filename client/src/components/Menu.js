import React, { useState, useEffect } from 'react'
import axios from '../config/axios'
import CartModel from './CartModel.js'
import noItemFound from '../images/no-item-found.svg'
import LoadingSpinner from './LoadingSpinner.js'
import { getUserDetails } from '../assets/user-functions.js'
import NavigationBar from './NavigationBar'
import clearIcon from '../images/clear-icon.png'
import { useSelector, useDispatch } from 'react-redux'
import { addItem, removeItem, clearCart } from '../store/slices/cartSlice'
import { Link } from 'react-router-dom'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import InputAdornment from '@mui/material/InputAdornment'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'

const Menu = () => {
    const [items, setItems] = useState([])
    const [searchFilter, setSearchFilter] = useState([])
    const [inputSearch, setInputSearch] = useState('')
    const [username, setUserName] = useState('')
    const [userType, setUserType] = useState(false)
    const [spinnerLoading, setSpinnerLoading] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [category, setCategory] = useState('all')

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

    const handleSearch = (value) => {
        setInputSearch(value)
        applyFilters(value, category)
    }

    const handleCategory = (value) => {
        setCategory(value)
        applyFilters(inputSearch, value)
    }

    const applyFilters = (search, cat) => {
        let filtered = items
        if (search) filtered = filtered.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
        if (cat !== 'all') filtered = filtered.filter(i => i.category.includes(cat.toLowerCase()))
        setSearchFilter(filtered)
    }

    const clearSearch = () => {
        setInputSearch('')
        setCategory('all')
        setSearchFilter(items)
    }

    const categories = ['all', 'breakfast', 'lunch', 'dinner', 'sweets', 'snacks', 'special']

    return (
        <Box sx={{ bgcolor: '#f5edc0', minHeight: '100vh', pb: '90px' }}>

            {/* Admin toolbar */}
            {userType === 'Admin' && (
                <Box sx={{
                    bgcolor: '#04045f', color: '#fff',
                    px: 2, py: 1,
                    display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap',
                }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Admin: {username}
                    </Typography>
                    <Button size="small" variant="outlined"
                        onClick={() => dispatch(clearCart())}
                        startIcon={<DeleteSweepIcon />}
                        sx={{ color: '#C9A227', borderColor: '#C9A227', fontSize: '0.8rem' }}>
                        Clear Cart
                    </Button>
                    <Button size="small" variant="outlined"
                        onClick={() => setShowAlert(true)}
                        sx={{ color: '#aaa', borderColor: '#555', fontSize: '0.8rem' }}>
                        Toast
                    </Button>
                </Box>
            )}

            {showAlert && (
                <Alert severity="success"
                    sx={{ bgcolor: '#dbc268', color: '#1a1a00', mx: 2, mt: 1 }}
                    onClose={() => setShowAlert(false)}>
                    Your enquiry is submitted! View status&nbsp;
                    <Link to='/myOrders' style={{ fontWeight: 700 }}>here</Link>
                </Alert>
            )}

            <Box sx={{ display: 'flex', position: 'relative' }}>
                {/* Sidebar */}
                {sidebarOpen && (
                    <Box sx={{ flexShrink: 0 }}>
                        <NavigationBar onClose={() => setSidebarOpen(false)} />
                    </Box>
                )}

                {/* Main content */}
                <Box sx={{ flex: 1, minWidth: 0, px: { xs: 1, sm: 2 }, py: 2 }}>

                    {/* Page header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        {!sidebarOpen && (
                            <IconButton onClick={() => setSidebarOpen(true)}
                                sx={{ bgcolor: '#04045f', color: '#fff', borderRadius: '10px', '&:hover': { bgcolor: '#4c4cfd73' } }}>
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Typography variant="h5" sx={{
                            fontWeight: 800, color: '#3d2e00',
                            bgcolor: '#f5edc0', border: '2px solid #C9A227',
                            borderRadius: '10px', px: 2, py: 0.8, flex: 1, textAlign: 'center',
                            fontSize: { xs: '1.2rem', sm: '1.5rem' },
                        }}>
                            Choose Your Menu
                        </Typography>
                    </Box>

                    {/* Search + Filter bar */}
                    <Box sx={{
                        display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap', alignItems: 'center',
                        bgcolor: '#fffbee', border: '1px solid rgba(201,162,39,0.3)',
                        borderRadius: '12px', p: 1.5,
                    }}>
                        <TextField
                            value={inputSearch}
                            onChange={e => handleSearch(e.target.value)}
                            placeholder="Search item…"
                            size="small"
                            sx={{
                                flex: 1, minWidth: 160,
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: '#fff', borderRadius: '8px', fontSize: '0.95rem',
                                    '&:hover fieldset': { borderColor: '#C9A227' },
                                    '&.Mui-focused fieldset': { borderColor: '#C9A227' },
                                },
                            }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: '#C9A227' }} />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                        <Select
                            value={category}
                            onChange={e => handleCategory(e.target.value)}
                            size="small"
                            sx={{
                                minWidth: 130, bgcolor: '#fff', borderRadius: '8px', fontSize: '0.95rem',
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#C9A227' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#C9A227' },
                            }}
                        >
                            {categories.map(c => (
                                <MenuItem key={c} value={c} sx={{ textTransform: 'capitalize', fontSize: '0.95rem' }}>
                                    {c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                        {(inputSearch || category !== 'all') && (
                            <Button size="small" onClick={clearSearch} variant="outlined"
                                startIcon={<ClearIcon />}
                                sx={{ borderColor: '#C9A227', color: '#7a6010', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                Clear
                            </Button>
                        )}
                        <Chip
                            label={`${searchFilter.length} item${searchFilter.length !== 1 ? 's' : ''}`}
                            size="small"
                            sx={{ bgcolor: 'rgba(201,162,39,0.2)', fontWeight: 700, fontSize: '0.82rem' }}
                        />
                    </Box>

                    {/* Cards grid */}
                    {spinnerLoading ? (
                        <LoadingSpinner LoadingSpinner={spinnerLoading} />
                    ) : searchFilter.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography variant="h6" sx={{ color: '#c00', mb: 2 }}>
                                No items found — try a different search
                            </Typography>
                            <img src={noItemFound} alt="no-item-found" style={{ width: '50%', maxWidth: 320 }} />
                        </Box>
                    ) : (
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                md: 'repeat(3, 1fr)',
                                lg: 'repeat(4, 1fr)',
                            },
                            gap: 2,
                        }}>
                            {searchFilter.map((item, i) => {
                                const selected = cartItemIds.includes(item._id)
                                return (
                                    <Box
                                        key={item._id}
                                        onClick={() => toggleItem(item)}
                                        sx={{
                                            borderRadius: '14px',
                                            border: selected ? '2.5px solid #C9A227' : '2px solid rgba(201,162,39,0.35)',
                                            bgcolor: selected ? 'rgba(201,162,39,0.12)' : '#fffbee',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            boxShadow: selected
                                                ? '0 4px 16px rgba(201,162,39,0.45)'
                                                : '0 2px 8px rgba(0,0,0,0.07)',
                                            transition: 'all 0.18s ease',
                                            '&:hover': {
                                                boxShadow: '0 6px 20px rgba(201,162,39,0.4)',
                                                transform: 'translateY(-2px)',
                                                borderColor: '#C9A227',
                                            },
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        {/* Item image */}
                                        <Box sx={{ position: 'relative', height: 150, overflow: 'hidden' }}>
                                            <img
                                                src={`/images/food-item-images/${item.imgUrl}`}
                                                alt={item.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={e => { e.target.style.display = 'none' }}
                                            />
                                            {selected && (
                                                <Box sx={{
                                                    position: 'absolute', top: 8, right: 8,
                                                    bgcolor: '#C9A227', borderRadius: '50%',
                                                    width: 28, height: 28,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                                                }}>
                                                    <span style={{ color: '#000', fontSize: 16, fontWeight: 900, lineHeight: 1 }}>✓</span>
                                                </Box>
                                            )}
                                        </Box>

                                        {/* Item info */}
                                        <Box sx={{ p: 1.5, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <Typography sx={{
                                                fontWeight: 700,
                                                fontSize: { xs: '0.95rem', sm: '1rem' },
                                                textAlign: 'center',
                                                color: '#3d2e00',
                                                lineHeight: 1.3,
                                            }}>
                                                {i + 1}. {item.name}
                                            </Typography>
                                            {item.category && (
                                                <Chip
                                                    label={item.category}
                                                    size="small"
                                                    sx={{
                                                        mt: 1, alignSelf: 'center',
                                                        fontSize: '0.72rem', fontWeight: 600,
                                                        bgcolor: 'rgba(201,162,39,0.18)',
                                                        textTransform: 'capitalize',
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                )
                            })}
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Cart button — fixed at bottom, full width */}
            <Box sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1200,
                px: 2,
                py: 1.5,
                bgcolor: 'rgba(245,237,192,0.95)',
                backdropFilter: 'blur(8px)',
                borderTop: '1px solid rgba(201,162,39,0.3)',
                display: 'flex',
                justifyContent: 'center',
            }}>
                <CartModel
                    buttonLabel={`Cart — ${cartCount} item${cartCount !== 1 ? 's' : ''}`}
                    userType={userType}
                />
            </Box>

            <Box sx={{ textAlign: 'center', color: '#dbc268', bgcolor: '#353535', py: 1.5, mt: 2 }}>
                © Copyrights Reserved 2026
            </Box>
        </Box>
    )
}

export default Menu
