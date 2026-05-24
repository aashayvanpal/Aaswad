import React from 'react'
import IconButton from '@mui/material/IconButton'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import '../../css/orderForms.scss'

const AdvanceTable = (props) => {
    return (
        <div className="order-section-card">
            <div className="order-section-header">
                <div className="order-section-left">
                    <AccountBalanceWalletOutlinedIcon sx={{ color: '#C9A227', fontSize: '1.4rem' }} />
                    <span className="order-section-title">
                        Advance Payment
                    </span>
                </div>
                <div className="order-section-right">
                    <span className="order-advance-amount">
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
