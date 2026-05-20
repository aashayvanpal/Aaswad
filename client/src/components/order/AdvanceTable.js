import React from 'react'
import IconButton from '@mui/material/IconButton'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'

const sectionStyle = {
    backgroundColor: 'rgba(201,162,39,0.06)',
    border: '1px solid rgba(201,162,39,0.28)',
    borderRadius: '10px',
    padding: '1.5rem',
    marginTop: '1rem',
}

const AdvanceTable = (props) => {
    return (
        <div style={sectionStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AccountBalanceWalletOutlinedIcon sx={{ color: '#C9A227', fontSize: '1.4rem' }} />
                    <span style={{ fontFamily: 'inherit', fontSize: '1.1rem', fontWeight: 700, color: '#1a1a1a' }}>
                        Advance Payment
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontFamily: 'inherit', fontSize: '1.6rem', fontWeight: 700, color: '#C9A227' }}>
                        &#8377;{props.advanceAmount}
                    </span>
                    <IconButton
                        size="small"
                        onClick={() => { console.log('delete Transport table clicked'); props.deleteTable() }}
                        sx={{ color: '#ef4444', '&:hover': { backgroundColor: 'rgba(239,68,68,0.08)' } }}
                    >
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                </div>
            </div>
        </div>
    )
}

export default AdvanceTable
