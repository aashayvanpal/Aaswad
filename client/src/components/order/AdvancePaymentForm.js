import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import '../../css/orderForms.scss'
import { useAppTheme } from '../../context/ThemeContext'

const goldBtn = {
    backgroundColor: '#C9A227',
    color: '#000',
    fontWeight: 700,
    fontFamily: 'inherit',
    fontSize: '1rem',
    '&:hover': { backgroundColor: '#e8c84d' },
}

const AdvancePaymentForm = (props) => {
    const { themeMode } = useAppTheme()
    const isDark = themeMode === 'dark'
    const GOLD = '#C9A227'
    const BORDER = isDark ? 'rgba(201,162,39,0.18)' : 'rgba(201,162,39,0.28)'
    const TEXT = isDark ? 'rgba(255,255,255,0.87)' : '#1a1400'

    const inputSx = {
        '& .MuiOutlinedInput-root': {
            bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)',
            borderRadius: '8px',
            fontSize: '1rem',
            color: TEXT,
            '& fieldset': { borderColor: BORDER },
            '&:hover fieldset': { borderColor: 'rgba(201,162,39,0.5)' },
            '&.Mui-focused fieldset': { borderColor: GOLD },
        },
        '& label': { fontSize: '0.95rem', color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.5)' },
        '& label.Mui-focused': { color: GOLD },
        '& label.MuiFormLabel-filled': { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.65)' },
    }

    const [amount, setAmount] = useState(props.advanceAmount || '')

    const handleSubmit = (e) => {
        e.preventDefault()
        props.ShowAdvancePaymentTable(amount)
        props.ShowAdvancePaymentForm()
    }

    return (
        <div className="order-section-card">
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: TEXT, mb: 1.5, mt: 0 }}>
                Advance Payment
            </Typography>
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
                        sx={{ minWidth: 200, ...inputSx }}
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
