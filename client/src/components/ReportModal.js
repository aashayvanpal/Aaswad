import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import {
    Table, TableHead, TableBody, TableRow, TableCell,
    Typography, Chip, Box, Stack,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import AssessmentIcon from '@mui/icons-material/Assessment'
import InboxIcon from '@mui/icons-material/Inbox'
import { useAppTheme } from '../context/ThemeContext'

const GOLD = '#C9A227'
const GOLD_HOVER = '#e8c84d'

const STATUS_META = {
    approve:   { label: 'Pending',   bg: 'rgba(201,162,39,0.18)',  color: '#8a6500' },
    confirmed: { label: 'Confirmed', bg: 'rgba(67,160,71,0.15)',   color: '#2e7d32' },
    completed: { label: 'Completed', bg: 'rgba(120,144,156,0.18)', color: '#455a64' },
}

const statusMeta = (status) => STATUS_META[status] || { label: status, bg: 'rgba(120,144,156,0.15)', color: '#546e7a' }

const ReportModal = ({ buttonLabel, report = [] }) => {
    const [open, setOpen] = useState(false)
    const { themeMode } = useAppTheme()
    const isDark = themeMode === 'dark'

    const safeReport = report || []
    const grandTotal    = safeReport.reduce((acc, o) => acc + (o.amount || 0), 0)
    const pendingTotal  = safeReport.filter(o => o.status === 'approve').reduce((acc, o) => acc + (o.amount || 0), 0)
    const confirmedTotal = safeReport.filter(o => o.status === 'confirmed').reduce((acc, o) => acc + (o.amount || 0), 0)

    const paperBg   = isDark ? '#1a1800' : '#fff'
    const borderCol = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'
    const textPrimary = isDark ? 'rgba(255,255,255,0.9)' : '#1a1400'
    const textMuted   = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)'

    return (
        <>
            <Button
                variant="contained"
                startIcon={<AssessmentIcon />}
                onClick={() => setOpen(true)}
                sx={{
                    bgcolor: GOLD,
                    color: '#3d2e00 !important',
                    fontWeight: 700,
                    borderRadius: 3,
                    px: 2.5,
                    py: 1,
                    fontSize: '0.9rem',
                    boxShadow: `0 2px 12px ${alpha(GOLD, 0.35)}`,
                    '&:hover': { bgcolor: GOLD_HOVER, boxShadow: `0 4px 18px ${alpha(GOLD, 0.45)}`, transform: 'translateY(-1px)' },
                    transition: 'all 0.2s',
                }}
            >
                {buttonLabel}
            </Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="md"
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: 3,
                            bgcolor: paperBg,
                            border: `1px solid ${alpha(GOLD, isDark ? 0.2 : 0.15)}`,
                            boxShadow: isDark
                                ? `0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px ${alpha(GOLD, 0.1)}`
                                : `0 24px 64px rgba(0,0,0,0.15)`,
                            overflow: 'hidden',
                        },
                    },
                }}
            >
                {/* ── Header ─────────────────────────────────────────────── */}
                <DialogTitle sx={{ p: 0 }}>
                    <Box sx={{
                        px: 3, py: 2.5,
                        background: `linear-gradient(135deg, ${alpha(GOLD, isDark ? 0.18 : 0.12)} 0%, ${alpha(GOLD, isDark ? 0.06 : 0.04)} 100%)`,
                        borderBottom: `1px solid ${alpha(GOLD, isDark ? 0.2 : 0.15)}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                            <Box sx={{
                                bgcolor: alpha(GOLD, 0.15),
                                borderRadius: 1.5,
                                p: 0.8,
                                display: 'flex',
                                color: GOLD,
                            }}>
                                <AssessmentIcon sx={{ fontSize: '1.4rem' }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: textPrimary, lineHeight: 1.1 }}>
                                    Selected Orders Report
                                </Typography>
                                <Typography sx={{ fontSize: '0.82rem', color: textMuted, mt: 0.2 }}>
                                    {safeReport.length} {safeReport.length === 1 ? 'order' : 'orders'} selected
                                </Typography>
                            </Box>
                        </Stack>
                        <IconButton onClick={() => setOpen(false)} size="small" sx={{
                            color: textMuted,
                            '&:hover': { color: textPrimary, bgcolor: alpha(GOLD, 0.1) },
                        }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                {/* ── Table ──────────────────────────────────────────────── */}
                <DialogContent sx={{ p: 0 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(GOLD, isDark ? 0.08 : 0.05) }}>
                                {['#', 'Customer', 'Amount (₹)', 'Status'].map((h, idx) => (
                                    <TableCell key={h} align={idx === 2 ? 'right' : 'left'} sx={{
                                        fontWeight: 700,
                                        fontSize: '0.82rem',
                                        color: alpha(GOLD, 0.85),
                                        letterSpacing: '0.06em',
                                        textTransform: 'uppercase',
                                        borderBottom: `1px solid ${alpha(GOLD, isDark ? 0.15 : 0.12)}`,
                                        py: 1.5,
                                        px: { xs: 1.5, md: 2.5 },
                                    }}>
                                        {h}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {safeReport.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} sx={{ border: 'none', py: 6 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <InboxIcon sx={{ fontSize: '2.5rem', color: textMuted, mb: 1 }} />
                                            <Typography sx={{ color: textMuted, fontSize: '0.95rem' }}>
                                                No orders selected
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : safeReport.map((order, i) => {
                                const meta = statusMeta(order.status)
                                return (
                                    <TableRow key={i} sx={{
                                        transition: 'background 0.15s',
                                        '&:hover': { bgcolor: alpha(GOLD, isDark ? 0.06 : 0.04) },
                                        '&:not(:last-child) td': { borderBottom: `1px solid ${borderCol}` },
                                        '&:last-child td': { borderBottom: 'none' },
                                    }}>
                                        <TableCell sx={{ py: 1.8, px: { xs: 1.5, md: 2.5 }, width: 48 }}>
                                            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: alpha(GOLD, 0.7) }}>
                                                {i + 1}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ py: 1.8, px: { xs: 1.5, md: 2.5 } }}>
                                            <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: textPrimary }}>
                                                {order.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right" sx={{ py: 1.8, px: { xs: 1.5, md: 2.5 }, whiteSpace: 'nowrap' }}>
                                            <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: GOLD, fontVariantNumeric: 'tabular-nums' }}>
                                                ₹{(order.amount || 0).toLocaleString('en-IN')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ py: 1.8, px: { xs: 1.5, md: 2.5 } }}>
                                            <Chip
                                                label={meta.label}
                                                size="small"
                                                sx={{
                                                    bgcolor: meta.bg,
                                                    color: meta.color,
                                                    fontWeight: 700,
                                                    fontSize: '0.78rem',
                                                    letterSpacing: '0.02em',
                                                    border: `1px solid ${alpha(meta.color, 0.25)}`,
                                                    height: 24,
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>

                    {/* ── Summary footer ──────────────────────────────────── */}
                    {safeReport.length > 0 && (
                        <Box sx={{
                            px: { xs: 2, md: 3 },
                            py: 2.5,
                            borderTop: `1px solid ${alpha(GOLD, isDark ? 0.15 : 0.12)}`,
                            background: `linear-gradient(135deg, ${alpha(GOLD, isDark ? 0.1 : 0.06)} 0%, transparent 70%)`,
                        }}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
                                {/* Per-status breakdown */}
                                <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                    {pendingTotal > 0 && (
                                        <Box sx={{
                                            px: 1.5, py: 0.7, borderRadius: 2,
                                            bgcolor: 'rgba(201,162,39,0.12)',
                                            border: '1px solid rgba(201,162,39,0.25)',
                                        }}>
                                            <Typography sx={{ fontSize: '0.75rem', color: '#8a6500', fontWeight: 600, mb: 0.1 }}>Pending</Typography>
                                            <Typography sx={{ fontSize: '0.95rem', fontWeight: 800, color: '#8a6500' }}>
                                                ₹{pendingTotal.toLocaleString('en-IN')}
                                            </Typography>
                                        </Box>
                                    )}
                                    {confirmedTotal > 0 && (
                                        <Box sx={{
                                            px: 1.5, py: 0.7, borderRadius: 2,
                                            bgcolor: 'rgba(67,160,71,0.1)',
                                            border: '1px solid rgba(67,160,71,0.22)',
                                        }}>
                                            <Typography sx={{ fontSize: '0.75rem', color: '#2e7d32', fontWeight: 600, mb: 0.1 }}>Confirmed</Typography>
                                            <Typography sx={{ fontSize: '0.95rem', fontWeight: 800, color: '#2e7d32' }}>
                                                ₹{confirmedTotal.toLocaleString('en-IN')}
                                            </Typography>
                                        </Box>
                                    )}
                                </Stack>

                                {/* Grand total hero */}
                                <Box sx={{
                                    px: 2.5, py: 1.2, borderRadius: 2.5,
                                    bgcolor: alpha(GOLD, isDark ? 0.15 : 0.1),
                                    border: `1.5px solid ${alpha(GOLD, 0.35)}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    flexShrink: 0,
                                }}>
                                    <Box>
                                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: alpha(GOLD, 0.75), letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                            Grand Total
                                        </Typography>
                                        <Typography sx={{ fontSize: '1.6rem', fontWeight: 900, color: GOLD, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
                                            ₹{grandTotal.toLocaleString('en-IN')}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Stack>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ReportModal
