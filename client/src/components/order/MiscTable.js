import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'

const sectionStyle = {
    backgroundColor: 'rgba(201,162,39,0.06)',
    border: '1px solid rgba(201,162,39,0.28)',
    borderRadius: '10px',
    padding: '1.5rem',
    marginTop: '1rem',
}

const thCell = {
    backgroundColor: 'rgba(201,162,39,0.14)',
    color: '#6b7280',
    fontWeight: 700,
    fontSize: '0.8rem',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    fontFamily: 'inherit',
    padding: '0.75rem 1rem',
    borderBottom: '2px solid rgba(201,162,39,0.3)',
}

const tdCell = {
    fontFamily: 'inherit',
    color: '#1a1a1a',
    padding: '0.875rem 1rem',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    fontSize: '1rem',
}

const MiscTable = ({ miscItems, editMiscTable, deleteMiscTable }) => {
    return (
        <div style={sectionStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ReceiptLongOutlinedIcon sx={{ color: '#C9A227', fontSize: '1.4rem' }} />
                    <span style={{ fontFamily: 'inherit', fontSize: '1.1rem', fontWeight: 700, color: '#1a1a1a' }}>Extras</span>
                </div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <IconButton
                        size="small"
                        onClick={editMiscTable}
                        sx={{ color: '#C9A227', '&:hover': { backgroundColor: 'rgba(201,162,39,0.1)' } }}
                    >
                        <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={deleteMiscTable}
                        sx={{ color: '#ef4444', '&:hover': { backgroundColor: 'rgba(239,68,68,0.08)' } }}
                    >
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                </div>
            </div>

            <TableContainer sx={{ borderRadius: '8px', border: '1px solid rgba(201,162,39,0.2)', overflow: 'hidden' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={thCell}>Particular</TableCell>
                            <TableCell sx={{ ...thCell, textAlign: 'right' }}>Rate</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {miscItems.map((item, index) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td': { borderBottom: 'none' }, '&:hover': { backgroundColor: 'rgba(201,162,39,0.04)' } }}
                            >
                                <TableCell sx={tdCell}>{item.particular}</TableCell>
                                <TableCell sx={{ ...tdCell, textAlign: 'right', fontWeight: 700, color: '#C9A227' }}>
                                    &#8377;{item.rate}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default MiscTable
