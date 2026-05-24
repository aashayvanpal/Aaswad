import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import NoItemsInCart from '../images/2.jpg'
import proceedImage from '../images/proceed.svg'
import clearCartImg from '../images/clear-cart-icon.png'
import { useSelector, useDispatch } from 'react-redux'
import '../css/AdminCart.scss'
import { removeItem, updateQty, clearCart } from '../store/slices/cartSlice'

const Cart = () => {
    const dispatch = useDispatch()
    const cartItems = useSelector(state => state.cart.items)
    const total = cartItems.reduce((sum, i) => sum + i.quantity * i.price, 0)

    if (cartItems.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#5d522c' }}>No items in cart</Typography>
                <img src={NoItemsInCart} alt="NoItemsInCart" className="cart-empty-img" />
            </Box>
        )
    }

    return (
        <Box>
            <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'rgba(201,162,39,0.18)' }}>
                            <TableCell sx={{ fontWeight: 800, width: 44, fontSize: '0.95rem' }}>#</TableCell>
                            <TableCell sx={{ fontWeight: 800, fontSize: '0.95rem' }}>Item</TableCell>
                            <TableCell sx={{ fontWeight: 800, textAlign: 'center', width: 130, fontSize: '0.95rem' }}>Qty</TableCell>
                            <TableCell sx={{ fontWeight: 800, textAlign: 'right', width: 90, fontSize: '0.95rem' }}>Total</TableCell>
                            <TableCell sx={{ width: 48 }} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cartItems.map((item, i) => (
                            <TableRow key={item._id} sx={{ '&:hover': { bgcolor: 'rgba(201,162,39,0.06)' } }}>
                                <TableCell sx={{ color: '#888', fontSize: '0.9rem' }}>{i + 1}</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '1rem' }}>{item.name}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                        <IconButton size="small" disabled={item.quantity <= 1}
                                            onClick={() => dispatch(updateQty({ id: item._id, qty: item.quantity - 1 }))}
                                            sx={{ width: 26, height: 26, border: '1px solid #ddd' }}>
                                            <span className="cart-qty-btn-icon">−</span>
                                        </IconButton>
                                        <input
                                            value={item.quantity}
                                            onChange={(e) => dispatch(updateQty({ id: item._id, qty: e.target.value }))}
                                            className="cart-qty-input"
                                        />
                                        <IconButton size="small"
                                            onClick={() => dispatch(updateQty({ id: item._id, qty: item.quantity + 1 }))}
                                            sx={{ width: 26, height: 26, border: '1px solid #ddd' }}>
                                            <span className="cart-qty-btn-icon">+</span>
                                        </IconButton>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ textAlign: 'right', fontWeight: 600 }}>₹{item.price * item.quantity}</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                    <IconButton size="small" onClick={() => dispatch(removeItem(item._id))}
                                        sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239,68,68,0.08)' } }}>
                                        <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Divider sx={{ my: 1.5 }} />

            <Box sx={{ px: 3, pb: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#3d2e00' }}>
                    Total: ₹{total}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, px: 3, pb: 3 }}>
                <Button variant="outlined" color="error" size="small" startIcon={<img src={clearCartImg} alt="" height="16" width="16" />}
                    onClick={() => dispatch(clearCart())} sx={{ fontWeight: 600 }}>
                    Clear
                </Button>
                <Link to='/request' className="cart-proceed-link">
                    <Button variant="contained" fullWidth
                        sx={{ bgcolor: '#C9A227', color: '#000', fontWeight: 700, '&:hover': { bgcolor: '#e8c84d' } }}>
                        Proceed &nbsp;
                        <img src={proceedImage} alt="" height="18" />
                    </Button>
                </Link>
            </Box>
        </Box>
    )
}

export default Cart
