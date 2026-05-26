import React, { useContext } from 'react'
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
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import NoItemsInCart from '../images/2.jpg'
import VisibilityContext from './Context.js'
import '../css/AdminCart.scss'
import { useSelector, useDispatch } from 'react-redux'
import { removeItem, updateQty, updatePrice, clearCart } from '../store/slices/cartSlice'

const AdminCart = ({ bulkQtyInput, onBulkQtyChange, tableHead, rowHover, text, textMuted, totalColor }) => {
    const dispatch = useDispatch()
    const cartItems = useSelector(state => state.cart.items)
    const { actions } = useContext(VisibilityContext)
    const total = cartItems.reduce((sum, i) => sum + i.quantity * i.price, 0)

    const multiOrder = () => {
        let order = actions.orderDates
        const bulkDate = localStorage.getItem('bulkOrderSetting')
            ? JSON.parse(localStorage.getItem('bulkOrderSetting'))[0] : ''
        const bulkMealType = localStorage.getItem('bulkOrderSetting')
            ? JSON.parse(localStorage.getItem('bulkOrderSetting'))[1] : ''
        const bulkIndex = localStorage.getItem('bulkOrderSetting')
            ? JSON.parse(localStorage.getItem('bulkOrderSetting'))[2] : ''
        order[bulkIndex][bulkDate][bulkMealType].items = cartItems
        order[bulkIndex][bulkDate][bulkMealType].amount = total
        actions.setOrderDates(order)
        localStorage.setItem('bulkOrders', JSON.stringify(order))
        dispatch(clearCart())
        actions.setShowMultiDateComponent(true)
    }

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
            <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent', overflowX: 'hidden' }}>
                <Table size="small" sx={{ tableLayout: 'fixed', width: '100%' }}>
                    <TableHead>
                        <TableRow sx={{ bgcolor: tableHead || 'rgba(201,162,39,0.18)' }}>
                            <TableCell sx={{ fontWeight: 700, width: 52, fontSize: '1.1rem' }}>#</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Item</TableCell>
                            <TableCell sx={{ fontWeight: 700, textAlign: 'center', width: '18%', fontSize: '1.1rem' }}>Price (₹)</TableCell>
                            <TableCell sx={{ fontWeight: 700, textAlign: 'center', width: '22%', fontSize: '1.1rem' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                    <span>Qty</span>
                                    <input
                                        value={bulkQtyInput}
                                        onChange={onBulkQtyChange}
                                        type="number"
                                        min="1"
                                        placeholder="all"
                                        className="cart-bulk-qty-input"
                                    />
                                </Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, textAlign: 'right', width: '18%', fontSize: '1.1rem' }}>Total</TableCell>
                            <TableCell sx={{ width: 56 }} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cartItems.map((item, i) => (
                            <TableRow key={item._id} sx={{ '&:hover': { bgcolor: rowHover || 'rgba(201,162,39,0.06)' } }}>
                                <TableCell sx={{ color: textMuted || '#888', fontSize: '1.05rem' }}>{i + 1}</TableCell>
                                <TableCell sx={{ fontWeight: 500, fontSize: '1.15rem', color: text }}>{item.name}</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                    <input
                                        value={item.price}
                                        onChange={(e) => dispatch(updatePrice({ id: item._id, price: e.target.value }))}
                                        className="cart-price-input"
                                    />
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                    <input
                                        value={item.quantity}
                                        onChange={(e) => dispatch(updateQty({ id: item._id, qty: e.target.value }))}
                                        className="cart-qty-input"
                                    />
                                </TableCell>
                                <TableCell sx={{ textAlign: 'right', fontWeight: 600, fontSize: '1.1rem' }}>₹{item.price * item.quantity}</TableCell>
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

            <Box sx={{ px: 2, pb: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <Typography sx={{ fontWeight: 800, color: totalColor || '#3d2e00', fontSize: '1.4rem' }}>
                    Total: ₹{total}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, px: 2, pb: 2 }}>
                <Button variant="outlined" color="error" size="small" startIcon={<DeleteSweepIcon />}
                    onClick={() => dispatch(clearCart())} sx={{ fontWeight: 600 }}>
                    Clear
                </Button>
                <Link to='/request'>
                    <Button variant="contained" size="small" endIcon={<ArrowForwardRoundedIcon />}
                        sx={{ bgcolor: '#C9A227', color: '#000', fontWeight: 700, '&:hover': { bgcolor: '#e8c84d' } }}>
                        Proceed
                    </Button>
                </Link>
                <Button variant="outlined" size="small" onClick={multiOrder}
                    sx={{ borderColor: '#5d522c', color: '#5d522c', fontWeight: 600 }}>
                    Multi-Date Order
                </Button>
                <Link to='/requestEventOrder'>
                    <Button variant="outlined" size="small"
                        sx={{ borderColor: '#5d522c', color: '#5d522c', fontWeight: 600 }}>
                        Event Order
                    </Button>
                </Link>
            </Box>
        </Box>
    )
}

export default AdminCart
