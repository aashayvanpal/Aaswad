import React from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import AddIcon from '@mui/icons-material/Add'
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

const MiscForm = ({ miscItems, setMiscParticulars, handleMiscSubmit }) => {
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

    const handleParticularsChange = (index, e, fieldName) => {
        let oldItems = miscItems
        oldItems[index][fieldName] = e.target.value
        setMiscParticulars([...oldItems])
    }

    const addNewFields = (e) => {
        e.preventDefault()
        setMiscParticulars([...miscItems, { particular: '', rate: '' }])
    }

    const handleDeleteField = (e, index) => {
        e.preventDefault()
        miscItems.splice(index, 1)
        setMiscParticulars([...miscItems])
    }

    return (
        <div className="order-section-card">
            <div className="order-section-header--mb-lg">
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: TEXT, m: 0 }}>
                    Extras / Misc Items
                </Typography>
                <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addNewFields}
                    sx={{ borderColor: '#C9A227', color: '#C9A227', fontFamily: 'inherit', fontWeight: 600, '&:hover': { borderColor: '#e8c84d', backgroundColor: 'rgba(201,162,39,0.06)' } }}
                >
                    Add Row
                </Button>
            </div>

            <form onSubmit={handleMiscSubmit}>
                <Stack spacing={1.5} sx={{ mb: 2 }}>
                    {miscItems.map((item, index) => (
                        <Stack key={index} direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
                            <TextField
                                label="Particular"
                                placeholder="Description"
                                size="small"
                                value={item.particular}
                                onChange={(e) => handleParticularsChange(index, e, 'particular')}
                                sx={{ flex: 1, minWidth: 160, ...inputSx }}
                            />
                            <TextField
                                label="Rate (₹)"
                                placeholder="Amount"
                                size="small"
                                type="number"
                                value={item.rate}
                                onChange={(e) => handleParticularsChange(index, e, 'rate')}
                                sx={{ width: 140, ...inputSx }}
                            />
                            <IconButton
                                onClick={(e) => handleDeleteField(e, index)}
                                size="small"
                                sx={{ color: '#ef4444', '&:hover': { backgroundColor: 'rgba(239,68,68,0.08)' } }}
                            >
                                <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                    ))}
                </Stack>

                {miscItems.length > 0 && (
                    <Button type="submit" variant="contained" sx={goldBtn}>
                        Save
                    </Button>
                )}
            </form>
        </div>
    )
}

export default MiscForm
