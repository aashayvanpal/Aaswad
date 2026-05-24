import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import TextField from '@mui/material/TextField'
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
                maxWidth="md"
                slotProps={{
                    paper: {
                        sx: { borderRadius: '20px', overflow: 'hidden', minHeight: '60vh' }
                    }
                }}
            >
                <DialogTitle sx={{
                    bgcolor: '#C9A227',
                    color: '#000',
                    fontWeight: 800,
                    fontSize: '1.3rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 2,
                    px: 3,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <ShoppingCartIcon />
                        <span>Review your Selections</span>
                        {userType === 'Admin' && (
                            <Chip label="Admin" size="small"
                                sx={{ bgcolor: '#000', color: '#C9A227', fontWeight: 700, fontSize: '0.8rem' }} />
                        )}
                        {cartCount > 0 && (
                            <Chip label={`${cartCount} item${cartCount > 1 ? 's' : ''}`} size="small"
                                sx={{ bgcolor: 'rgba(0,0,0,0.15)', fontWeight: 700, fontSize: '0.8rem' }} />
                        )}
                    </Box>
                    <IconButton onClick={toggle} sx={{ color: '#000', '&:hover': { bgcolor: 'rgba(0,0,0,0.1)' } }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ bgcolor: '#fffbee', p: 0 }}>
                    {cartItems.length > 0 && (
                        <Box sx={{
                            px: 3, pt: 2.5, pb: 2,
                            bgcolor: 'rgba(201,162,39,0.1)',
                            borderBottom: '1px solid rgba(201,162,39,0.25)',
                            display: 'flex',
                            alignItems: 'flex-end',
                            gap: 3,
                        }}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5, color: '#5d522c' }}>
                                    Set quantity for all items
                                </Typography>
                                <TextField
                                    placeholder="e.g. 50"
                                    type="number"
                                    size="small"
                                    value={bulkQtyInput}
                                    onChange={handleBulkQtyChange}
                                    slotProps={{ htmlInput: { min: 1 } }}
                                    sx={{
                                        width: 200,
                                        '& .MuiOutlinedInput-root': {
                                            fontSize: '1rem', bgcolor: '#fff', borderRadius: '8px',
                                            '&:hover fieldset': { borderColor: '#C9A227' },
                                            '&.Mui-focused fieldset': { borderColor: '#C9A227' },
                                        },
                                    }}
                                />
                            </Box>
                            <Typography variant="caption" sx={{ color: '#888', fontStyle: 'italic', pb: 0.5 }}>
                                Updates every item at once
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ px: 1, pt: 1 }}>
                        {userType === 'Admin' ? <AdminCart /> : <Cart />}
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CartModel
