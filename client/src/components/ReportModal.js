import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {
    Table, TableHead, TableBody, TableRow, TableCell,
    Typography, Chip, Box, Divider,
} from '@mui/material'
import AssessmentIcon from '@mui/icons-material/Assessment'

const GOLD = '#C9A227'

const ReportModal = ({ buttonLabel, report = [] }) => {
    const [open, setOpen] = useState(false)

    const grandTotal = report.reduce((acc, o) => acc + (o.amount || 0), 0)
    const approveTotal = report.filter(o => o.status === 'approve').reduce((acc, o) => acc + (o.amount || 0), 0)

    return (
        <>
            <Button
                variant="contained"
                startIcon={<AssessmentIcon />}
                onClick={() => setOpen(true)}
                sx={{
                    bgcolor: GOLD,
                    color: '#3d2e00',
                    fontWeight: 700,
                    '&:hover': { bgcolor: '#e8c84d' },
                }}
            >
                {buttonLabel}
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm"
                slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
                <DialogTitle sx={{
                    bgcolor: GOLD, color: '#3d2e00', fontWeight: 700,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                    Selected Orders Report
                    <IconButton onClick={() => setOpen(false)} size="small" sx={{ color: '#3d2e00' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 0 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'rgba(201,162,39,0.12)' }}>
                                <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 700 }} align="right">Amount (₹)</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {report.map((order, i) => (
                                <TableRow key={i} hover>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell>{order.name}</TableCell>
                                    <TableCell align="right">{(order.amount || 0).toLocaleString('en-IN')}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={order.status}
                                            size="small"
                                            sx={{
                                                bgcolor: order.status === 'approve' ? 'rgba(201,162,39,0.2)' : 'rgba(46,125,50,0.15)',
                                                color: order.status === 'approve' ? '#7a5e00' : '#2e7d32',
                                                fontWeight: 600,
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {report.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                        No orders selected
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </DialogContent>

                <Divider />
                <DialogActions sx={{ px: 3, py: 2, flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">Pending approval total:</Typography>
                        <Typography fontWeight={700} color="#b07d00">₹{approveTotal.toLocaleString('en-IN')}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Typography variant="body1" fontWeight={600}>Grand total:</Typography>
                        <Typography variant="h6" fontWeight={700} color={GOLD}>₹{grandTotal.toLocaleString('en-IN')}</Typography>
                    </Box>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ReportModal
