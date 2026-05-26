import React, { useEffect, useState, useCallback, useRef, memo } from 'react'
import axios from '../config/axios'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setEditingOrder } from '../store/slices/cartSlice'
import '../css/app-css.scss'
import '../css/OrderList.scss'
import ConfirmDialog from './ConfirmDialog'
import ReportModal from './ReportModal'
import homeDeliveryMan from '../images/home-delivery-man.png'
import serviceGif from '../images/service.gif'
import { useAppTheme } from '../context/ThemeContext'

import {
    useGetOrdersQuery,
    useDeleteOrderMutation,
    useUpdateOrderMutation,
} from '../store/services/ordersApi'

import {
    Box, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Typography, TextField, IconButton,
    Button, Chip, Checkbox, Tooltip, InputAdornment, Stack,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV2'

import DeleteIcon          from '@mui/icons-material/Delete'
import CheckCircleIcon     from '@mui/icons-material/CheckCircle'
import EditIcon            from '@mui/icons-material/Edit'
import ArrowUpwardIcon     from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon   from '@mui/icons-material/ArrowDownward'
import SearchIcon          from '@mui/icons-material/Search'
import AddIcon             from '@mui/icons-material/Add'
import AssessmentIcon      from '@mui/icons-material/Assessment'
import HourglassEmptyIcon  from '@mui/icons-material/HourglassEmpty'
import TaskAltIcon         from '@mui/icons-material/TaskAlt'
import InventoryIcon       from '@mui/icons-material/Inventory'
import InboxIcon           from '@mui/icons-material/Inbox'

// ── palette ───────────────────────────────────────────────────────────────────
const GOLD        = '#C9A227'
const GOLD_HOVER  = '#e8c84d'

const ACCENT = {
    pending:   '#C9A227',
    confirmed: '#43a047',
    completed: '#78909c',
}

// ── helpers ───────────────────────────────────────────────────────────────────
const calcOrderTotal = (order) => {
    const itemsTotal = (order.items || []).reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0)
    const miscTotal  = (order.misc  || []).reduce((s, m) => s + (m.rate  || 0), 0)
    return itemsTotal + miscTotal + (order.transport?.rate || 0)
}

const formatDate = (d) =>
    d ? `${d.substr(8,2)}/${d.substr(5,2)}/${d.substr(0,4)}` : '—'

const initials = (name = '') =>
    name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase()

// ── sub-components ────────────────────────────────────────────────────────────
const DeliveryBadges = ({ order }) => (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
        {order.customer.homeDelivery && (
            <Tooltip title="Home Delivery">
                <img src={homeDeliveryMan} alt="home delivery" height="24" width="24" />
            </Tooltip>
        )}
        {order.customer.service && (
            <Tooltip title="Service">
                <img src={serviceGif} alt="service" height="24" width="24" />
            </Tooltip>
        )}
    </Stack>
)

const SortButtons = ({ onAsc, onDesc, accent, isDark }) => (
    <Stack direction="row">
        <Tooltip title="Newest first">
            <IconButton size="small" onClick={onAsc}
                sx={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)', '&:hover': { color: accent } }}>
                <ArrowUpwardIcon sx={{ fontSize: '1.5rem' }} />
            </IconButton>
        </Tooltip>
        <Tooltip title="Oldest first">
            <IconButton size="small" onClick={onDesc}
                sx={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)', '&:hover': { color: accent } }}>
                <ArrowDownwardIcon sx={{ fontSize: '1.5rem' }} />
            </IconButton>
        </Tooltip>
    </Stack>
)

const TH = ({ children, accent }) => (
    <TableCell sx={{
        fontWeight: 700,
        fontSize: { xs: '0.95rem', md: '1rem' },
        color: accent,
        borderBottom: `1px solid ${alpha(accent, 0.25)}`,
        py: { xs: 1.8, md: 2 },
        px: { xs: 1.5, md: 2.5 },
        whiteSpace: 'nowrap',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
    }}>
        {children}
    </TableCell>
)

const TD = ({ children, sx = {} }) => (
    <TableCell sx={{
        fontSize: { xs: '1rem', md: '1.15rem' },
        py: { xs: 1.8, md: 2 },
        px: { xs: 1.5, md: 2.5 },
        borderBottom: 'none',
        ...sx,
    }}>
        {children}
    </TableCell>
)

const EmptyState = ({ label }) => (
    <Box sx={{ textAlign: 'center', py: { xs: 4, md: 6 } }}>
        <InboxIcon sx={{ fontSize: '3rem', color: 'text.disabled', mb: 1 }} />
        <Typography color="text.disabled" sx={{ fontSize: '1rem' }}>{label}</Typography>
    </Box>
)

const InitialsAvatar = ({ name, accent }) => (
    <Box sx={{
        width: 44, height: 44, borderRadius: '50%',
        bgcolor: alpha(accent, 0.15),
        border: `2px solid ${alpha(accent, 0.35)}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
    }}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: accent, lineHeight: 1 }}>
            {initials(name)}
        </Typography>
    </Box>
)

const ActionBtn = ({ title, onClick, icon, color, hoverColor }) => (
    <Tooltip title={title}>
        <IconButton onClick={onClick} size="small" sx={{
            color,
            transition: 'color 0.15s, transform 0.15s',
            '&:hover': { color: hoverColor, transform: 'scale(1.15)' },
        }}>
            {icon}
        </IconButton>
    </Tooltip>
)

// Mobile card
const OrderCard = memo(({ item, i, accent, selectMode, isSelected, onSelect, note, isDark,
    onEdit, onApprove, onComplete, onDelete }) => (
    <Box sx={{
        mb: 1.5,
        borderRadius: 2,
        border: `1px solid ${alpha(accent, isDark ? 0.25 : 0.2)}`,
        borderLeft: `4px solid ${accent}`,
        bgcolor: isDark ? alpha(accent, 0.04) : '#fff',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: `0 4px 20px ${alpha(accent, 0.15)}` },
    }}>
        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                {selectMode && (
                    <Checkbox
                        checked={isSelected}
                        onChange={() => onSelect(item)}
                        sx={{ p: 0, mt: 0.3, color: accent, '&.Mui-checked': { color: accent } }}
                    />
                )}
                <InitialsAvatar name={item.customer.fullName} accent={accent} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="caption" sx={{ color: alpha(accent, 0.8), fontWeight: 700, letterSpacing: '0.04em' }}>
                        #{i + 1} · {formatDate(item.customer.eventDate)}
                    </Typography>
                    <Link to={`/orders/${item._id}`} className="link-no-decoration">
                        <Typography sx={{
                            fontSize: '1.1rem', fontWeight: 800, mt: 0.2,
                            color: isDark ? 'rgba(255,255,255,0.9)' : '#1a1400',
                            '&:hover': { color: accent },
                            transition: 'color 0.15s',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                            {item.customer.fullName}
                        </Typography>
                    </Link>
                    <Stack direction="row" spacing={0.5} sx={{ mt: 0.5, alignItems: 'center' }}>
                        <DeliveryBadges order={item} />
                        {note && (
                            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                {note}
                            </Typography>
                        )}
                    </Stack>
                </Box>
            </Stack>
        </Box>
        <Stack direction="row" sx={{ px: 1.5, pb: 1, pt: 0 }}>
            {onEdit    && <ActionBtn title="Edit order"     onClick={() => onEdit(item)}                                  icon={<EditIcon sx={{ fontSize: '1.6rem' }} />}         color={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)'} hoverColor={GOLD} />}
            {onApprove && <ActionBtn title="Approve"        onClick={() => onApprove(item._id)}                           icon={<CheckCircleIcon sx={{ fontSize: '1.6rem' }} />}  color={ACCENT.confirmed} hoverColor="#66bb6a" />}
            {onComplete && <ActionBtn title="Mark completed" onClick={() => onComplete(item._id)}                          icon={<CheckCircleIcon sx={{ fontSize: '1.6rem' }} />}  color={ACCENT.confirmed} hoverColor="#66bb6a" />}
            {onDelete  && <ActionBtn title="Delete"         onClick={() => onDelete(item._id, item.customer.fullName)}    icon={<DeleteIcon sx={{ fontSize: '1.6rem' }} />}        color="#c62828" hoverColor="#ef5350" />}
        </Stack>
    </Box>
))

// Section panel wrapper
const SectionPanel = ({ accent, icon, label, count, controls, children, isDark, animDelay, cardBg }) => (
    <Paper
        elevation={0}
        className="order-section-panel"
        sx={{
            mb: { xs: 2.5, md: 3.5 },
            borderRadius: 3,
            border: `1px solid ${alpha(accent, isDark ? 0.2 : 0.18)}`,
            borderLeft: `5px solid ${accent}`,
            bgcolor: cardBg,
            overflow: 'hidden',
            animationDelay: `${animDelay}s`,
            boxShadow: isDark
                ? `0 2px 24px ${alpha(accent, 0.06)}`
                : `0 2px 16px ${alpha(accent, 0.08)}`,
        }}
    >
        {/* Section header strip */}
        <Box sx={{
            px: { xs: 2, md: 3 },
            py: { xs: 1.5, md: 2 },
            background: `linear-gradient(90deg, ${alpha(accent, isDark ? 0.12 : 0.07)} 0%, transparent 70%)`,
            borderBottom: `1px solid ${alpha(accent, isDark ? 0.15 : 0.12)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
        }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <Box sx={{
                    color: accent,
                    display: 'flex',
                    bgcolor: alpha(accent, 0.12),
                    borderRadius: 1.5,
                    p: 0.7,
                }}>
                    {icon}
                </Box>
                <Typography sx={{
                    fontSize: { xs: '1.15rem', md: '1.35rem' },
                    fontWeight: 800,
                    color: isDark ? 'rgba(255,255,255,0.9)' : '#1a1400',
                    letterSpacing: '-0.01em',
                }}>
                    {label}
                </Typography>
                <Chip
                    label={count}
                    size="small"
                    sx={{
                        bgcolor: accent,
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        height: 24,
                        '& .MuiChip-label': { px: 1 },
                    }}
                />
            </Stack>
            <Box>{controls}</Box>
        </Box>

        {/* Section body */}
        <Box sx={{ px: { xs: 1.5, md: 2.5 }, py: { xs: 1.5, md: 2 } }}>
            {children}
        </Box>
    </Paper>
)

// ── Main ─────────────────────────────────────────────────────────────────────
const OrderList = () => {
    const { themeMode } = useAppTheme()
    const isDark = themeMode === 'dark'

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
    const [deleteOrder]  = useDeleteOrderMutation()
    const [updateOrder]  = useUpdateOrderMutation()
    const ordersRef = useRef(ordersData)
    useEffect(() => { ordersRef.current = ordersData }, [ordersData])

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

    const toggleSelect = useCallback((order) => {
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
    }, [])

    const handleRemoveOrder = useCallback((id, name) => setConfirmState({
        open: true,
        title: 'Delete Order',
        message: `Delete order for ${name}?`,
        onConfirm: async () => {
            setConfirmState(s => ({ ...s, open: false }))
            try { await deleteOrder(id).unwrap() } catch (e) { console.error('[OrderList] delete', e) }
        },
    }), [deleteOrder])

    const handleApproveOrder = useCallback(async (id) => {
        const order = (ordersRef.current || []).find(o => o._id === id)
        if (!order) return
        try {
            await updateOrder({ id, ...order, status: 'confirmed' }).unwrap()
            axios.post('/sendEmail/orderApproved', {
                fullName: order.customer.fullName,
                email: order.customer.email,
                phonenumber: order.customer.phoneNumber,
            })
        } catch (e) { console.error('[OrderList] approve', e) }
    }, [updateOrder])

    const handleCompleteOrder = useCallback(async (id) => {
        const order = (ordersRef.current || []).find(o => o._id === id)
        if (!order) return
        try {
            await updateOrder({ id, ...order, status: 'completed' }).unwrap()
            axios.post('/sendEmail/orderCompleted', { email: order.customer.email })
        } catch (e) { console.error('[OrderList] complete', e) }
    }, [updateOrder])

    const handleEdit = useCallback((item) => {
        dispatch(setEditingOrder(item))
        navigate('/menu')
    }, [dispatch, navigate])

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
        <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography color="text.secondary" sx={{ fontSize: '1.1rem' }}>Loading orders…</Typography>
        </Box>
    )

    // ── theme-aware card backgrounds ────────────────────────────────────────
    const cardBg = isDark ? '#1a1800' : '#fff'

    return (
        <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
            <ConfirmDialog
                open={confirmState.open}
                title={confirmState.title}
                message={confirmState.message}
                confirmText="Delete"
                onConfirm={confirmState.onConfirm}
                onCancel={() => setConfirmState(s => ({ ...s, open: false }))}
            />

            {/* ── Page header ─────────────────────────────────────────────── */}
            <Box className="order-stat-bar" sx={{ mb: { xs: 2.5, md: 3.5 } }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
                    <Box>
                        <Typography sx={{
                            fontSize: { xs: '2rem', md: '2.6rem' },
                            fontWeight: 800,
                            color: isDark ? 'rgba(255,255,255,0.92)' : '#1a1400',
                            letterSpacing: '-0.02em',
                            lineHeight: 1,
                            mb: 1,
                        }}>
                            Orders
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.8 }}>
                            {[
                                { label: 'Pending',   count: approves.length,  accent: ACCENT.pending },
                                { label: 'Confirmed', count: confirmed.length, accent: ACCENT.confirmed },
                                { label: 'Completed', count: completed.length, accent: ACCENT.completed },
                            ].map(({ label, count, accent }) => (
                                <Box key={label} sx={{
                                    display: 'flex', alignItems: 'center', gap: 0.7,
                                    px: 1.5, py: 0.5,
                                    borderRadius: 10,
                                    border: `1px solid ${alpha(accent, 0.3)}`,
                                    bgcolor: alpha(accent, isDark ? 0.1 : 0.07),
                                }}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: accent, flexShrink: 0 }} />
                                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: isDark ? alpha(accent, 0.9) : alpha(accent, 0.85) }}>
                                        {count} {label}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Box>

                    {/* Toolbar */}
                    <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
                        <Button
                            variant={selectMode ? 'contained' : 'outlined'}
                            startIcon={<AssessmentIcon />}
                            onClick={() => setSelectMode(v => !v)}
                            sx={{
                                borderRadius: 3,
                                borderColor: GOLD,
                                color: selectMode ? '#1a1400 !important' : GOLD,
                                bgcolor: selectMode ? GOLD : 'transparent',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                py: 1,
                                px: 2.5,
                                transition: 'all 0.2s',
                                '&:hover': { bgcolor: GOLD_HOVER, color: '#1a1400 !important', borderColor: GOLD_HOVER, transform: 'translateY(-1px)' },
                            }}
                        >
                            {selectMode ? `Selecting (${Object.keys(selected).length})` : 'Select'}
                        </Button>
                        {selectMode && <ReportModal report={reportingState} buttonLabel="Report" />}
                    </Stack>
                </Stack>
            </Box>

            {/* ══ PENDING APPROVAL ══════════════════════════════════════════ */}
            <SectionPanel
                accent={ACCENT.pending}
                icon={<HourglassEmptyIcon sx={{ fontSize: '1.3rem' }} />}
                label="Pending Approval"
                count={approves.length}
                isDark={isDark}
                animDelay={0.04}
                cardBg={cardBg}
                controls={
                    <SortButtons
                        accent={ACCENT.pending} isDark={isDark}
                        onAsc={() => sortList(setApproves, approves, 'asc')}
                        onDesc={() => sortList(setApproves, approves, 'desc')}
                    />
                }
            >
                {/* Mobile */}
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                    {approves.length === 0
                        ? <EmptyState label="No pending orders" />
                        : approves.map((item, i) => (
                            <OrderCard key={item._id} item={item} i={i} accent={ACCENT.pending} isDark={isDark}
                                selectMode={selectMode} isSelected={!!selected[item._id]} onSelect={toggleSelect}
                                note={item.customer.queries}
                                onEdit={handleEdit} onApprove={handleApproveOrder} onDelete={handleRemoveOrder}
                            />
                        ))
                    }
                </Box>

                {/* Desktop */}
                <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Table>
                        <TableHd accent={ACCENT.pending} showSelect={selectMode} cols={['#', 'Date', 'Customer', 'Actions']} isDark={isDark} />
                        <TableBody>
                            {approves.length === 0
                                ? <TableRow><TableCell colSpan={selectMode ? 5 : 4}><EmptyState label="No pending orders" /></TableCell></TableRow>
                                : approves.map((item, i) => (
                                    <OrderRow key={item._id} item={item} i={i} accent={ACCENT.pending}
                                        isDark={isDark} isSelected={!!selected[item._id]} onSelect={toggleSelect}
                                        showSelect={selectMode}
                                        onEdit={handleEdit} onApprove={handleApproveOrder} onDelete={handleRemoveOrder}
                                    />
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </SectionPanel>

            {/* ══ CONFIRMED ════════════════════════════════════════════════ */}
            <SectionPanel
                accent={ACCENT.confirmed}
                icon={<TaskAltIcon sx={{ fontSize: '1.3rem' }} />}
                label="Confirmed"
                count={confirmed.length}
                isDark={isDark}
                animDelay={0.14}
                cardBg={cardBg}
                controls={
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 1 }}>
                        <SearchField
                            value={searchConfirmed}
                            onChange={e => setSearchConfirmed(e.target.value)}
                            accent={ACCENT.confirmed}
                        />
                        <Button
                            variant="outlined" startIcon={<AddIcon />}
                            component={Link} to="/menu"
                            sx={{
                                borderRadius: 2,
                                borderColor: ACCENT.confirmed,
                                color: ACCENT.confirmed,
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                py: 0.8,
                                '&:hover': { bgcolor: alpha(ACCENT.confirmed, 0.08) },
                            }}
                        >
                            New Order
                        </Button>
                        <SortButtons
                            accent={ACCENT.confirmed} isDark={isDark}
                            onAsc={() => sortList(setConfirmed, confirmed, 'asc')}
                            onDesc={() => sortList(setConfirmed, confirmed, 'desc')}
                        />
                    </Stack>
                }
            >
                {/* Mobile */}
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                    {filteredConfirmed.length === 0
                        ? <EmptyState label={searchConfirmed ? 'No results' : 'No confirmed orders'} />
                        : filteredConfirmed.map((item, i) => (
                            <OrderCard key={item._id} item={item} i={i} accent={ACCENT.confirmed} isDark={isDark}
                                selectMode={selectMode} isSelected={!!selected[item._id]} onSelect={toggleSelect}
                                onComplete={handleCompleteOrder} onDelete={handleRemoveOrder}
                            />
                        ))
                    }
                </Box>

                {/* Desktop */}
                <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Table>
                        <TableHd accent={ACCENT.confirmed} showSelect={selectMode} cols={['#', 'Date', 'Customer', 'Actions']} isDark={isDark} />
                        <TableBody>
                            {filteredConfirmed.length === 0
                                ? <TableRow><TableCell colSpan={selectMode ? 5 : 4}><EmptyState label={searchConfirmed ? 'No results' : 'No confirmed orders'} /></TableCell></TableRow>
                                : filteredConfirmed.map((item, i) => (
                                    <OrderRow key={item._id} item={item} i={i} accent={ACCENT.confirmed}
                                        isDark={isDark} isSelected={!!selected[item._id]} onSelect={toggleSelect}
                                        showSelect={selectMode}
                                        onComplete={handleCompleteOrder} onDelete={handleRemoveOrder}
                                    />
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </SectionPanel>

            {/* ══ COMPLETED ════════════════════════════════════════════════ */}
            <SectionPanel
                accent={ACCENT.completed}
                icon={<InventoryIcon sx={{ fontSize: '1.3rem' }} />}
                label="Completed"
                count={completed.length}
                isDark={isDark}
                animDelay={0.24}
                cardBg={cardBg}
                controls={
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 1 }}>
                        <SearchField
                            value={searchCompleted}
                            onChange={e => setSearchCompleted(e.target.value)}
                            accent={ACCENT.completed}
                        />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker label="From" value={startDateFrom}
                                onChange={e => handleDateChange(e, setStartDateFrom)}
                                slotProps={{ textField: { size: 'small', sx: { width: { xs: '100%', sm: 150 }, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: '0.9rem' } } } }}
                            />
                            <DatePicker label="To" value={startDateTo}
                                onChange={e => handleDateChange(e, setStartDateTo)}
                                slotProps={{ textField: { size: 'small', sx: { width: { xs: '100%', sm: 150 }, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: '0.9rem' } } } }}
                            />
                        </LocalizationProvider>
                        <SortButtons
                            accent={ACCENT.completed} isDark={isDark}
                            onAsc={() => sortList(setCompleted, completed, 'asc')}
                            onDesc={() => sortList(setCompleted, completed, 'desc')}
                        />
                    </Stack>
                }
            >
                {/* Mobile */}
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                    {filteredCompleted.length === 0
                        ? <EmptyState label={searchCompleted ? 'No results' : 'No completed orders'} />
                        : filteredCompleted.map((item, i) => (
                            <OrderCard key={item._id} item={item} i={i} accent={ACCENT.completed} isDark={isDark}
                                selectMode={false} isSelected={false} onSelect={toggleSelect}
                                onDelete={handleRemoveOrder}
                            />
                        ))
                    }
                </Box>

                {/* Desktop */}
                <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Table>
                        <TableHd accent={ACCENT.completed} showSelect={false} cols={['#', 'Date', 'Customer', 'Actions']} isDark={isDark} />
                        <TableBody>
                            {filteredCompleted.length === 0
                                ? <TableRow><TableCell colSpan={4}><EmptyState label={searchCompleted ? 'No results' : 'No completed orders'} /></TableCell></TableRow>
                                : filteredCompleted.map((item, i) => (
                                    <OrderRow key={item._id} item={item} i={i} accent={ACCENT.completed}
                                        isDark={isDark} isSelected={false} onSelect={toggleSelect}
                                        showSelect={false}
                                        onDelete={handleRemoveOrder}
                                    />
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </SectionPanel>
        </Box>
    )
}

// ── Module-level sub-components (must not be defined inside OrderList) ────────

const OrderRow = memo(({ item, i, accent, showSelect, isDark, isSelected, onSelect,
    onEdit, onApprove, onComplete, onDelete }) => (
    <TableRow sx={{
        transition: 'background 0.15s',
        '&:hover': { bgcolor: alpha(accent, isDark ? 0.07 : 0.05) },
        '&:not(:last-child) td': {
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
        },
        '&:last-child td': { borderBottom: 'none' },
    }}>
        {showSelect && (
            <TD>
                <Checkbox
                    checked={isSelected}
                    onChange={() => onSelect(item)}
                    sx={{ color: accent, '&.Mui-checked': { color: accent }, p: 0.5 }}
                />
            </TD>
        )}
        <TD sx={{ fontWeight: 700, color: alpha(accent, 0.7), minWidth: 40 }}>{i + 1}</TD>
        <TD sx={{ fontWeight: 600, whiteSpace: 'nowrap', color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)', fontSize: '0.95rem' }}>
            {formatDate(item.customer.eventDate)}
        </TD>
        <TD sx={{ width: '100%' }}>
            <Link to={`/orders/${item._id}`} className="link-no-decoration">
                <Typography sx={{
                    fontSize: '1.2rem', fontWeight: 800,
                    color: isDark ? 'rgba(255,255,255,0.9)' : '#1a1400',
                    transition: 'color 0.15s',
                    '&:hover': { color: accent },
                }}>
                    {item.customer.fullName}
                </Typography>
            </Link>
            <Stack direction="row" spacing={1} sx={{ mt: 0.4, alignItems: 'center' }}>
                <DeliveryBadges order={item} />
                {item.customer.queries && (
                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        {item.customer.queries}
                    </Typography>
                )}
            </Stack>
        </TD>
        <TD>
            <Stack direction="row" spacing={0.5}>
                {onEdit    && <ActionBtn title="Edit order"      onClick={() => onEdit(item)}                                 icon={<EditIcon sx={{ fontSize: '1.6rem' }} />}        color={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)'} hoverColor={GOLD} />}
                {onApprove && <ActionBtn title="Approve"         onClick={() => onApprove(item._id)}                          icon={<CheckCircleIcon sx={{ fontSize: '1.6rem' }} />} color={ACCENT.confirmed} hoverColor="#66bb6a" />}
                {onComplete && <ActionBtn title="Mark completed" onClick={() => onComplete(item._id)}                         icon={<CheckCircleIcon sx={{ fontSize: '1.6rem' }} />} color={ACCENT.confirmed} hoverColor="#66bb6a" />}
                {onDelete  && <ActionBtn title="Delete"          onClick={() => onDelete(item._id, item.customer.fullName)}   icon={<DeleteIcon sx={{ fontSize: '1.6rem' }} />}       color="#c62828" hoverColor="#ef5350" />}
            </Stack>
        </TD>
    </TableRow>
))

const TableHd = ({ accent, showSelect, cols, isDark }) => (
    <TableHead>
        <TableRow sx={{ bgcolor: alpha(accent, isDark ? 0.1 : 0.06) }}>
            {showSelect && <TH accent={accent}>Select</TH>}
            {cols.map(c => <TH key={c} accent={accent}>{c}</TH>)}
        </TableRow>
    </TableHead>
)

const SearchField = ({ value, onChange, accent }) => (
    <TextField
        placeholder="Search by name…"
        value={value}
        onChange={onChange}
        size="small"
        slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: alpha(accent, 0.6), fontSize: '1.2rem' }} /></InputAdornment> } }}
        sx={{
            width: { xs: '100%', sm: 220 },
            '& .MuiOutlinedInput-root': {
                fontSize: '0.95rem',
                borderRadius: 2,
                '& fieldset': { borderColor: alpha(accent, 0.3) },
                '&:hover fieldset': { borderColor: alpha(accent, 0.5) },
                '&.Mui-focused fieldset': { borderColor: accent },
            },
        }}
    />
)

export default OrderList
