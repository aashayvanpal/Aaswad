import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import '../../css/orderForms.scss'

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
        <div className="order-section-card">
            <p className="order-section-title--p">
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
