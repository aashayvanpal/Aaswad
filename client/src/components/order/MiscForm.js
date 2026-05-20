// this is dynamic form when we need to extend the form contents
import React from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import AddIcon from '@mui/icons-material/Add'

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

const MiscForm = ({ miscItems, setMiscParticulars, handleMiscSubmit }) => {

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
        <div style={sectionStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <p style={{ fontFamily: 'inherit', fontSize: '1.1rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                    Extras / Misc Items
                </p>
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
                                sx={{ flex: 1, minWidth: 160 }}
                            />
                            <TextField
                                label="Rate (₹)"
                                placeholder="Amount"
                                size="small"
                                type="number"
                                value={item.rate}
                                onChange={(e) => handleParticularsChange(index, e, 'rate')}
                                sx={{ width: 140 }}
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
