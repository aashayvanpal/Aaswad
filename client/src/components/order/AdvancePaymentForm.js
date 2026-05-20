import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

const sectionStyle = {
    backgroundColor: 'rgba(201,162,39,0.06)',
    border: '1px solid rgba(201,162,39,0.28)',
    borderRadius: '10px',
    padding: '1.5rem',
    marginTop: '1rem',
}

const goldBtn = {
    backgroundColor: '#C9A227',
    color: '#000',
    fontWeight: 700,
    fontFamily: 'inherit',
    '&:hover': { backgroundColor: '#e8c84d' },
}

const AdvancePaymentForm = (props) => {
    const [amount, setAmount] = useState(props.advanceAmount || '')

    const handleSubmit = (e) => {
        e.preventDefault()
        props.ShowAdvancePaymentTable(amount)
        props.ShowAdvancePaymentForm()
    }

    return (
        <div style={sectionStyle}>
            <p style={{ fontFamily: 'inherit', fontSize: '1.1rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '1.25rem', marginTop: 0 }}>
                Advance Payment
            </p>
            <form onSubmit={handleSubmit}>
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
                    <TextField
                        label="Amount (₹)"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        size="small"
                        type="number"
                        sx={{ minWidth: 200 }}
                    />
                    <Button type="submit" variant="contained" sx={goldBtn}>
                        Save
                    </Button>
                </Stack>
            </form>
        </div>
    )
}

export default AdvancePaymentForm
