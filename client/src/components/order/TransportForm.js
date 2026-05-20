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

const TransportForm = (props) => {
    const [medium, setMedium] = useState(props.medium || '')
    const [price, setPrice] = useState(props.price || '')

    const handleSubmit = (e) => {
        e.preventDefault()
        props.ShowTransportTable(medium, price)
        props.ShowTransportForm()
    }

    return (
        <div style={sectionStyle}>
            <p style={{ fontFamily: 'inherit', fontSize: '1.1rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '1.25rem', marginTop: 0 }}>
                Transport Details
            </p>
            <form onSubmit={handleSubmit}>
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
                    <TextField
                        label="Medium"
                        placeholder="e.g. Truck, Van"
                        value={medium}
                        onChange={(e) => setMedium(e.target.value)}
                        required
                        size="small"
                        sx={{ minWidth: 200 }}
                    />
                    <TextField
                        label="Rate (₹)"
                        placeholder="Amount"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        size="small"
                        type="number"
                        sx={{ minWidth: 150 }}
                    />
                    <Button type="submit" variant="contained" sx={goldBtn}>
                        Save
                    </Button>
                </Stack>
            </form>
        </div>
    )
}

export default TransportForm
