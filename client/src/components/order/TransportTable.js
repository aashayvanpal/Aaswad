import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import '../../css/orderForms.scss'

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
    borderBottom: 'none',
    fontSize: '1rem',
}

const TranportTable = (props) => {
    return (
        <div className="order-section-card">
            <div className="order-section-header--mb">
                <div className="order-section-left">
                    <LocalShippingOutlinedIcon sx={{ color: '#C9A227', fontSize: '1.4rem' }} />
                    <span className="order-section-title">Transport</span>
                </div>
                <IconButton
                    size="small"
                    onClick={() => { console.log('delete Transport table clicked'); props.deleteTable() }}
                    sx={{ color: '#ef4444', '&:hover': { backgroundColor: 'rgba(239,68,68,0.08)' } }}
                >
                    <DeleteOutlineIcon fontSize="small" />
                </IconButton>
            </div>

            <TableContainer sx={{ borderRadius: '8px', border: '1px solid rgba(201,162,39,0.2)', overflow: 'hidden' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={thCell}>Medium</TableCell>
                            <TableCell sx={{ ...thCell, textAlign: 'right' }}>Rate</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{ ...tdCell, fontWeight: 600 }}>{props.medium}</TableCell>
                            <TableCell sx={{ ...tdCell, textAlign: 'right', fontWeight: 700, color: '#C9A227', fontSize: '1.1rem' }}>
                                &#8377;{props.rate}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default TranportTable
