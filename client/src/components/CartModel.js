import React, { useState } from 'react'
import { useAppTheme } from '../context/ThemeContext'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Cart from './Cart.js'
import AdminCart from './AdminCart.js'
import { useDispatch, useSelector } from 'react-redux'
import { setBulkQty } from '../store/slices/cartSlice'

const CartModel = ({ buttonLabel, userType }) => {
    const [modal, setModal] = useState(false)
    const [bulkQtyInput, setBulkQtyInput] = useState('')
    const dispatch = useDispatch()
    const cartItems = useSelector(state => state.cart.items)
    const cartCount = cartItems.length
    const { themeMode } = useAppTheme()
    const isDark = themeMode === 'dark'
    const MODAL_BG   = isDark ? '#1a1800' : '#fffbee'
    const TABLE_HEAD = isDark ? 'rgba(201,162,39,0.15)' : 'rgba(201,162,39,0.18)'
    const ROW_HOVER  = isDark ? 'rgba(201,162,39,0.08)' : 'rgba(201,162,39,0.06)'
    const TEXT       = isDark ? 'rgba(255,255,255,0.87)' : '#1a1400'
    const TEXT_MUTED = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)'
    const TOTAL_COLOR = isDark ? '#e8c84d' : '#3d2e00'

    const toggle = () => setModal(!modal)

    const handleBulkQtyChange = (e) => {
        const val = e.target.value
        setBulkQtyInput(val)
        if (val && Number(val) > 0) dispatch(setBulkQty(val))
    }

    return (
        <>
            <Button
                variant="contained"
                onClick={toggle}
                startIcon={<ShoppingCartIcon sx={{ fontSize: '1.4rem !important' }} />}
                sx={{
                    bgcolor: '#C9A227',
                    color: '#000',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    px: 3,
                    py: 1.2,
                    borderRadius: '14px',
                    boxShadow: '0 4px 14px rgba(201,162,39,0.5)',
                    '&:hover': { bgcolor: '#e8c84d' },
                }}
            >
                {buttonLabel}
                {cartCount > 0 && (
                    <Box component="span" sx={{
                        ml: 1, bgcolor: '#000', color: '#C9A227',
                        borderRadius: '50%', width: 24, height: 24,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.78rem', fontWeight: 900, lineHeight: 1,
                    }}>
                        {cartCount}
                    </Box>
                )}
            </Button>

            <Dialog
                open={modal}
                onClose={toggle}
                fullWidth
                maxWidth="xl"
                slotProps={{
                    paper: {
                        sx: { borderRadius: '20px', minHeight: '70vh' }
                    }
                }}
            >
                <DialogTitle sx={{
                    bgcolor: '#C9A227',
                    color: '#000',
                    fontWeight: 800,
                    fontSize: '1.6rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 2.5,
                    px: 4,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ShoppingCartIcon sx={{ fontSize: '1.8rem' }} />
                        <span>Review your Selections</span>
                        {userType === 'Admin' && (
                            <Chip label="Admin" size="small"
                                sx={{ bgcolor: '#000', color: '#C9A227', fontWeight: 700, fontSize: '0.9rem' }} />
                        )}
                        {cartCount > 0 && (
                            <Chip label={`${cartCount} item${cartCount > 1 ? 's' : ''}`} size="small"
                                sx={{ bgcolor: 'rgba(0,0,0,0.15)', fontWeight: 700, fontSize: '0.9rem' }} />
                        )}
                    </Box>
                    <IconButton onClick={toggle} sx={{ color: '#000', '&:hover': { bgcolor: 'rgba(0,0,0,0.1)' } }}>
                        <CloseIcon sx={{ fontSize: '1.6rem' }} />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ bgcolor: MODAL_BG, p: 0, overflowX: 'hidden' }}>
                    <Box sx={{ px: 2, pt: 1.5 }}>
                        {userType === 'Admin'
                            ? <AdminCart bulkQtyInput={bulkQtyInput} onBulkQtyChange={handleBulkQtyChange}
                                tableHead={TABLE_HEAD} rowHover={ROW_HOVER} text={TEXT} textMuted={TEXT_MUTED} totalColor={TOTAL_COLOR} />
                            : <Cart bulkQtyInput={bulkQtyInput} onBulkQtyChange={handleBulkQtyChange}
                                tableHead={TABLE_HEAD} rowHover={ROW_HOVER} text={TEXT} textMuted={TEXT_MUTED} totalColor={TOTAL_COLOR} />
                        }
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CartModel
