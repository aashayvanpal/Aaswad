import React, { useEffect, useState } from 'react';
import axios from '../config/axios'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setEditingOrder } from '../store/slices/cartSlice'
import '../css/app-css.css'
import ConfirmDialog from './ConfirmDialog'
import ReportModal from './ReportModal';
import homeDeliveryMan from '../images/home-delivery-man.png'
import serviceGif from '../images/service.gif'

import {
    useGetOrdersQuery,
    useDeleteOrderMutation,
    useUpdateOrderMutation,
} from '../store/services/ordersApi'

import {
    Box, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Typography, TextField, IconButton,
    Button, Chip, Checkbox, Tooltip, InputAdornment, Stack,
    Card, CardContent, CardActions,
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV2'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EditIcon from '@mui/icons-material/Edit'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import AssessmentIcon from '@mui/icons-material/Assessment'

const GOLD = '#C9A227'
const GOLD_HOVER = '#e8c84d'
const GOLD_BG = 'rgba(201,162,39,0.08)'
const GOLD_BORDER = 'rgba(201,162,39,0.28)'

const calcOrderTotal = (order) => {
    const itemsTotal = (order.items || []).reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0)
    const miscTotal  = (order.misc  || []).reduce((s, m) => s + (m.rate  || 0), 0)
    return itemsTotal + miscTotal + (order.transport?.rate || 0)
}

const formatDate = (d) =>
    d ? `${d.substr(8,2)}/${d.substr(5,2)}/${d.substr(0,4)}` : '—'

// ── icon sizes ────────────────────────────────────────────────────────────────
const ICON_SZ = { fontSize: { xs: '1.8rem', md: '2rem' } }

const SortButtons = ({ onAsc, onDesc }) => (
    <Stack direction="row">
        <Tooltip title="Newest first">
            <IconButton size="small" onClick={onAsc}>
                <ArrowUpwardIcon sx={ICON_SZ} />
            </IconButton>
        </Tooltip>
        <Tooltip title="Oldest first">
            <IconButton size="small" onClick={onDesc}>
                <ArrowDownwardIcon sx={ICON_SZ} />
            </IconButton>
        </Tooltip>
    </Stack>
)

const DeliveryBadges = ({ order }) => (
    <Stack direction="row" spacing={0.5} alignItems="center">
        {order.customer.homeDelivery && (
            <Tooltip title="Home Delivery">
                <img src={homeDeliveryMan} alt="home delivery" height="28" width="28" />
            </Tooltip>
        )}
        {order.customer.service && (
            <Tooltip title="Service">
                <img src={serviceGif} alt="service" height="28" width="28" />
            </Tooltip>
        )}
    </Stack>
)

// shared table-header cell style
const TH = ({ children, color, border }) => (
    <TableCell sx={{
        fontWeight: 800,
        fontSize: { xs: '1.1rem', md: '1.3rem' },
        color,
        borderBottom: `2px solid ${border}`,
        py: { xs: 2, md: 2.5 },
        px: { xs: 2, md: 3 },
        whiteSpace: 'nowrap',
    }}>
        {children}
    </TableCell>
)

// shared table-body cell style
const TD = ({ children, sx = {} }) => (
    <TableCell sx={{
        fontSize: { xs: '1rem', md: '1.2rem' },
        py: { xs: 2, md: 2.5 },
        px: { xs: 2, md: 3 },
        ...sx,
    }}>
        {children}
    </TableCell>
)

const SectionHeader = ({ label, count, color }) => (
    <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1.5}>
        <Typography sx={{ fontSize: { xs: '1.4rem', md: '1.8rem' }, fontWeight: 800, color }}>
            {label}
        </Typography>
        <Chip label={count} sx={{
            bgcolor: color, color: '#fff', fontWeight: 800,
            fontSize: { xs: '1rem', md: '1.1rem' },
            height: { xs: 30, md: 34 },
        }} />
    </Stack>
)

// Mobile card per order
const OrderCard = ({ item, i, selectMode, selected, onSelect, actions, note }) => (
    <Card variant="outlined" sx={{ mb: 1.5, borderRadius: 2 }}>
        <CardContent sx={{ pb: 0.5, pt: 2, px: 2 }}>
            <Stack direction="row" alignItems="flex-start" spacing={1}>
                {selectMode && (
                    <Checkbox
                        checked={!!selected[item._id]}
                        onChange={() => onSelect(item)}
                        sx={{ p: 0, mt: 0.3 }}
                    />
                )}
                <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>
                        #{i + 1} · {formatDate(item.customer.eventDate)}
                    </Typography>
                    <Link to={`/orders/${item._id}`} style={{ textDecoration: 'none' }}>
                        <Typography sx={{ fontSize: '1.15rem', fontWeight: 800, mt: 0.3, color: 'inherit' }}>
                            {item.customer.fullName}
                        </Typography>
                    </Link>
                    <DeliveryBadges order={item} />
                    {note && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Notes: {note}
                        </Typography>
                    )}
                </Box>
            </Stack>
        </CardContent>
        <CardActions sx={{ px: 2, pb: 1.5, pt: 0, gap: 0.5 }}>
            {actions}
        </CardActions>
    </Card>
)

// ── Main ─────────────────────────────────────────────────────────────────────
const OrderList = () => {
    const [approves,   setApproves]   = useState([])
    const [confirmed,  setConfirmed]  = useState([])
    const [completed,  setCompleted]  = useState([])
    const [startDateFrom, setStartDateFrom] = useState(new Date())
    const [startDateTo,   setStartDateTo]   = useState(new Date())
    const [selectMode, setSelectMode] = useState(false)
    const [selected,   setSelected]   = useState({})
    const [reportingState, setReportingState] = useState([])
    const [confirmState,   setConfirmState]   = useState({ open: false })
    const [searchConfirmed, setSearchConfirmed] = useState('')
    const [searchCompleted, setSearchCompleted] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { data: ordersData, isLoading } = useGetOrdersQuery()
    const [deleteOrder] = useDeleteOrderMutation()
    const [updateOrder] = useUpdateOrderMutation()

    useEffect(() => {
        if (!ordersData) return
        setApproves(ordersData.filter(o => o.status === 'approve'))
        setConfirmed(ordersData.filter(o => o.status === 'confirmed'))
        setCompleted(ordersData.filter(o => o.status === 'completed'))
        setReportingState(JSON.parse(localStorage.getItem('report')))
    }, [ordersData])

    useEffect(() => {
        if (!selectMode) {
            setSelected({})
            localStorage.removeItem('report')
            setReportingState([])
        }
    }, [selectMode])

    const toggleSelect = (order) => {
        setSelected(prev => {
            const next = { ...prev }
            if (next[order._id]) delete next[order._id]
            else next[order._id] = {
                id: order._id,
                name: order.customer.fullName,
                amount: calcOrderTotal(order),
                status: order.status,
            }
            const report = Object.values(next)
            localStorage.setItem('report', JSON.stringify(report))
            setReportingState(report)
            return next
        })
    }

    const handleRemoveOrder = (id, name) => setConfirmState({
        open: true,
        title: 'Delete Order',
        message: `Delete order for ${name}?`,
        onConfirm: async () => {
            setConfirmState(s => ({ ...s, open: false }))
            try { await deleteOrder(id).unwrap() } catch (e) { console.log(e) }
        },
    })

    const handleApproveOrder = async (id) => {
        const order = (ordersData || []).find(o => o._id === id)
        if (!order) return
        try {
            await updateOrder({ id, ...order, status: 'confirmed' }).unwrap()
            axios.post('/sendEmail/orderApproved', {
                fullName: order.customer.fullName,
                email: order.customer.email,
                phonenumber: order.customer.phoneNumber,
            })
        } catch (e) { console.log(e) }
    }

    const handleCompleteOrder = async (id) => {
        const order = (ordersData || []).find(o => o._id === id)
        if (!order) return
        try {
            await updateOrder({ id, ...order, status: 'completed' }).unwrap()
            axios.post('/sendEmail/orderCompleted', { email: order.customer.email })
        } catch (e) { console.log(e) }
    }

    const sortList = (setFn, list, dir) =>
        setFn([...list].sort((a, b) => {
            if (a.customer.eventDate > b.customer.eventDate) return dir === 'asc' ? -1 : 1
            if (a.customer.eventDate < b.customer.eventDate) return dir === 'asc' ? 1 : -1
            return 0
        }))

    const handleDateChange = (date, setFn) => {
        setFn(date)
        setCompleted((ordersData || []).filter(o => o.status === 'completed').filter(o =>
            new Date(startDateFrom) <= new Date(o.customer.eventDate) &&
            new Date(startDateTo)   >= new Date(o.customer.eventDate)
        ))
    }

    const filteredConfirmed = confirmed.filter(o =>
        o.customer.fullName.toLowerCase().includes(searchConfirmed.toLowerCase()))
    const filteredCompleted = completed.filter(o =>
        o.customer.fullName.toLowerCase().includes(searchCompleted.toLowerCase()))

    if (isLoading) return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ fontSize: '1.2rem' }} color="text.secondary">Loading orders…</Typography>
        </Box>
    )

    // action icon buttons
    const btnEdit    = (item) => (
        <Tooltip title="Edit order">
            <IconButton onClick={() => { dispatch(setEditingOrder(item)); navigate('/menu') }}
                sx={{ color: '#555', '&:hover': { color: GOLD } }}>
                <EditIcon sx={ICON_SZ} />
            </IconButton>
        </Tooltip>
    )
    const btnApprove = (item) => (
        <Tooltip title="Approve">
            <IconButton onClick={() => handleApproveOrder(item._id)}
                sx={{ color: '#2e7d32', '&:hover': { bgcolor: 'rgba(46,125,50,0.1)' } }}>
                <CheckCircleIcon sx={ICON_SZ} />
            </IconButton>
        </Tooltip>
    )
    const btnComplete = (item) => (
        <Tooltip title="Mark completed">
            <IconButton onClick={() => handleCompleteOrder(item._id)}
                sx={{ color: '#2e7d32', '&:hover': { bgcolor: 'rgba(46,125,50,0.1)' } }}>
                <CheckCircleIcon sx={ICON_SZ} />
            </IconButton>
        </Tooltip>
    )
    const btnDelete  = (item) => (
        <Tooltip title="Delete">
            <IconButton onClick={() => handleRemoveOrder(item._id, item.customer.fullName)}
                sx={{ color: '#c62828', '&:hover': { bgcolor: 'rgba(198,40,40,0.1)' } }}>
                <DeleteIcon sx={ICON_SZ} />
            </IconButton>
        </Tooltip>
    )

    const sectionPaper = (borderColor, bgColor) => ({
        mb: { xs: 2, md: 3 },
        p: { xs: 1.5, md: 3 },
        borderRadius: 3,
        border: `1px solid ${borderColor}`,
        bgcolor: bgColor,
    })

    const emptyRow = (cols) => (
        <TableRow>
            <TableCell colSpan={cols} align="center"
                sx={{ color: 'text.secondary', py: 4, fontSize: '1rem' }}>
                No orders
            </TableCell>
        </TableRow>
    )

    return (
        <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
            <ConfirmDialog
                open={confirmState.open}
                title={confirmState.title}
                message={confirmState.message}
                confirmText="Delete"
                onConfirm={confirmState.onConfirm}
                onCancel={() => setConfirmState(s => ({ ...s, open: false }))}
            />

            <Typography sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' }, fontWeight: 800, textAlign: 'center', mb: { xs: 2, md: 3 }, color: '#3d2e00' }}>
                Orders
            </Typography>

            {/* Toolbar */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: { xs: 2, md: 3 } }}>
                <Button
                    variant={selectMode ? 'contained' : 'outlined'}
                    startIcon={<AssessmentIcon sx={{ fontSize: '1.4rem !important' }} />}
                    onClick={() => setSelectMode(v => !v)}
                    sx={{
                        width: { xs: '100%', sm: 'auto' },
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        py: { xs: 1.2, md: 1.4 },
                        px: 3,
                        borderColor: GOLD,
                        color: selectMode ? '#3d2e00' : GOLD,
                        bgcolor: selectMode ? GOLD : 'transparent',
                        fontWeight: 700,
                        '&:hover': { bgcolor: GOLD_HOVER, color: '#3d2e00', borderColor: GOLD_HOVER },
                    }}
                >
                    {selectMode ? `Selecting (${Object.keys(selected).length})` : 'Select Orders'}
                </Button>
                {selectMode && (
                    <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
                        <ReportModal report={reportingState} buttonLabel="Show Report" />
                    </Box>
                )}
            </Stack>

            {/* ══ APPROVE ══════════════════════════════════════════════════════ */}
            <Paper elevation={3} sx={sectionPaper(GOLD_BORDER, 'rgba(255,243,200,0.45)')}>
                <Stack direction="row" sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'center' }}>
                    <SectionHeader label="Pending Approval" count={approves.length} color="#b07d00" />
                    <SortButtons onAsc={() => sortList(setApproves, approves, 'asc')} onDesc={() => sortList(setApproves, approves, 'desc')} />
                </Stack>

                {/* Mobile */}
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                    {approves.length === 0
                        ? <Typography color="text.secondary" sx={{ textAlign: 'center' }} py={2}>No pending orders</Typography>
                        : approves.map((item, i) => (
                            <OrderCard key={item._id} item={item} i={i}
                                selectMode={selectMode} selected={selected} onSelect={toggleSelect}
                                note={item.customer.queries}
                                actions={<>{btnEdit(item)}{btnApprove(item)}{btnDelete(item)}</>}
                            />
                        ))
                    }
                </Box>

                {/* Desktop */}
                <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: GOLD_BG }}>
                                {selectMode && <TH color="#3d2e00" border={GOLD_BORDER}>Select</TH>}
                                <TH color="#3d2e00" border={GOLD_BORDER}>#</TH>
                                <TH color="#3d2e00" border={GOLD_BORDER}>Date</TH>
                                <TH color="#3d2e00" border={GOLD_BORDER}>Customer</TH>
                                <TH color="#3d2e00" border={GOLD_BORDER}>Actions</TH>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {approves.length === 0 && emptyRow(selectMode ? 5 : 4)}
                            {approves.map((item, i) => (
                                <TableRow key={item._id} hover sx={{ '&:hover': { bgcolor: GOLD_BG } }}>
                                    {selectMode && (
                                        <TD><Checkbox checked={!!selected[item._id]} onChange={() => toggleSelect(item)}
                                            sx={{ color: GOLD, '&.Mui-checked': { color: GOLD }, transform: 'scale(1.3)' }} /></TD>
                                    )}
                                    <TD sx={{ color: '#7a6010', fontWeight: 700 }}>{i + 1}</TD>
                                    <TD sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{formatDate(item.customer.eventDate)}</TD>
                                    <TD>
                                        <Link to={`/orders/${item._id}`} style={{ textDecoration: 'none' }}>
                                            <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: '#3d2e00', '&:hover': { color: GOLD } }}>
                                                {item.customer.fullName}
                                            </Typography>
                                        </Link>
                                        <Stack direction="row" spacing={1} sx={{ mt: 0.5, alignItems: 'center' }}>
                                            <DeliveryBadges order={item} />
                                            {item.customer.queries && (
                                                <Typography variant="body2" color="text.secondary">
                                                    Notes: {item.customer.queries}
                                                </Typography>
                                            )}
                                        </Stack>
                                    </TD>
                                    <TD>
                                        <Stack direction="row">
                                            {btnEdit(item)}{btnApprove(item)}{btnDelete(item)}
                                        </Stack>
                                    </TD>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* ══ CONFIRMED ════════════════════════════════════════════════════ */}
            <Paper elevation={3} sx={sectionPaper('rgba(46,125,50,0.25)', 'rgba(232,245,233,0.5)')}>
                <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5} sx={{ mb: 2, justifyContent: { sm: 'space-between' }, alignItems: { sm: 'center' } }}>
                    <SectionHeader label="Confirmed" count={confirmed.length} color="#2e7d32" />
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                        <TextField
                            placeholder="Search by name…"
                            value={searchConfirmed}
                            onChange={e => setSearchConfirmed(e.target.value)}
                            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> } }}
                            sx={{ width: { xs: '100%', sm: 260 }, '& input': { fontSize: '1rem', py: 1.2 } }}
                        />
                        <Button variant="outlined" startIcon={<AddIcon />} component={Link} to="/menu"
                            sx={{ width: { xs: '100%', sm: 'auto' }, fontSize: '1rem', py: 1.2, px: 2.5, borderColor: '#2e7d32', color: '#2e7d32', fontWeight: 700, '&:hover': { bgcolor: 'rgba(46,125,50,0.1)' } }}>
                            New Order
                        </Button>
                        <SortButtons onAsc={() => sortList(setConfirmed, confirmed, 'asc')} onDesc={() => sortList(setConfirmed, confirmed, 'desc')} />
                    </Stack>
                </Stack>

                {/* Mobile */}
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                    {filteredConfirmed.length === 0
                        ? <Typography color="text.secondary" sx={{ textAlign: 'center' }} py={2}>{searchConfirmed ? 'No results' : 'No confirmed orders'}</Typography>
                        : filteredConfirmed.map((item, i) => (
                            <OrderCard key={item._id} item={item} i={i}
                                selectMode={selectMode} selected={selected} onSelect={toggleSelect}
                                actions={<>{btnComplete(item)}{btnDelete(item)}</>}
                            />
                        ))
                    }
                </Box>

                {/* Desktop */}
                <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'rgba(46,125,50,0.08)' }}>
                                {selectMode && <TH color="#1b5e20" border="rgba(46,125,50,0.2)">Select</TH>}
                                <TH color="#1b5e20" border="rgba(46,125,50,0.2)">#</TH>
                                <TH color="#1b5e20" border="rgba(46,125,50,0.2)">Date</TH>
                                <TH color="#1b5e20" border="rgba(46,125,50,0.2)">Customer</TH>
                                <TH color="#1b5e20" border="rgba(46,125,50,0.2)">Actions</TH>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredConfirmed.length === 0 && emptyRow(selectMode ? 5 : 4)}
                            {filteredConfirmed.map((item, i) => (
                                <TableRow key={item._id} hover sx={{ '&:hover': { bgcolor: 'rgba(46,125,50,0.05)' } }}>
                                    {selectMode && (
                                        <TD><Checkbox checked={!!selected[item._id]} onChange={() => toggleSelect(item)}
                                            sx={{ color: '#2e7d32', '&.Mui-checked': { color: '#2e7d32' }, transform: 'scale(1.3)' }} /></TD>
                                    )}
                                    <TD sx={{ fontWeight: 700, color: 'text.secondary' }}>{i + 1}</TD>
                                    <TD sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{formatDate(item.customer.eventDate)}</TD>
                                    <TD>
                                        <Link to={`/orders/${item._id}`} style={{ textDecoration: 'none' }}>
                                            <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: '#1b5e20', '&:hover': { color: '#2e7d32' } }}>
                                                {item.customer.fullName}
                                            </Typography>
                                        </Link>
                                        <DeliveryBadges order={item} />
                                    </TD>
                                    <TD>
                                        <Stack direction="row">
                                            {btnComplete(item)}{btnDelete(item)}
                                        </Stack>
                                    </TD>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* ══ COMPLETED ════════════════════════════════════════════════════ */}
            <Paper elevation={3} sx={sectionPaper('rgba(120,100,60,0.2)', 'rgba(245,240,230,0.5)')}>
                <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5} sx={{ mb: 2, justifyContent: { sm: 'space-between' }, alignItems: { sm: 'center' } }}>
                    <SectionHeader label="Completed" count={completed.length} color="#6d4c00" />
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: { xs: '100%', sm: 'auto' }, flexWrap: 'wrap' }}>
                        <TextField
                            placeholder="Search by name…"
                            value={searchCompleted}
                            onChange={e => setSearchCompleted(e.target.value)}
                            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> } }}
                            sx={{ width: { xs: '100%', sm: 260 }, '& input': { fontSize: '1rem', py: 1.2 } }}
                        />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker label="From" value={startDateFrom}
                                onChange={e => handleDateChange(e, setStartDateFrom)}
                                slotProps={{ textField: { sx: { width: { xs: '100%', sm: 'auto' }, '& input': { fontSize: '1rem' } } } }}
                            />
                            <DatePicker label="To" value={startDateTo}
                                onChange={e => handleDateChange(e, setStartDateTo)}
                                slotProps={{ textField: { sx: { width: { xs: '100%', sm: 'auto' }, '& input': { fontSize: '1rem' } } } }}
                            />
                        </LocalizationProvider>
                        <SortButtons onAsc={() => sortList(setCompleted, completed, 'asc')} onDesc={() => sortList(setCompleted, completed, 'desc')} />
                    </Stack>
                </Stack>

                {/* Mobile */}
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                    {filteredCompleted.length === 0
                        ? <Typography color="text.secondary" sx={{ textAlign: 'center' }} py={2}>{searchCompleted ? 'No results' : 'No completed orders'}</Typography>
                        : filteredCompleted.map((item, i) => (
                            <OrderCard key={item._id} item={item} i={i}
                                selectMode={false} selected={{}} onSelect={() => {}}
                                actions={btnDelete(item)}
                            />
                        ))
                    }
                </Box>

                {/* Desktop */}
                <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'rgba(120,100,60,0.08)' }}>
                                <TH color="#6d4c00" border="rgba(120,100,60,0.2)">#</TH>
                                <TH color="#6d4c00" border="rgba(120,100,60,0.2)">Customer</TH>
                                <TH color="#6d4c00" border="rgba(120,100,60,0.2)">Date</TH>
                                <TH color="#6d4c00" border="rgba(120,100,60,0.2)">Delete</TH>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredCompleted.length === 0 && emptyRow(4)}
                            {filteredCompleted.map((item, i) => (
                                <TableRow key={item._id} hover sx={{ '&:hover': { bgcolor: 'rgba(120,100,60,0.05)' } }}>
                                    <TD sx={{ fontWeight: 700, color: 'text.secondary' }}>{i + 1}</TD>
                                    <TD>
                                        <Link to={`/orders/${item._id}`} style={{ textDecoration: 'none' }}>
                                            <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: '#4e3400', '&:hover': { color: '#6d4c00' } }}>
                                                {item.customer.fullName}
                                            </Typography>
                                        </Link>
                                        <DeliveryBadges order={item} />
                                    </TD>
                                    <TD sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{formatDate(item.customer.eventDate)}</TD>
                                    <TD>{btnDelete(item)}</TD>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    )
}

export default OrderList
